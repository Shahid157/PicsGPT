import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '../../components';
import {colors, SvgIcon} from '../../assets';
import {FlatList} from 'react-native-gesture-handler';
import DataSource from '../../constants/data';

interface GuideLineCriteriaProps {
  title?: string;
  data?: any;
  type?: string;
  imageData?: any;
}

export default function GuideLineCriteria({
  title,
  data,
  type,
  imageData,
}: GuideLineCriteriaProps) {
  return (
    <>
      <View style={styles.guidLineView}>
        <FontText
          name={'extraBold'}
          size={normalize(16)}
          color={colors.gray900}
          pBottom={wp(1)}>
          {title}
        </FontText>
        <FlatList
          style={[{marginVertical: wp(2)}]}
          contentContainerStyle={[{paddingBottom: wp(2)}]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={data}
          keyExtractor={({id}) => id.toString()}
          renderItem={({item}) => {
            return (
              <View style={styles.rulesView}>
                {type === 'good' ? (
                  <SvgIcon.Right style={styles.iconStyle} />
                ) : (
                  <SvgIcon.RedClose style={styles.iconStyle} />
                )}
                <FontText
                  style={{fontWeight: '600'}}
                  size={normalize(13)}
                  color={colors.gray500}>
                  {item.text}
                </FontText>
              </View>
            );
          }}
        />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{paddingLeft: wp(4)}}
        contentContainerStyle={{paddingRight: wp(6)}}
        data={imageData}
        keyExtractor={({id}) => id.toString()}
        renderItem={({item}) => {
          return <Image source={item.image} style={styles.imgStyle} />;
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  guidLineView: {
    paddingHorizontal: wp(4),
    marginTop: wp(4),
  },
  rulesView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(2.5),
  },
  iconStyle: {marginRight: wp(1.5)},
  imgStyle: {
    borderRadius: wp(2.5),
    marginRight: wp(2),
    height: wp(25),
    width: wp(25),
  },
});
