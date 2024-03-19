import {Toast} from 'react-native-toast-notifications';

export const showToast = (
  message: string,
  position: 'top' | 'center' | 'bottom' = 'bottom',
  type: 'warning' | 'success' | 'error' = 'success',
) => {
  Toast.show(message, {
    type: type,
    placement: position,
    duration: 1500,
    animationType: 'slide-in',
  });
};
