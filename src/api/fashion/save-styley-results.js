import { supabase } from '../../../supabase'
import { formatJSON, getLogger } from "logging/log-util";
const logger = getLogger();
export default async function handler(req, res) {
    logger.info('==============> coming in save styley results api ==========>')
    const requestMethod = req.method;
    switch (requestMethod) {
        case 'POST': {
            req.body = JSON.parse(req.body)
            const user_id = req.body.user_id
            const collection_id = req.body.collection_id;
            const results = req.body.results;
            const isPrivate = req.body.isPrivate;
            const type = req.body.type;
            const payment_id = req.body.payment_id;
            const additional_detail = req.body.additional_detail;
            let { data: alreadyExist } = await supabase.from('styley_results').select().match({ collection_id })
            if (alreadyExist.length > 0) alreadyExist = alreadyExist[0]
            else alreadyExist = null
            logger.info('==============> coming in save styley resultsalreadyExist ==========>', formatJSON(alreadyExist))
            if (!alreadyExist) {
                const savedResult = await supabase.from('styley_results').insert({
                    user_id: user_id,
                    results,
                    isPrivate,
                    type,
                    collection_id,
                    additional_detail,
                    payment_id: payment_id
                }).select('*')
                if (savedResult.data?.length) {
                    alreadyExist = savedResult.data[0]
                }
            }
            return res.status(200).json(alreadyExist)
        }
            
        default: {
            let savedDetails = []
            if (req.query.type === 'public_headshot') {
                const { data } = await supabase.from('styley_results').select('*').eq('isPrivate', 'FALSE').eq('type', 'headshot');
                savedDetails = data
            } else if (req.query.user_id) {
                const { data } = await supabase.from('styley_results').select('*').eq('user_id', req.query.user_id).eq('type', 'headshot');
                savedDetails = data
            } else {
                const saved_id = req.query.id
                const { data } = await supabase.from('styley_results').select('*').eq('id', saved_id)
                savedDetails = data
            }
            return res.status(200).json({ savedDetails })
        }
    }
}