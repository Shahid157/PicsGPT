import { supabase } from '../../../supabase'
import { formatJSON, getLogger } from "logging/log-util";
const logger = getLogger();
export default async function handler(req, res) {
    logger.info('==============> coming in save Home-ai results api ==========>')
    const requestMethod = req.method;

    switch (requestMethod) {
        case 'GET': {
            const generate_id = req.query.generate_id;
            let response = await supabase.from('home-ai_results').select().match({ result_id: generate_id })
            return res.status(200).json(response)
        }

        case 'POST': {
            req.body = JSON.parse(req.body)
            const user_id = req.body.user_id
            const job_id = req.body.job_id;
            const results = req.body.results;
            const room_details = req.body.room_details;
            const payment_id = req.body.payment_id;
            const additional_detail = req.body.additional_detail;
            const result_id = req.body.result_id;
            logger.info('==============> coming in save home-ai results alreadyExist ==========>', formatJSON(job_id))

            let { data: alreadyExist } = await supabase.from('home-ai_results').select().match({ result_id })
            if (alreadyExist.length > 0) alreadyExist = alreadyExist[0]
            else alreadyExist = null
            logger.info('==============> coming in save home-ai results alreadyExist ==========>', formatJSON(alreadyExist))
            if (!alreadyExist) {
                const savedResult = await supabase.from('home-ai_results').insert({
                    user_id: user_id,
                    results,
                    result_id,
                    room_details,
                    job_id,
                    additional_detail,
                    payment_id: payment_id
                }).select('*')
                if (savedResult.data?.length) {
                    alreadyExist = savedResult.data[0]
                }
            }
            return res.status(200).json(alreadyExist)
        }
    }
}