import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import colors from '../../assets/colors';

interface LoadingPropType {
  isColor?: string;
  style?: string;
  size?: string;
}

const Loading = ({isColor, style, size}: LoadingPropType) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size ? size : 'large'}
        color={isColor ? isColor : colors.white}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: colors.gray,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
