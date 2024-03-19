import {
  ADD_PHOTOAI_MODEL,
  ADD_PHOTOAI_STYLE,
} from '../types';
const initialState = {
  modelImages: [],
  jobCollection: {
    photo_style:{},
    selected_model:{}
  },
};
export default function addPhotoAIReducer(state = initialState, action: any) {
  switch (action.type) {
    case ADD_PHOTOAI_STYLE:
      return {
        ...state,
        jobCollection: {
          ...state.jobCollection,
          photo_style:action.payload?.photo_style
        },
      };
    case ADD_PHOTOAI_MODEL:
      return {
        ...state,
        jobCollection: {
          ...state.jobCollection,
          selected_model: action.payload?.selected_model,
        },
      };
     default:
      return state;
  }
}
