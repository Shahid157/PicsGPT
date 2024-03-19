import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export default async function handler(req, res) {
req.body = JSON.parse(req.body)
const data = req.body.data

try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: data.payment_method_types,
      line_items: [
        {
          price_data: {
            currency : data.currency,   
            unit_amount: data.amount,
            product_data: {
              name: 'Credit',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: data.successUrl + `?sessionId=${session.id}`,
      cancel_url: data.cancelUrl + `?sessionId=${session.id}`,
    });
    return res.status(200).json(session)
  } catch (error) {
    console.error('Error creating session payment:', error);
  }

}