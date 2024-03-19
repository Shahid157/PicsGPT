
import { supabase } from '../../../supabase'
import { getLogger } from "logging/log-util";
import { getIp } from "./traincollection"; 

const logger = getLogger();

export default async function handler(req, res) {
    logger.info('==============> coming in gpucollection api ==========>')
    const requestMethod = req.method;
    req.body = JSON.parse(req.body)
    const body = req.body.data;
    const user_id = req.body.user_id
    const details = req.body.details
    const sess_id = req.body.sess_id;
    const query = req.body.query;
    const type = req.body.type
    const garment_type = req.body.garment_type
    const userAgent = req.body.userAgent;
    const isInsert = req.body.isInsert
    const { ip, referer } = getIp(req)
    const url = `${process.env.CM1_BASE_URL}gpu_create_collection.php?ses_id=${sess_id}&REFERAL_URL=${referer}&CLIENT_BROWSER=${userAgent}&CLIENT_IP=${ip}${query}`
    const resp = await fetch(url, {
      method: requestMethod,
      ...( requestMethod !== 'GET' && { body: JSON.stringify(body) } )
    });
    const response = await resp.json()

    if (response.id && isInsert ) {
      const { data: alreadyExist } = await supabase.from('user_collection_details').select('*').or(`person_id.eq.${response.id}`, `garment_id.eq.${response.id}`).eq('user_id', user_id).maybeSingle()
      if (!alreadyExist) {
        await supabase.from('user_collection_details').insert({
          user_id,
          ...(!!details?.full_name &&  { full_name: details.full_name}),
          url: body[0],
          '3d-url': body[0],
          collection: body,
          ...(!!details?.gender && { gender: details.gender }),
          ...(type === 'model' && { person_id : response.id }),
          ...(type === 'garment' && {garment_id: response.id,}),
          ...(type === 'garment' && {full_name: 'Garment',}),
          ...(type === 'garment' && {garment_type: garment_type}),

          type: type
        }).select('*')
       if(type==='model'){
        const resp = await supabase.from("payment_details").select("*").eq("user_id" , user_id).maybeSingle()
        await supabase.from("payment_details").update({modal_used : resp.data?.modal_used + 1}).eq("user_id" ,user_id)
       }
      }
    }

    switch (requestMethod) {
      case 'POST':
        return res.status(200).json(response)
      default:
        return res.status(200).json(response)
    }
  }