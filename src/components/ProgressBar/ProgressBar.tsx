import React from 'react';
import {View, StyleSheet} from 'react-native';
import {wp} from '../../constants';

interface ProgressBarProps {
  progress: number;
  color: string;
  unfilledColor: string;
  borderWidth: number;
  style?: any;
  height: number;
}

const ProgressBar = ({
  progress,
  color,
  unfilledColor,
  borderWidth,
  style,
  height,
}: ProgressBarProps) => {
  const totalProgress = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[
        styles.progressBarContainer,
        style,
        {height: height ? height : wp(2)},
      ]}>
      <View
        style={styles.backgroundBarStyle(
          height,
          unfilledColor,
          borderWidth,
          color,
        )}
      />
      <View
        style={[
          styles.progressBar,
          {
            width: `${totalProgress * 100}%`,
            backgroundColor: color,
            borderColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: wp(2),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: wp(9),
  },
  backgroundBarStyle: (
    height: number,
    unfilledColor: string,
    borderWidth: number,
    color: string,
  ) => ({
    width: '100%',
    height: height,
    borderRadius: wp(2),
    backgroundColor: unfilledColor,
    borderWidth: borderWidth,
    borderColor: color,
    position: 'absolute',
  }),
});

export default ProgressBar;
