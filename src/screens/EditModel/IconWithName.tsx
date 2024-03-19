import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FontText} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';

interface IconWithNameProps {
  icon?: any;
  iconName?: string;
}

export default function IconWithName({icon, iconName}: IconWithNameProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        marginHorizontal: wp(4),
        justifyContent: 'space-between',
        height: wp(10),
      }}>
      {icon}
      <FontText
        pTop={wp(1)}
        name={'medium'}
        size={normalize(8)}
        color={colors.gray900}>
        {iconName}
      </FontText>
    </View>
  );
}

const styles = StyleSheet.create({});
