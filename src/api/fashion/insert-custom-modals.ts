import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import supabaseTables from '../../constants/supabaseTables';

export default async function insertCustomModals(
  user_id: string,
  name: string,
  imageUrls: any,
  gender: string,
  person_id: string,
) {
  const paymentDetail = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.userCollectionDetails)
    .insert({
      user_id: user_id,
      full_name: name,
      url: imageUrls[0],
      collection: imageUrls,
      gender: gender,
      person_id: person_id,
      garment_id: null,
      garment_type: null,
      type: null,
    })
    .select('*');

  return paymentDetail;
}
