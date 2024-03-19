import {getRequestApi} from '../utils/AxiosHelper';
import {setUserGeneration} from '../store/reducers/userGenerations';
import {AppDispatch} from '../store';

const fetchSearchInfer = async (page?: number, dispatch?: AppDispatch) => {
  try {
    const response: any = await getRequestApi(
      `https://testing.styley.ai/api/fashion/featured-media?page=${page}`,
    );
    dispatch && dispatch(setUserGeneration(response));
    return response;
  } catch (error) {
    return error;
  }
};

const searchUserGenerations = async (text?: any) => {
  try {
    const response: any = await getRequestApi(
      `https://testing.styley.ai/api/fashion/featured-media?search=${text}`,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export {fetchSearchInfer, searchUserGenerations};
