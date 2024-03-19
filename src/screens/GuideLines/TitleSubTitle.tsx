import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors, SvgIcon} from '../../assets';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '../../components';

interface TitleSubTitleProps {
  onClosePress?: any;
  title?: any;
  subTitle?: any;
  showCrossButton?: boolean;
}

const TitleSubTitle = ({
  onClosePress,
  title,
  subTitle,
  showCrossButton,
}: TitleSubTitleProps) => {
  return (
    <View>
      {showCrossButton && (
        <Pressable onPress={onClosePress}>
          <SvgIcon.Close
            style={{
              alignSelf: 'flex-end',
              padding: wp(2),
              marginRight: wp(5),
            }}
          />
        </Pressable>
      )}
      <FontText
        name={'extraBold'}
        size={normalize(18)}
        color={colors.gray900}
        textAlign={'center'}>
        {title}
      </FontText>
      <FontText
        name={'medium'}
        size={normalize(14)}
        color={colors.gray500}
        pTop={wp(2)}
        pRight={wp(6)}
        pLeft={wp(6)}
        textAlign={'center'}
        lineHeightFactor={1.4}>
        {subTitle}
      </FontText>
      <View style={styles.line} />
    </View>
  );
};

export default TitleSubTitle;

const styles = StyleSheet.create({
  line: {
    height: wp(0.4),
    width: wp(100),
    backgroundColor: colors.gray4,
    marginVertical: wp(3),
  },
});
