import {UPLOAD_IMAGE, DELETE_IMAGE, CLEAR_IMAGE} from '../types';

const setUploadImage = (payload: any) => ({
  type: UPLOAD_IMAGE,
  payload,
});
const setDeleteImage = (payload: any) => ({
  type: DELETE_IMAGE,
  payload,
});

const clearImagesState = (payload: any) => ({
  type: CLEAR_IMAGE,
  payload,
});

export default {
  setUploadImage,
  setDeleteImage,
  clearImagesState,
};
