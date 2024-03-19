import { supabase } from '../../../supabase'

export default async function handler(req, res) {

  req.body = JSON.parse(req.body)
  const data = req.body.data

  const { data: alreadyExist } = await supabase.from('payment_details').select('*').eq('user_id', data.user_id).limit(1).single()
  if (!alreadyExist) {
   await supabase.from('payment_details').insert({
        user_id : data.user_id,
        mode : data.mode,
        priority : data.priority,
        credit_left : data.credit_left,
        email_id : data.email_id
    }).select('*')
  }
  return res.status(200).json(alreadyExist)

}