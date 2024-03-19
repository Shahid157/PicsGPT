import {
  STORE_IMAGE_LIST,
  UPLOAD_IMAGE,
  CLEAR_IMAGE,
  DELETE_IMAGE,
} from '../types';

const initialState = {
  userUploadedImages: [],
};

type Action = {
  type?: string;
  payload?: any;
};

export default function uploadImagesReducer(
  state: any = initialState,
  action: Action,
) {
  switch (action.type) {
    case UPLOAD_IMAGE:
      return Object.assign({}, state, {
        userUploadedImages: [...state.userUploadedImages, action.payload],
      });
    case DELETE_IMAGE:
      const imageNameToDelete = action.payload;
      const updatedImages = state.userUploadedImages.filter(
        (image: any) => image.fileName !== imageNameToDelete,
      );

      return Object.assign({}, state, {
        ...state,
        userUploadedImages: updatedImages,
      });
    case CLEAR_IMAGE:
      return initialState;

    default:
      return state;
  }
}
