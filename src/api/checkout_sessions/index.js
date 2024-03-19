const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const callBackRoute = req.query.callback || '/create'
  const mode = req.query.mode || 'payment'
  const payment_method_id = req.query.payment_method_id;
  const pricing_page = req.query.pricing_page;
  const type = req.query.type || 'MONTH';
  const quantity = req.query?.quantity || 1
  const selectedKey = req.query.selectedKey
  if (req.method === 'POST') {
    try {
      const price_id = req.query.price_id
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price_id,
            quantity: quantity
          }
        ],
        ...(req.query.email && {customer_email: req.query.email}),
        mode: mode,
        billing_address_collection: 'auto',
        success_url: `${req.headers.origin}${callBackRoute}${selectedKey ? `&key=${selectedKey}` : ''}&success=true&session_id={CHECKOUT_SESSION_ID}&payment_method_id=${payment_method_id}&type=${type}&pricing_page=${pricing_page || 0}`,
        cancel_url: `${req.headers.origin}${callBackRoute}&canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {  
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}