import { supabase } from '../../../supabase'
export default async function handler(req, res) {
  try {
    const { data: resp } = await supabase.from('user_size_selection').select('*');
    return res.status(200).json(resp);
  } catch (error) {
    return res.status(500).json({ error: 'Error while fetching user_size_selection' });
  }
}
