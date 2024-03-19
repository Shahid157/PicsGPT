import {LOGIN, LOGOUT} from '../types';
const login = (payload: any) => {
  return {
    type: LOGIN,
    payload: payload,
  };
};

const logout = (payload: any) => {
  return {
    type: LOGOUT,
    payload: payload,
  };
};

export default {
  login,
  logout,
};
