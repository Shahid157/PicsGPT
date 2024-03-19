import { supabase } from "../../../supabase"

export default async function handler(req, res) {
  req.body = JSON.parse(req.body)
  const data = req.body.data
  const user_id = req.body.user_id



  const response = await supabase.from('Users').update(data).eq('user_id', user_id)

  return res.send(response)

}
