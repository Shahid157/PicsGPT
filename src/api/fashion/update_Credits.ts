import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from './../../supabase/supabase';
import supabaseTables from '../../constants/supabaseTables';

export default async function updateCredit(
  user_id: string,
  type: string,
  credits: number,
  email_id?: string,
  plan_name?: string,
  model_limit?: string,
) {
  const paymentData = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.userPaymentDetails)
    .select('*')
    .eq('user_id', user_id)
    .limit(1)
    .order('credit_left', {ascending: false})
    .single();
  if (!paymentData.data) {
    if (!email_id) return false;
    await supabaseDynamic(supabaseUrl, supabaseKey)
      .from(supabaseTables.userPaymentDetails)
      .insert({
        credit_left: credits,
        user_id,
        mode: 'subscription',
        priority: 1,
        email_id,
        plan_name,
        model_used: 0,
        model_limit,
      })
      .maybeSingle();
    return false;
  }
  let updatedCredit = paymentData.data.credit_left;

  if (type === 'add') updatedCredit += credits;
  else if (type === 'deduct') updatedCredit -= credits;

  const resp = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.userPaymentDetails)
    .update({credit_left: updatedCredit})
    .eq('id', paymentData.data.id)
    .maybeSingle();

  return resp;
}
