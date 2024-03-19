import {
  USER_SELECTED_IMAGE,
  DELETE_USER_SELECTED_IMAGE,
  CLEAR_USER_SELECTED_IMAGE,
} from '../types';

const initialState = {
  userSelectedImages: [],
};

type Action = {
  type: string;
  payload?: any;
};

export default function userSelectedImagesReducer(
  state: any = initialState,
  action: Action,
) {
  switch (action.type) {
    case USER_SELECTED_IMAGE:
      const res = Object.assign({}, state, {
        userSelectedImages: [...state.userSelectedImages, action.payload],
      });

      return res;
    case DELETE_USER_SELECTED_IMAGE:
      const imageNameToDelete = action.payload;
      const updatedImages = state.userSelectedImages.filter(
        (image: any) => image.fileName !== imageNameToDelete,
      );
      return Object.assign({}, state, {
        ...state,
        userSelectedImages: updatedImages,
      });
    case CLEAR_USER_SELECTED_IMAGE:
      return initialState;

    default:
      return state;
  }
}
