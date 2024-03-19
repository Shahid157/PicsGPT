/* eslint-disable import/prefer-default-export */
import messaging from '@react-native-firebase/messaging';

export async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const getDeviceToken = await messaging().getAPNSToken();
    if (getDeviceToken) {
      const getFCMToken = await messaging().getToken();
    }
  }
  // messaging()
  //   .hasPermission()
  //   .then(enabled => {
  //     if (
  //       enabled === messaging.AuthorizationStatus.AUTHORIZED ||
  //       enabled === messaging.AuthorizationStatus.PROVISIONAL
  //     ) {
  //       messaging()
  //         .getToken()
  //         .then(token => {
  //         });
  //     } else {
  //       messaging()
  //         .requestPermission()
  //         .then(() => {
  //           messaging()
  //             .getToken()
  //             .then(token => {
  //               // saveToken(token);
  //             });
  //         })
  //         .catch(error => {
  //         });
  //     }
  //   });
}
