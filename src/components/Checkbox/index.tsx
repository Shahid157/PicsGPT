import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors, fonts, SvgIcon} from '../../assets';
import FontText from '../FontText';
import strings from '../../assets/strings';

interface CheckboxProps {
  onCheckboxPress?: () => void;
  checked?: boolean;
  lable?: string;
}

export default function Checkbox({
  onCheckboxPress,
  checked,
  lable,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.mainContainer}
      onPress={onCheckboxPress}>
      <>
        {checked ? <SvgIcon.Checked /> : <SvgIcon.Unchecked />}
        <FontText
          name={'medium'}
          size={normalize(12.11)}
          color={colors.gray}
          pLeft={wp(2)}>
          {lable || ''}
        </FontText>
      </>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
