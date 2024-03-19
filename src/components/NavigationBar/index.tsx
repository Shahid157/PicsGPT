/* eslint-disable no-param-reassign */
import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {hp, isX} from '../../styles/responsiveScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const navbarXSpace = isX ? hp(2.5) : 0;
export const navbarHeight = Platform.OS === 'ios' ? hp(9) : hp(8.5);

interface NavigationBarProps {
  height: number | any;
  style?: object;
  isFixed: boolean;
  bgColor: string;
  left: StyleProp<any>;
  hasLeft: boolean;
  right: StyleProp<any>;
  hasRight: boolean;
  center: StyleProp<any>;
  hasCenter: boolean;
  leftStyle?: StyleProp<ViewStyle>;
  centerStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  sidesWidth: number;
  animated: boolean;
  borderBottomWidth: number;
}
const NavigationBar = ({
  height,
  style,
  isFixed,
  bgColor,
  left,
  hasLeft,
  right,
  hasRight,
  center,
  hasCenter,
  leftStyle,
  centerStyle,
  rightStyle,
  sidesWidth,
  animated,
  borderBottomWidth,
}: NavigationBarProps) => {
  const {top} = useSafeAreaInsets();

  const _wrapperStyle = {
    height: height + navbarXSpace,
    borderBottomWidth,
  };
  const _sideStyle = {
    width: sidesWidth,
  };

  if (animated) {
    return (
      <Animated.View
        style={[
          styles.wrapper,
          isFixed ? styles.wrapperFixed : null,
          {backgroundColor: bgColor},
          styles.wrapper,
          _wrapperStyle,
          height,
          style,
        ]}>
        {hasLeft ? (
          <View style={[styles.left, _sideStyle, leftStyle]}>{left}</View>
        ) : null}
        {hasCenter ? (
          <View style={[styles.center, centerStyle]}>{center}</View>
        ) : null}
        {hasRight ? (
          <View style={[styles.right, _sideStyle, rightStyle]}>{right}</View>
        ) : null}
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        isFixed ? styles.wrapperFixed : null,
        _wrapperStyle,
        style,
        {marginTop: top - hp(5)},
      ]}>
      {hasLeft ? (
        <View style={[styles.left, _sideStyle, leftStyle]}>{left}</View>
      ) : null}
      {hasCenter ? (
        <View style={[styles.center, centerStyle]}>{center}</View>
      ) : null}
      {hasRight ? (
        <View style={[styles.right, _sideStyle, rightStyle]}>{right}</View>
      ) : null}
    </View>
  );
};

NavigationBar.defaultProps = {
  height: navbarHeight,
  isFixed: false,
  bgColor: 'white',
  hasLeft: false,
  hasCenter: false,
  hasRight: false,
  left: null,
  center: null,
  right: null,
  sidesWidth: 88,
  animated: false,
  borderBottomWidth: 0,
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 20 + navbarXSpace : 0,
  },
  wrapperFixed: {
    top: 0,
    left: 0,
    width: '100%',
    position: 'absolute',
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 8,
  },
  center: {
    width: 0,
    flexGrow: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 8,
  },
});

export default NavigationBar;
