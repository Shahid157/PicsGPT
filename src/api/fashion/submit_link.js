import { supabase } from "../../../supabase"
export default async function handler(req, res) {
    const body = JSON.parse(req.body)
    const Url = body.garment_url;
    const { error } = await supabase.from('garment_link').insert({
        garment: Url
    })
    if (error) {
        console.log(error)
        throw error
    }
    return res.send(Url)
}
