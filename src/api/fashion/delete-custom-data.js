
import { supabase } from '../../../supabase'
export default async function handler(req, res) {
    const body = req.body;
    const user_id = req.body.user_id

    const data = await supabase
        .from('user_collection_details')
        .delete()
        .eq('user_id', user_id).eq(body.garment_id ? 'garment_id' : 'person_id', body.garment_id || body.person_id);
        res.send(data)
}