import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import supabaseTables from '../../constants/supabaseTables';

export default async function getUserPaymentsAndCredits(user_id: string) {
  const {data: paymentDetail} = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.userPaymentDetails)
    .select('*')
    .eq('user_id', user_id)
    .order('credit_left', {ascending: false})
    .limit(1)
    .single();

  return paymentDetail;
}
