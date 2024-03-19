export default async function handler(req, res) {
    const requestMethod = req.method;
    const sess_id = req.query.sess_id;
    const training_id = req.query.training_id;
    const resp = await fetch(`${process.env.CM1_BASE_URL}gpu_get_collection.php?ses_id=${sess_id}&id=${training_id}`, {
      method: requestMethod
     
    });
    const response = await resp.json()
    switch (requestMethod) {
      case 'GET':
       return  res.status(200).json(response)
      default:
       return  res.status(200).json(response)
    }
  }