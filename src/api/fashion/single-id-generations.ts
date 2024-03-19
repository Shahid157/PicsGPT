import {jobInterface} from './../../interfaces/appCommonIternfaces';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import supabaseTables from '../../constants/supabaseTables';

export async function saveSingleIDGeneration(
  mode: string,
  job: jobInterface,
  status?: string,
  jobId?: any,
) {
  if (status) {
    const {job_id, user_id} = job;
    const resp = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from(supabaseTables.singleIDUsergeneration)
      .update({status: status, job_id: job_id})
      .eq('job_id', jobId)
      .select();

    return resp;
  }

  if (mode === 'delete') {
    const resp = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from(supabaseTables.singleIDUsergeneration)
      .delete()
      .eq('job_id', job);

    return resp;
  }

  if (mode === 'insert') {
    const {data: photo_styles} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('photo_styles')
      .select('*')
      .eq('id', job.usedItems.usedStyle.id);
    if (photo_styles?.length && photo_styles[0])
      job.usedItems.usedStyle = photo_styles[0];

    const {data: resp} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from(supabaseTables.singleIDUsergeneration)
      .insert(job)
      .select('*');

    return resp;
  } else {
    const {user_id, job_id} = job;
    const {data: resp} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from(supabaseTables.singleIDUsergeneration)
      .update(job)
      .eq('user_id', user_id)
      .eq('job_id', job_id);
    return resp;
  }
}

export async function getSingleIDGeneration(generate_id: string) {
  const {data, error} = await supabaseDynamic(supabaseUrl, supabaseKey)
    .from(supabaseTables.singleIDUsergeneration)
    .select('*')
    .eq('generate_id', generate_id)
    .order('id', {ascending: true});
  return data;
}
