import {SELECTED_RESULT} from '../types';

const selectionData = [
  {
    id: 1,
    image: '',
    type: 'Model',
    isSelected: false,
  },
  {
    id: 2,
    image: '',
    type: 'Style',
    isSelected: false,
  },
  {
    id: 3,
    image: '',
    type: 'Location',
    isSelected: false,
  },
];

const initialState = {
  selectedResult: {},
};

type Action = {
  type: string;
  payload?: any;
};

export default (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SELECTED_RESULT:
      return Object.assign({}, state, {
        userGeneration: action.payload,
      });
    default:
      return state;
  }
};
