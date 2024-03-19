import {REMEMBER_ME, LOGIN, LOGOUT} from '../types';
interface ActionProps {
  payload: any;
  rememberMe: boolean;
  type?: string;
}
const initialState = {
  user: {},
  rememberMe: false,
  session: {},
  accessToken: '',
  isLogin: false,
  userId: '',
  loginMethod: '',
  isEmail: false,
  isPremium: false,
};

const authReducer = (state = initialState, action: ActionProps) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action?.payload?.user,
        session: action?.payload.session,
        accessToken: action?.payload?.session?.accessToken,
        userId: action?.payload?.user?.id,
        rememberMe: action?.payload?.rememberMe,
        isEmail: action?.payload?.isEmail,
        isPremium: action?.payload?.premium,
        isLogin: true,
      };
    case LOGOUT:
      return initialState;
    case REMEMBER_ME: {
      return {
        ...state,
        rememberMe: action.rememberMe,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
