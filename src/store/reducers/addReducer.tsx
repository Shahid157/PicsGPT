import {
  ADD_JOB_DATA,
  ADD_LOCATION,
  ADD_MODEL_IMAGES,
  ADD_MODEL_TYPE,
  ADD_STYLE_IMAGE,
} from '../types';
const initialState = {
  //   placeName: '',
  modelImages: [],
  jobCollection: {
    modelImages: [],
    modelUrl: '',
    clothImages: [],
    clothUrl: '',
    locationImage: [],
    location: '',
    modelType: '',
    clothType: '',
    person_id: '',
    garment_id: '',
    prompt_type: '',
  },
};
export default function addReducer(state = initialState, action: any) {
  switch (action.type) {
    case ADD_MODEL_IMAGES:
      return {
        ...state,
        jobCollection: {
          ...state.jobCollection,
          modelImages: action.payload?.images,
          modelUrl: action.payload?.previewImage,
          modelType: action.payload?.type,
          person_id: action.payload?.person_id,
        },
      };
    case ADD_STYLE_IMAGE:
      return {
        ...state,
        jobCollection: {
          ...state.jobCollection,
          clothImages: action.payload?.images,
          clothUrl: action.payload?.previewImage,
          clothType: action.payload?.type,
          garment_id: action.payload?.garment_id,
        },
      };
    case ADD_LOCATION:
      return {
        ...state,
        jobCollection: {
          ...state.jobCollection,
          locationImage: action.payload?.images,
          location: action.payload?.type,
          prompt_type: action.payload?.prompt_type,
        },
      };
    default:
      return state;
  }
}
