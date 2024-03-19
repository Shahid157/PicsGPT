import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FontText} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';

interface FollowDetailProps {
  counts?: string;
  type?: string;
}

export default function FollowDetail({counts, type}: FollowDetailProps) {
  return (
    <View style={{alignItems: 'center'}}>
      <FontText name={'extraBold'} size={normalize(16)}>
        {counts}
      </FontText>
      <FontText
        pTop={wp(1)}
        name={'bold'}
        size={normalize(12)}
        color={colors.gray}>
        {type}
      </FontText>
    </View>
  );
}

const styles = StyleSheet.create({});
