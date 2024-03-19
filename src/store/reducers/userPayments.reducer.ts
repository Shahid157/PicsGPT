import {CLEAR_CREDITS, UPDATE_CREDITS} from './../types/index';
import {USER_PAYMENTS} from '../types';
import {userPayment} from '../../interfaces/appCommonIternfaces';

interface Action {
  type: string;
  payload: userPayment;
}

type PaymentStateType = {
  credit_left: number;
  email_id: string;
  id: string;
  invoice_id: number | null,
  mode: string;
  model_limit: number;
  model_used: number;
  payment_intent: string | null;
  payment_method_id: string | null;
  plan_name: string | null;
  priority: number,
  session_id: string | null;
  subscription_id: string | null;
  user_id: any;
}

const initialState: PaymentStateType = {
  credit_left: 0,
  email_id: '',
  id: '',
  invoice_id: null,
  mode: '',
  model_limit: 0,
  model_used: 0,
  payment_intent: null,
  payment_method_id: null,
  plan_name: null,
  priority: 0,
  session_id: null,
  subscription_id: null,
  user_id: 0,
};

export default function userPaymentsReducer(
  state = initialState,
  action: Action,
) {
  switch (action.type) {
    case USER_PAYMENTS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case UPDATE_CREDITS: {
      return {
        ...state,
        credit_left: action.payload.credit_left,
      };
    }
    case CLEAR_CREDITS: {
      return {
        ...state,
        credit_left: 0,
      };
    }

    default:
      return state;
  }
}
