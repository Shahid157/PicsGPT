import { supabase } from "../../../supabase"

export default async function handler(req, res) {
    req.body = JSON.parse(req.body)
    const obj = req.body.dataObj
    try {
        const response = await supabase.from('saved_collection').insert(obj).select('*')
        return res.send(response)
    } catch (error) {
        return res.status(500).send('Error while saving Collection', error)
    }
}
