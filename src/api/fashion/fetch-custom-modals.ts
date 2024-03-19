import supabaseTables from '../../constants/supabaseTables';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';

export default async function fetchUserModelsCollection(user_id: string) {
  const {data} = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.userCollectionDetails)
    .select('*')
    .eq('user_id', user_id)
    .order('id', {ascending: false})
    .order('created_at', {ascending: false});
  return data;
}
