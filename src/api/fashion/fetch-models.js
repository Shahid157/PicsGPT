import { supabase } from "../../../supabase"

export default async function handler(req, res) {
    console.log("🚀 ~ file: garment.js:6 ~ handler ~ req.body:", req.body)
    const { data: d } = await supabase.from('FreeModels').select('*').eq('hidden', 'FALSE').order('order_by', { ascending: false })
    const { data: model } = await supabase.from('Models').select('*').eq('hidden', 'FALSE').order('id', { ascending: false })
    res.send({ free: d, models: model.map(i => { return { ...i, demo: true } }) })
}
