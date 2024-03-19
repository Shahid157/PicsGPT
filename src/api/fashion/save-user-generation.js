import { supabase } from '../../../supabase'
import { getLogger } from "logging/log-util";
const logger = getLogger();
export default async function handler(req, res) {
  logger.info('==============> coming in save_generation api ==========>')
  const requestMethod = req.method;
  req.body = JSON.parse(req.body)
  const body = req.body.data;
  const user_id = req.body.user_id
  const collection_id = req.body.collection_id;
  const inference_id = req.body.inference_id;
  const payment_id = req.body.payment_id;
  const generate_id = req.body.generate_id
  const usedItems = req.body.usedItems
  const { data: alreadyExist } = await supabase.from('user_generations').select('*').eq('collection_id', collection_id).eq('inference_id', inference_id).eq('generate_id' , generate_id)
  if ((alreadyExist?.length === 0) && body.length > 0 && user_id) {
    await supabase.from('user_generations').insert({
      user_id: user_id,
      url: body[0].original,
      collection: body.map(i => i.original),
      inference_id: inference_id,
      collection_id: collection_id,
      payment_id: payment_id,
      generate_id : generate_id,
      usedItems : usedItems
    }).select('*')
  }
  else if (alreadyExist?.length && alreadyExist[0].usedItems === null && usedItems.usedModel){
    await supabase.from('user_generations').update({
      usedItems : usedItems
    }).eq('collection_id', collection_id).eq('inference_id', inference_id).eq('generate_id' , generate_id)
  }
  switch (requestMethod) {
    case 'POST':
      return res.status(200).json(alreadyExist)
    default:
      return res.status(200).json(alreadyExist)
  }
}