import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SvgIcon, colors} from '../../assets';
import globalStyles from '../../styles';
import {FontText, NavigationBar} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  onBackPress?: () =>  void;
}

export default function Header({onBackPress}: HeaderProps) {
  const {top} = useSafeAreaInsets();
  return (
    <View style={[globalStyles.bottomShadow,{paddingTop: top-hp(5)}]}>
      <NavigationBar
        hasCenter
        hasLeft
        hasRight
        left={
          <TouchableOpacity onPress={onBackPress}>
            <SvgIcon.BlackForward />
          </TouchableOpacity>
        }
        center={
          <FontText name={'bold'} size={normalize(16)}>
            {'STAMPD'}
          </FontText>
        }
        right={
          <TouchableOpacity style={styles.notificationBadge}>
            <FontText name={'bold'} size={normalize(12.5)}>
              {'12'}
            </FontText>
          </TouchableOpacity>
        }
        style={{paddingHorizontal: wp(3)}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notificationBadge: {
    height: wp(7),
    width: wp(7),
    backgroundColor: colors.lightGray,
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
