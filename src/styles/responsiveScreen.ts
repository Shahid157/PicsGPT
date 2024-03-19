import {Dimensions, Platform} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export const isiPAD = viewportHeight / viewportWidth < 1.6;
export const isTablet = viewportHeight / viewportWidth < 1.6;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export function isIphoneXorAbove() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
  );
}
export const isX = isIphoneX();

export function wp(percentage : number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export function hp(percentage: number) {
  const value = (percentage * viewportHeight) / 100;
  return Math.round(value);
}

// based on iphone 5s's scale
const scale = viewportWidth / 375;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    if (isiPAD) {
      return Math.round(newSize) - wp(1);
    }
    return Math.round(newSize);
  }
  if (isTablet) {
    return Math.round(newSize) - wp(1);
  }
  return Math.round(newSize);
}
