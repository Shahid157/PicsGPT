import {supabase} from '../../supabase/supabase';

export default async function handleUserSelection(
  user_id,
  mode,
  selected_styles,
  model,
) {
  let selected_model = [];
  selected_model.push(model);

  try {
    const {data: alreadyExists} = await supabase
      .from('user_selection')
      .select("*")
      .eq('user_id', user_id);

    if (mode === 'update') {
      if (alreadyExists.length) {
        const updateSelectionStatus = await handleUpdate(
          user_id,
          selected_styles,
          selected_model,
        );
        return updateSelectionStatus;
      } else {
        const likedresult = await handleSelection(
          user_id,
          selected_styles,
          selected_model,
        );
        return likedresult;
      }
    } else if (mode === 'delete') {
      if (alreadyExists.length) {
        const deleteSelectionStatus = await handleDelete(user_id);
        return deleteSelectionStatus;
      }
    } else {
      return alreadyExists;
    }
  } catch (error) {
    console.log(error);
  }
}
const handleUpdate = async (user_id, selected_styles, selected_model) => {
  try {
    const response = await supabase
      .from('user_selection')
      .update({
        selected_styles: selected_styles,
        selected_model: selected_model,
      })
      .eq('user_id', user_id)
      .select();
    return response;
  } catch (error) {
    return {error: true};
  }
};

const handleSelection = async (user_id, selected_styles, selected_model) => {
  try {
    const response = await supabase
      .from('user_selection')
      .insert({
        user_id: user_id,
        selected_styles: selected_styles,
        selected_model: selected_model,
      })
      .select('*');
    return response;
  } catch (error) {
    return {error: true};
  }
};

const handleDelete = async user_id => {
  try {
    const response = await supabase
      .from('user_selection')
      .delete()
      .eq('user_id', user_id);
    return response;
  } catch (error) {
    return {error: true};
  }
};
