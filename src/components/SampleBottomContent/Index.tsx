/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '..';
import {Button} from 'react-native-paper';
import {colors} from '../../assets';
import strings from '../../assets/strings';

interface ContentBottomSheetRef {
  modalizeRef?: any;
  data: Object;
  onButtonPress?: () => void;
}

export default function ContentBottomSheet({
  modalizeRef,
  data,
  onButtonPress,
}: ContentBottomSheetRef) {
  return (
    <Modalize
      adjustToContentHeight
      ref={modalizeRef}
      withReactModal
      withHandle={false}>
      <View style={styles.main}>
        <FontText style={styles.title}>{data.title}</FontText>
        <FontText style={styles.subTitle}>{data.subTitle}</FontText>
        <FontText style={styles.discription}>{data.discription}</FontText>
        <Button
          style={[styles.btnStyle, {width: '90%', top: 10}]}
          onPress={() => {
            onButtonPress();
          }}
          labelStyle={styles.btnLable}
          mode="contained">
          {strings.letstyle}
        </Button> 
      </View>
    </Modalize>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: wp(8),
  },
  subTitle: {
    fontSize: 18,
    alignSelf: 'center',
    paddingTop: 20,
    fontWeight: '900',
  },
  discription: {
    fontSize: 12,
    width: '80%',
    alignSelf: 'center',
    paddingTop: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    alignSelf: 'center',
    paddingTop: 20,
    fontWeight: '900',
  },
  main: {height: hp(30), paddingTop: 10},
  btnStyle: {
    paddingVertical: wp(2.5),
    alignSelf: 'center',
    backgroundColor: colors.black,
    width: wp(90),
    borderRadius: wp(1),
  },
});
