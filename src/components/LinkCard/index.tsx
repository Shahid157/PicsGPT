import {StyleProp, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SvgIcon, colors} from '../../assets';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '..';
import globalStyles from '../../styles';

interface LinkCardProps {
  linkName?: string;
  leftIcon?: StyleProp<any>;
  onPress?: any;
}

export default function LinkCard({linkName, leftIcon, onPress}: LinkCardProps) {
  return (
    <TouchableOpacity
      style={[styles.linkCardView, globalStyles.rowJB]}
      onPress={onPress}>
      <View style={globalStyles.rowAC}>
        {leftIcon}
        <FontText size={normalize(12)} fontWeight={500} pLeft={wp(5)}>
          {linkName}
        </FontText>
      </View>
      <SvgIcon.ArrowUp />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linkCardView: {
    backgroundColor: colors.lightGray2,
    paddingHorizontal: wp(3),
    paddingVertical: wp(4),
  },
});
