
export default async function handler(req, res) {
    const requestMethod = req.method;
    let queryStr = ''
    const { current, end, sess_id, ...rest } = req.query
    Object.keys(rest).forEach(i => queryStr = queryStr + `&${i}=${req.query[i]}`)
    const url = `${process.env.CM1_BASE_URL}gpu_search_infer.php?verbose=1&ses_id=${sess_id}&limit=${current},${end}${queryStr}`
    const resp = await fetch(url, {
      method: 'GET'
    });
    let response = await resp.json()
    // console.log('coming in resp', response)
    switch (requestMethod) {
      case 'GET':
        return res.status(200).json((response || []).filter(i => i.id !== '022e2e87d9ec0451cdb9085e0968438a'))
      default:
        return res.status(200).json((response || []).filter(i => i.id !== '022e2e87d9ec0451cdb9085e0968438a'))
    }
}