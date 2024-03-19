import AsyncStorage from '@react-native-async-storage/async-storage';
import {delay} from './validation';
import {uploadImage} from '../api/uploadApi';
import {addActions, uploadImageAction} from '../store/actions';

const startLoader = () => global.props.startLoader();
const stopLoader = () => global.props.stopLoader();
const isLoading = () => global.props.isLoading();

const uploadImageApi = async (imageList, selectionType, dispatch) => {
  let uploaded = [];
  // for (const image of selectedImgList) {
  await imageList?.map(async image => {
    try {
      const body = new FormData();
      const imageFile = {
        uri: image?.uri,
        type: image?.type,
        name: image?.fileName,
      };
      body.append('media', imageFile);
      const uploadedImage = await uploadImage(body, dispatch);
      if (uploadedImage) {
        console.log(`Avatar was uploaded at ${uploadedImage}`);
        uploaded.push(uploadedImage);
      }
      await delay(50, true);
      dispatch(uploadImageAction.setUploadImage(uploaded));
      return uploaded;
    } catch (error) {
      console.log('error,,,..', error);
    }
  });
  await delay(50, true);
  return Promise.resolve(uploaded);
};

export default {
  startLoader,
  stopLoader,
  isLoading,
  uploadImageApi,
};
