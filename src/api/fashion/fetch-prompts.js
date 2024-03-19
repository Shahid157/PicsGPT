import { supabase } from "../../../supabase"

export default async function handler(req, res) {
    console.log("🚀 ~ file: garment.js:6 ~ handler ~ req.body:", req.body)
    const { data: d } = await supabase.from('Prompts').select('*').eq('hidden', 'FALSE').order('priority', { ascending: true })
    res.send(d)
}
