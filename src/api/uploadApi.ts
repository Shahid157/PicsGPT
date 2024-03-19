import {postRequestApi} from '../utils/AxiosHelper';
import {uploadImageAction} from '../store/actions';
import utils from '../helpers/utils';

const uploadImage = async (data?: any, dispatch?: any) => {
  try {
    const header = {
      'Content-Type': 'multipart/form-data;',
    };
    utils.startLoader();
    const response: any = await postRequestApi(`uploads/upload`, data, header);
    utils.stopLoader();
    return response;
  } catch (error) {
    utils.stopLoader();
    return error;
  }
};

export {uploadImage};
