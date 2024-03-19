import supabaseTables from '../../constants/supabaseTables';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';

export default async function fetchUserGeneration(userId: string) {
  const {data: singleId} = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.singleIDUsergeneration)
    .select('*')
    .eq('user_id', userId)
    .order('id', {ascending: false})
    .order('created_at', {ascending: false});
  const {data: inProgress} = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.singleIdGenerations)
    .select('*')
    .eq('user_id', userId)
    .is('status', null)
    .order('created_at', {ascending: false});
  return {singleId, inProgress};
}
