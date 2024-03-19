import { supabase } from "../../../supabase"
import { fetchProducts } from "../../../models/garment"

export default async function handler(req, res) {
    const { data: fantasy } = await supabase.from('fantasy_garment').select('*').eq('hidden', 'FALSE').order('id', { ascending: false })
    const d = await fetchProducts('Garments')
    res.send({ standard: d, fantasy })
}
