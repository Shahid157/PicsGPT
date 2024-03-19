import { supabase } from '../../../supabase'
import { getLogger } from "logging/log-util";
const logger = getLogger();
export default async function handler(req, res) {
  const requestMethod = req.method;
  logger.info('==============> coming in styley_generation api ==========>')
  if (requestMethod === 'GET') {
    const generation = req.query.generation_id;
    console.log('comnig in generation', generation)
    const { data, error } = await supabase.from('styley_generation').select('*').eq('generation_id', generation);
    return res.send(error ? [] : data)
  }
  const data = req.body.data;
  if(data.mode === 'insert'){
  await Promise.all(
    data.garment_id?.map((x) => {
      return new Promise(async () => {
        const { save } = await supabase.from('styley_generation').insert({
          user_id: data.user_id,
          person_id: data.person_id,
          garment_id: x,
          generation_id: data.generation_id,
          prompt: data.prompt,
          payment_id: data.payment_id,
          priority: data.priority,
          prompt_type: data.prompt_type,
          credit_status: data.credit_status
        }).select('*')
        res.send(save)
      })
    })
  ) }

  else if (data.mode === 'credit_status'){
    console.log("------------------------------------------------------ " , data)
    const save = await supabase.from('styley_generation').update({credit_status : data?.credit_status})
    .eq('user_id', data.user_id)
    .eq('generation_id', data.generation_id)
    .eq('garment_id', data?.garment_id);
    res.send(save)
  }
  else{
    const {save} = await supabase.from('styley_generation').update({private : data?.private , payment : data?.payment})
    .eq('user_id', data.user_id)
    .eq('generation_id', data.generation_id)
    .eq('garment_id', data?.garment_id);
    res.send(save)
  }
}