import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import React from 'react';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '../../components';
import globalStyles from '../../styles';
import {Button} from 'react-native-paper';
import {colors} from '../../assets';
import fonts from '../../assets/fonts';

interface ActivityItemProps {
  item: {
    profileImg: ImageSourcePropType;
    userName: string;
    desc: string;
    type?: string;
    time: string;
    isFollow?: boolean;
    styleImage: ImageSourcePropType;
  };
}

export default function ActivityItem({item}: ActivityItemProps) {
  return (
    <View style={styles.itemView}>
      <View style={globalStyles.rowAC}>
        <Image style={styles.profileImgStyle} source={item.profileImg} />
        <View style={{marginLeft: wp(2)}}>
          <FontText name={'semiBold'} size={normalize(12)}>
            {item.userName}
            <FontText size={normalize(12)}>{item.desc}</FontText>
            {item.type ? (
              <FontText name={'semiBold'} size={normalize(12)}>
                {item.type}
              </FontText>
            ) : null}
          </FontText>
          <FontText pTop={wp(1)} name={'light'} size={normalize(12)}>
            {item.time}
          </FontText>
        </View>
      </View>
      {!item?.isFollow ? (
        <Image style={styles.styleImage} source={item.styleImage} />
      ) : (
        <Button
          style={styles.btnStyle}
          labelStyle={styles.followText}
          mode="contained">
          {'Follow Back'}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileImgStyle: {
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
  },
  styleImage: {
    height: wp(10),
    width: wp(10),
  },
  itemView: {
    paddingVertical: wp(2.5),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnStyle: {
    height: wp(7),
    backgroundColor: colors.black,
    borderRadius: wp(1),
  },
  followText: {
    fontSize: normalize(10),
    fontFamily: fonts.bold,
    fontWeight: '700',
    marginHorizontal: wp(3),
    marginVertical: wp(1),
  },
});
