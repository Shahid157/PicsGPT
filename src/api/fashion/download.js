export default async function handler(req, res) {
  req.body = JSON.parse(req.body)
  const data = await fetch(req.body.url, {
    method: 'GET'
  }).then(response => {
    const contentType = response.headers.get('content-type');
    if (contentType && (contentType.includes('application/json') || contentType.includes('image/'))) {
      return response.arrayBuffer()
    } else if (contentType && contentType.includes('text/plain')) {
      return response.text();
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
  })
  if (typeof data === 'string') {
    return res.send({ url: data })
  } else {
    const buffer = Buffer.from(data);
    const base64 = 'data:image/jpeg;base64,' + buffer.toString('base64');
    return res.send({ url: base64 })
  }
}