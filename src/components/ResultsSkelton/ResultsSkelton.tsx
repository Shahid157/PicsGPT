import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {rawData} from '../../constants/photoAIConstants';
import {hp, wp} from '../../constants';
import {colors} from '../../assets';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-reanimated-carousel';

export default function ResultsSkelton() {
  return (
    <View style={{flex: 1}}>
      <View style={styles.ImagesCon}>
        <View style={styles.firstImage} />
        <View style={styles.secImage} />
      </View>
      <View>
        <Carousel
          width={wp(100)}
          height={hp(50)}
          data={rawData}
          style={{}}
          renderItem={({item, index}) => (
            <View style={{top: wp(4.5)}} key={index}>
              <FastImage
                style={{
                  width: wp(100),
                  height: hp(43.5),
                  alignSelf: 'center',
                  backgroundColor: colors.lightGray,
                }}
                source={{
                  uri: item,
                  priority: FastImage.priority.high,
                }}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
      <View style={{top: wp(-8)}}>
        <FlatList
          horizontal
          data={rawData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View key={index}>
              <FastImage
                style={[styles.listImg]}
                source={{
                  uri: item,
                }}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listImg: {
    height: wp(25),
    width: wp(25),
    marginHorizontal: wp(1.2),
    marginTop: wp(2),
    backgroundColor: colors.lightGray,
  },
  ImagesCon: {
    height: wp(20),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  firstImage: {
    height: wp(20),
    backgroundColor: colors.lightGray,
    width: wp(20),
    marginLeft: wp(2),
  },
  secImage: {
    height: wp(20),
    backgroundColor: colors.lightGray,
    width: wp(20),
    marginLeft: wp(1),
  },
});
