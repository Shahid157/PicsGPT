import {ADD_LOCATION, ADD_MODEL_IMAGES, ADD_STYLE_IMAGE} from '../types';

const addModelImages = (payload: any) => {
  return {
    type: ADD_MODEL_IMAGES,
    payload: payload,
  };
};

const addStyleImages = (payload: any) => {
  return {
    type: ADD_STYLE_IMAGE,
    payload: payload,
  };
};

const addLocation = (payload: any) => {
  return {
    type: ADD_LOCATION,
    payload: payload,
  };
};

export default {
  addModelImages,
  addStyleImages,
  addLocation,
};
