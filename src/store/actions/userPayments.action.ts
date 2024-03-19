import {CLEAR_CREDITS, UPDATE_CREDITS} from './../types/index';
import {USER_PAYMENTS} from '../types';

const updateUserPayments = (payload: any) => ({
  type: USER_PAYMENTS,
  payload,
});
const updateUserCredits = (payload: any) => ({
  type: UPDATE_CREDITS,
  payload,
});
const clearUserCredits = (payload: any) => ({
  type: CLEAR_CREDITS,
  payload,
});

export default {
  updateUserPayments,
  updateUserCredits,
  clearUserCredits,
};
