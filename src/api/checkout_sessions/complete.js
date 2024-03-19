import { supabase } from '../../../supabase'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const user_id = req.query.user_id;
  const sess_id = req.query.session_id
  const payment_method_id = req.query.payment_method_id
  const type = req.query.type
  const user_payment = req.query.user_payment
  const user_credit = req.query.user_credit
  const creditUsed = req.query.creditUsed
  // const homeAi = req.query.home_ai
  if (!user_id) return res.send({ error: "Invalid request body" })
  const { data: paymentDetail } = await supabase.from('payment_details').select('*').eq('session_id', sess_id).eq('user_id', user_id).eq('payment_method_id', payment_method_id).maybeSingle();
  if (paymentDetail) {
    return res.send({ ...paymentDetail })
  } else {
    const paymentMethod = await supabase.from('pricing_methods_v2').select('*').eq('id', payment_method_id).maybeSingle()
    // const paymentMethodHomeAi = await supabase.from('homeAi_payment_methods').select('*').eq('id', payment_method_id).maybeSingle()

    const session = await stripe.checkout.sessions.retrieve(sess_id);
    if (!session && session.status !== 'complete') return res.status(500).json({ error: "session not found" })
    const requestObj = {
      user_id: user_id,
      session_id: session.id,
      mode: session.mode,
      payment_method_id: payment_method_id,
      priority: paymentMethod?.data?.priority || 2,
      credit_left: payment_method_id === 'custom-payment' || payment_method_id === 'modal_purchase' ? Number((session?.amount_total / 300)) : type === 'MONTH' ? paymentMethod.data.credits : paymentMethod.data.credits * 12,
      plan_name: paymentMethod?.data?.payment_name,
      ...(session.payment_intent && { payment_intent: session.payment_intent }),
      ...(session.subscription && { subscription_id: session.subscription }),
      ...(session.invoice && { invoice_id: session.invoice })
    }
    if (payment_method_id === 'custom-payment') {
      const stripeDetails = await supabase
        .from('payment_details')
        .update({ credit_left: (Number(requestObj.credit_left) + Number(user_credit)) - creditUsed })
        .eq('user_id', user_id)
        .eq('id', user_payment);
      return res.send(JSON.stringify(stripeDetails))
    }
    else if (payment_method_id === 'modal_purchase') {
      const resp = await supabase.from("payment_details").select("*").eq("user_id", user_id).maybeSingle()
      const response = await supabase.from("payment_details").update({ modal_limit: resp.data?.modal_limit + requestObj.credit_left }).eq("user_id", user_id)
      res.send(response)
    }
    else {
      const stripeDetails = await supabase
        .from('payment_details')
        .update({
          user_id: requestObj.user_id,
          session_id: requestObj.session_id,
          mode: requestObj.mode,
          payment_method_id: requestObj.payment_method_id,
          priority: paymentMethod.data.priority || 2,
          credit_left: Number(requestObj.credit_left) + Number(user_credit),
          payment_intent: requestObj.payment_intent,
          subscription_id: requestObj.subscription_id,
          invoice_id: requestObj.invoice_id,
          plan_name: requestObj.plan_name

        })
        .eq('user_id', user_id)
        .eq('id', user_payment);
      return res.send(JSON.stringify(stripeDetails))
    }
  }
}