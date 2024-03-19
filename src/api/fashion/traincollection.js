import { supabase } from "../../../supabase";
import { insertProducts } from "models/garment";

export const getIp = (req) => {
  const ip = req.headers['x-real-ip'] || ''
  return { ip, referer: req.headers.referer }
}
export default async function handler(req, res) {
  const requestMethod = req.method;
  req.body = JSON.parse(req.body)
  const sess_id = req.body.sess_id;
  const collection = req.body.collection;
  const shirt = req.body.fashion_collection_id;
  const payment_id = req.body.payment_id;
  const priority = req.body.priority || 1;
  const user_id = req.body.user_id || null;

  const responsePromises = collection.flatMap((models) =>
  shirt.map((style) =>
    fetch(
      `${process.env.CM1_BASE_URL}gpu_train_fashion.php?ses_id=${sess_id}&person=${models}&shirt=${style}&person_key=man&priority=${priority}&user=${user_id}&order=${payment_id}&restrain=1`,
      { method: 'GET' }
    )
      .then((resp) => resp.json())
      .then((response) => ({ ...response, person_id: models, garment_id: style }))
  )
);

const responseArray = await Promise.all(responsePromises);

  if (payment_id) {
    const { data } = await supabase.from('payment_details').select('*').eq('id', payment_id).eq('user_id', user_id).gt('credit_left', 0).maybeSingle()
    if (data) {
      for (let res of responseArray) {
        const result = await supabase.from('infer_details').select('*').eq('user_id', user_id).eq('payment_details_id', payment_id).eq('training_id', res?.collection_id || '').maybeSingle()
        if (!result.data) {
          await insertProducts('infer_details', {
            payment_details_id: payment_id,
            garment_id: res.garment_id,
            person_id: res.person_id,
            user_id: user_id,
            training_id: res?.collection_id || ''
          })
        }
      }
   
    }
  }
  switch (requestMethod) {
    case 'POST':
      return res.status(200).json(responseArray)
    default:
      return res.status(200).json(responseArray)
  }
}