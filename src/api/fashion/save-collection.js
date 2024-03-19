import { insertProducts } from 'models/garment';
import { supabase } from '../../../supabase'

const SERVER_URL = process.env.SERVER_URL

const imageCreateCollection = async (value = '', collection = [], string = '') => {
    const resp = await fetch(`${SERVER_URL}fashion/gpucollection`, {
        method: 'POST',
        body: JSON.stringify({
            sess_id: value,
            data: collection,
            query: string,
            userAgent: encodeURI("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0")
        })
    });
    const res = await resp.json()
    return res
}

export default async function handler(req, res) {
    req.body = JSON.parse(JSON.stringify(req.body))
    const response = await imageCreateCollection(req.body.sess_id, req.body.collection, `&key=${req.body.type}&description=${req.body.name}`) 
    if (response.id) {
        const { data } = await supabase.from('Garments').select().eq('garment_id', response.id).single()
        if (data) return res.json({ data })
        const details = await insertProducts('Garments', {
            name: req.body.name,
            id: req.body.id,
            product_name: req.body.product_name,
            product_url: req.body.product_url,
            hidden: req.body?.hidden || false,
            price_tag: req.body.price_tag,
            url: req.body.collection[0],
            "3d-url": req.body.collection[0],
            color: req.body.color,
            gender: req.body.gender,
            garment_id: response.id,
            brand: req.body.brand,
            price_filter: req.body.price_filter
        })
    
        return res.send({ detail: details })
    }
}
