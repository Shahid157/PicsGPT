import { formatJSON, getLogger } from "logging/log-util";
const server_url = process.env.SERVER_URL

const logger = getLogger();
export default async function handler(req, res) {
    const requestMethod = req.method;
    const { job_id } = req.query
    const resp = await fetch(`${server_url}fashion/login`, {
        method: 'POST',
        body: JSON.stringify({
            "user": "u_db_mobile",
            "pass": "AeVeiwez"
        })
    });
    const loginRes = await resp.json()
    if (!loginRes.sess_id) return res.status(200).json({})
    const url = `${process.env.CM1_BASE_URL}gpu_monitor.php?ses_id=${loginRes.sess_id}&job=${job_id}`
    logger.info('================> coming in re run api ============>', formatJSON({ url: url, incomingBody: req.query }))
    const respo = await fetch(url)
    const response = await respo.json()
    logger.info('================> coming in re run api response ============>', formatJSON({ response }))
    switch (requestMethod) {
        case 'POST':
            return res.status(200).json({})
        default:
            return res.status(200).json({})
    }
}