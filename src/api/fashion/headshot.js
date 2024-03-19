import { formatJSON, getLogger } from "logging/log-util";

const serverUrl = process.env.SERVER_URL

const logger = getLogger();
export default async function handler(req, res) {
    const collection_id = req.query.collection_id;
    const resp = await fetch(`${serverUrl}fashion/login`, {
        method: 'POST',
        body: JSON.stringify({
            "user": "u_db_mobile",
            "pass": "AeVeiwez"
        })
    });
    const loginRes = await resp.json()
    const url = `${process.env.CM1_BASE_URL}gpu_headshot.php?ses_id=${loginRes.sess_id}&collection=${collection_id}`
    logger.info('=======. coming in heashot api =======>', formatJSON({ url }))
    const response = await fetch(url);
    const headshot = await response.json()
    logger.info('=======. response in heashot api =======>', formatJSON({ headshot }))
    return  res.status(200).json(headshot)
  }