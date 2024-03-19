export default async function handler(req, res) {
    const requestMethod = req.method;
    const body = req.body;
    const resp = await fetch(`${process.env.CM1_BASE_URL}login.php`, {
      method: requestMethod,
      ...( requestMethod !== 'GET' && { body: body } ),
     
    });
    const response = await resp.json()
    switch (requestMethod) {
      case 'POST':
       return  res.status(200).json(response)
      default:
       return  res.status(200).json(response)
    }
  }