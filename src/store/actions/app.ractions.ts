import {APP_INITILIZING} from '../types';

const appInitializing = (initializing: boolean) => {
  return {
    type: APP_INITILIZING,
    payload: initializing,
  };
};

export default {
  appInitializing,
};
