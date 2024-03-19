import { formatJSON, getLogger } from "logging/log-util";

const logger = getLogger()
export default async function handler(req, res) {
    const requestMethod = req.method;
    req.body = JSON.parse(req.body)
    const url = req.body.tracking_url
    const responseAll = await Promise.all(
      url.map((tracking) => {
        return new Promise(async (resolve) => {
          logger.info('================> coming in tracking api ============>', formatJSON({ url: tracking.url, incomingBody: req.body }))
          const resp = await fetch(tracking.url, {
            method: 'GET'
          });
          const response = await resp.json()
          logger.info('================> coming in tracking api response ============>', formatJSON({ response }))
          resolve({ monitor: response?.monitor, files: response.files, status: response?.status, person_id: tracking.person_id, garment_id: tracking.garment_id })
        })
      })
    )

    let complete = true
    let error = false
    let data = []
    let progress = 0;
    responseAll.forEach((response) => {
      if (response.status !== 'complete') complete = false
      if (response && response.files && response.files.length > 0 && response.files.filter(i => i.includes('Grid.')).length > 0) {
        data.push({inferences: response.files.filter(i => { return i.includes('result_') && !i.includes('Grid.') }).map(i => {return { original: i, thumbnail: i }}), person_id: response.person_id, garment_id: response.garment_id})
      }
      if (response?.monitor?.progress) {
        progress = (progress + Number(response?.monitor?.progress)) / responseAll.length
      }
    })

    if (complete && data.length === 0) error = true

    switch (requestMethod) {
      case 'POST':
        return res.status(200).json({ response: responseAll, files: data, error, complete, monitor: { uid: { progress: `${progress}%` } } })
      default:
        return res.status(200).json({ response: responseAll, files: data, error, complete, monitor: { uid: { progress: `${progress}%` } }})
    }
}