import { supabase } from "../../../supabase"

export default async function handler(req, res) {
    const user_id = req.query.user_id
    let canUserPayment = await supabase
        .from('payment_details').select('*')
        .eq('user_id', user_id).order('credit_left', { ascending: false })
    return res.send({ success: true, enablePay: canUserPayment.data[0] }) 
}
