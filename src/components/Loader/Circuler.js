/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Animated, Easing} from 'react-native';
import colors from '../../assets/colors';
import {wp} from '../../styles/responsiveScreen';
import SvgIcon from '../../assets/SvgIcon';

const Circuler = ({
  size = wp(6),
  color = colors.white,
  animationDuration = 1000,
}) => {
  const spinLoader = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(spinLoader);
  };

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    spinLoader();
  });

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: spin}], zIndex: 999}}>
      {color === colors.white ? (
        <SvgIcon.LoaderIcon width={size} height={size} />
      ) : null}
      {color === colors.gray ? (
        <SvgIcon.GrayLoaderIcon width={size} height={size} />
      ) : null}
    </Animated.View>
  );
};

export default Circuler;
