import { ADD_PHOTOAI_MODEL, ADD_PHOTOAI_STYLE} from '../types';

const addPhotoModelImages = (payload: any) => {
  return {
    type: ADD_PHOTOAI_MODEL,
    payload: payload,
  };
};

const addPhotoStyleImages = (payload: any) => {
  return {
    type: ADD_PHOTOAI_STYLE,
    payload: payload,
  };
};

export default {
  addPhotoStyleImages,
  addPhotoModelImages,
};
