import { supabase } from "../../../supabase"

export default async function handler(req, res) {
    req.body = JSON.parse(req.body)
    const { data } = await supabase.from('home-ai_results').select('*').eq('user_id', req.body.user_id)
    res.send({ data })
}
