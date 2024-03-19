import {getRequestApi, postRequestApi} from '../utils/AxiosHelper';
import {saveSingleIDGeneration} from './fashion/single-id-generations';
import {dataModes} from '../constants/appConstants';

const createDeployment = async (data?: any, dispatch?: any) => {
  try {
    const header = {
      'Content-Type': 'multipart/form-data;',
    };
    const response: any = await postRequestApi(
      'api/v1/deployments',
      data,
      header,
    );
    return response;
  } catch (error) {
    return error;
  }
};

const trackingJobApi = async (jobId?: any, dispatch?: any, job) => {
  try {
    const response: any = await getRequestApi(`api/v1/jobs/${jobId}`);
    return response;
  } catch (error) {
    console.log('ERROR in trackingJobApi ', error);
    return error;
  }
};

export {createDeployment, trackingJobApi};
