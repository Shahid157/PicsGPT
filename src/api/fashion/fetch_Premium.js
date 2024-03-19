import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import supabaseTables from '../../constants/supabaseTables';

export default async function fetchPremium(userId) {
  const {data: paymentDetail} = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.userPaymentDetails)
    .select('*')
    .eq('user_id', userId)
    .eq('plan_name', 'VIP');

  return paymentDetail.length ? true : false;
}
