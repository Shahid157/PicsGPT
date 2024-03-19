import { supabase } from "../../../supabase"

export default async function handler(req, res) {
    console.log("🚀 ~ file: garment.js:6 ~ handler ~ req.body:", req.body)
    const { data: d } = await supabase.from('pricing_methods_v2').select('*').order('sequence', { ascending: true })
    const { data: home_aiPricing } = await supabase.from('homeAi_payment_methods').select('*').eq('hidden', 'FALSE').order('sequence', { ascending: true })
    res.send({ pricing: d, home_ai: home_aiPricing })
}
