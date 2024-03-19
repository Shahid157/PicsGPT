import supabaseTables from '../../constants/supabaseTables';
import {supabase} from '../../supabase/supabase';
import {errorHandler} from '../error-handler';

export async function fetchPhotoStyles() {
  try {
    const {data} = await supabase
      .from(supabaseTables.photoStyles)
      .select('*')
      .order('prompt_category', {ascending: true});
    return data;
  } catch (error) {
    errorHandler('Error while fetching photo_styles', error);
  }
}

export const fetchStockModels = async () => {
  let {data, error} = await supabase
    .from(supabaseTables.stockModels)
    .select('*')
    .eq('hidden', 'FALSE')
    .order('order_by', {ascending: false});
  return data;
};

export const fetchCelebs = async () => {
  let {data, error} = await supabase
    .from(supabaseTables.celebs)
    .select('*')
    .eq('hidden', 'FALSE')
    .order('id', {ascending: false});
  return data;
};
