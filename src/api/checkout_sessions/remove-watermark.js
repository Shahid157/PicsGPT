import { supabase } from '../../../supabase'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const user_id = req.query.user_id;
    const sess_id = req.query.session_id
    const generation_id = req.query.generation_id
    const removeWatermarkFrom = Number(req.query.key)
    const generation_details = await supabase.from('styley_results').select('*').eq('id', generation_id).single()
    if (generation_details.data) {
        if (generation_details.data.user_id == user_id) {
            if (!generation_details.data.results[removeWatermarkFrom]?.withoutWatermark) {
                const session = await stripe.checkout.sessions.retrieve(sess_id);
                if (!session && session.status !== 'complete') return res.status(500).json({ error: "session not found" })
                let resultData = [ ...generation_details.data.results ]
                if (isNaN(removeWatermarkFrom)) {
                    resultData = resultData.map(i => { return { ...i, payment_id: sess_id, withoutWatermark: true }})
                } else {
                    resultData[removeWatermarkFrom] = { ...resultData[removeWatermarkFrom], withoutWatermark: true, payment_id: sess_id }
                }
                await supabase.from('styley_results').update({ results: resultData }).eq('id', generation_id).eq('user_id', user_id)
                return res.json({ success: true, redirect: false, data: { ...generation_details.data, results: resultData } })
            } else {
                return res.json({ success: true, redirect: false, data: generation_details.data })
            }
        } else {
            return res.json({ success: false, redirect: false, data: generation_details.data })
        }
    } else {
        return res.json({ error: true })
    }

}