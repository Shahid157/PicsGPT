const { LRUCache } = require('lru-cache');
const cache = new LRUCache({ 
  max: 100,  // maximum number of items in the cache
  maxAge: 1000 * 60 * 60 // TTL of each item in milliseconds (1 hour in this case)
});

export default async function handler(req, res) {
  const requestMethod = req.method;
  req.body = JSON.parse(req.body)
  const collections = req.body.collection
  const overLayImage = process.env.OVERLAY_IMAGE
  let collection = []
  await Promise.all(collections.filter(i => { return (i.includes('.png') || i.includes('.jpg')) && !i.includes('Grid.') }).map(async (images) => {
    if (cache.get(images))  {
      return new Promise((resolve) => { collection.push(cache.get(images)); resolve() })
    } else {
      return new Promise((resolve) => {
        (async () => {
          const data = await fetch(`https://oneup.ai/view_image3.php?input=${images}&over=${overLayImage}&factor=2`, {
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
            cache.set(images, data);
            collection.push(data)
            resolve(data)
          } else {
            const buffer = Buffer.from(data);
            const base64 = 'data:image/jpeg;base64,' + buffer.toString('base64');
            cache.set(images, base64);
            collection.push(base64)
            resolve(base64)
          }
        })()
      })
    }
  })).catch(err => console.log(err))
  switch (requestMethod) {
    case 'POST':
      return res.send(collection)
    default:
      return res.send(collection)
  }
}