import { formatJSON, getLogger } from "logging/log-util";
import { getIp } from "./traincollection";

const logger = getLogger()
export default async function handler(req, res) {
    const requestMethod = req.method;
    req.body = JSON.parse(req.body)
    const body = req.body.data;
    const sess_id = req.body.sess_id;
    const collection = req.body.collection;
    const priority = req.body.priority;
    const user = req.body.user;
    const email = req.body.email;
    const notify_data = req.body.notify_data;
    const userAgent = req.body.userAgent;
    const negative_prompt = req.body.negative_prompt;
    const query = req.body.query

    const { ip, referer } = getIp(req)
    const responseAll = await Promise.all(
      collection.map((training) => {
        return new Promise(async (resolve) => {
          const url = `${process.env.CM1_BASE_URL}gpu_infer_fashion.php?ses_id=${sess_id}&collection=${training.collection_id}&priority=${priority}&notify_email=${email}&notify_data=${notify_data}&user=${user}&REFERAL_URL=${referer}&CLIENT_BROWSER=${userAgent}&CLIENT_IP=${ip}${negative_prompt && `&negative_prompt=${negative_prompt}`}${query && `${query}`} `
          logger.info('================> coming in infner collection api ============>', formatJSON({ url: url, incomingBody: req.body }))
          const resp = await fetch(url, {
            method: requestMethod,
            includeCredentials: true,
            ...(requestMethod !== 'GET' && { body: JSON.stringify(body) })
          });
          const response = await resp.json()
          logger.info('================> coming in infner collection api response ============>', formatJSON({ response }))
          resolve({ id: response?.id, status: response?.status,  monitor: response?.monitor, files: response.files, monitor_url: response.monitor_url, person_id: training.person_id, garment_id: training.garment_id })
        })
      })
    )

    switch (requestMethod) {
      case 'POST':
        return res.status(200).json(responseAll)
      default:
        return res.status(200).json(responseAll)
    }
  }