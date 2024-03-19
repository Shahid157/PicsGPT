import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors, fonts, SvgIcon} from '../../assets';
import {CommonHeader, FontText, GridList, Input} from '../../components';
import globalStyles from '../../styles';
import IconWithName from './IconWithName';
import {Button, Switch} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

interface EditModelProps {
  navigation?: any;
  route?: any;
}

export default function EditModel({navigation, route}: EditModelProps) {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const {resultData} = route?.params;
  const finalData = resultData?.filter((e: any) => e.status === 'complete');

  const [resultImage, setResultImage] = React.useState(finalData[0]?.files);
  const [displayImage, setDisplayImage] = React.useState(resultImage[0]);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={styles.container}>
      <View style={globalStyles.bottomShadow}>
        <CommonHeader />
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: wp(10)}}>
        <View style={[{marginTop: wp(5)}, globalStyles.rowAC]}>
          <Pressable onPress={() => navigation.goBack()}>
            <SvgIcon.BlackForward
              style={{padding: wp(3.5), marginHorizontal: wp(2)}}
            />
          </Pressable>
          <FlatList
            horizontal
            // contentContainerStyle={{
            //   justifyContent: 'center',
            //   flex: 1,
            // }}
            showsHorizontalScrollIndicator={false}
            data={finalData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setResultImage(item?.files);
                    setDisplayImage(item?.files[0]);
                  }}>
                  <FastImage
                    style={[
                      styles.listImg,
                      {
                        borderWidth: item?.files[0] === resultImage[0] ? 3 : 0,
                      },
                    ]}
                    source={{
                      uri: item?.files[0]?.trim(),
                      priority: FastImage.priority.high,
                    }}
                  />
                </Pressable>
              );
            }}
          />
        </View>
        <FastImage
          style={styles.mainImg}
          source={{
            uri: displayImage,
            priority: FastImage.priority.high,
          }}
        />
        <View style={[{marginBottom: wp(3)}, globalStyles.rowAC]}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: wp(3)}}
            data={resultImage}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <Pressable key={index} onPress={() => setDisplayImage(item)}>
                  <FastImage
                    style={[
                      styles.listImg,
                      {
                        borderWidth: item === displayImage ? 3 : 0,
                      },
                    ]}
                    source={{
                      uri: item?.trim(),
                      priority: FastImage.priority.high,
                    }}
                  />
                </Pressable>
              );
            }}
          />
        </View>
        <View style={globalStyles.rowJB}>
          <View style={globalStyles.rowAC}>
            <IconWithName icon={<SvgIcon.Location />} iconName={'Location'} />
            <IconWithName icon={<SvgIcon.Eraser />} iconName={'Eraser'} />
            <IconWithName icon={<SvgIcon.Upscale />} iconName={'Upscale'} />
          </View>
          <View style={globalStyles.rowAC}>
            <IconWithName icon={<SvgIcon.Download />} iconName={'Download'} />
            <IconWithName icon={<SvgIcon.Share />} iconName={'Share'} />
          </View>
        </View>
        <View
          style={[
            globalStyles.rowJB,
            {marginHorizontal: wp(3.5), marginTop: wp(4)},
          ]}>
          <Pressable style={[globalStyles.rowC, styles.btnStyle]}>
            <FontText
              name={'regular'}
              size={normalize(13)}
              color={colors.black}>
              {'Public'}
            </FontText>
            <Switch
              style={{marginHorizontal: wp(1.5)}}
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
            <FontText
              name={'regular'}
              size={normalize(13)}
              color={colors.black}>
              {'Private'}
            </FontText>
          </Pressable>
          <Pressable
            style={[
              globalStyles.rowC,
              styles.btnStyle,
              {backgroundColor: colors.darkGray, borderColor: colors.darkGray},
            ]}>
            <SvgIcon.Shop />
            <FontText
              pLeft={wp(2)}
              name={'bold'}
              size={normalize(13)}
              color={colors.white}>
              {'Shop'}
            </FontText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listImg: {
    height: wp(17),
    width: wp(17),
    marginHorizontal: wp(1),
    borderRadius: wp(1),
    borderColor: colors.blue,
  },
  mainImg: {
    height: wp(100),
    width: wp(100),
    marginVertical: wp(3),
  },
  btnStyle: {
    height: wp(11),
    width: wp(44),
    borderWidth: 1.5,
    borderColor: '#120CCA',
    borderRadius: wp(3),
  },
});
