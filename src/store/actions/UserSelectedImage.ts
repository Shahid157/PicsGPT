import {
  USER_SELECTED_IMAGE,
  DELETE_USER_SELECTED_IMAGE,
  CLEAR_USER_SELECTED_IMAGE,
} from '../types';

const setUploadImage = (payload: any) => ({
  type: USER_SELECTED_IMAGE,
  payload,
});
const setDeleteImage = (payload: any) => ({
  type: DELETE_USER_SELECTED_IMAGE,
  payload,
});

const clearImagesState = (payload: any) => ({
  type: CLEAR_USER_SELECTED_IMAGE,
  payload,
});

export default {
  setUploadImage,
  setDeleteImage,
  clearImagesState,
};
