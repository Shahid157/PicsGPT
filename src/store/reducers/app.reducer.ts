import {APP_INITILIZING} from '../types';
interface ActionProps {
  type: string;
  payload: any;
}
const initialState = {
  initializing: true,
};

const appStateReducer = (state = initialState, action: ActionProps) => {
  switch (action.type) {
    case APP_INITILIZING:
      return {
        ...state,
        initialState: action.payload,
      };
    default:
      return state;
  }
};

export default appStateReducer;
