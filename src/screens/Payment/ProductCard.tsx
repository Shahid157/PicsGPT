import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {FontText} from '../../components';
import globalStyles from '../../styles';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import SvgIcon from '../../assets/SvgIcon';

interface CardProps {
  isGradient?: boolean;
  title: string;
  cardColor: string;
  buttonTextColor: string;
  vipCondition?: string;
  serverDescription: string;
  priceString: string;
  identifier: string;
  disabled?: boolean;
  isLoading?: boolean;
  onPressAction: (identifier: string) => void;
  buttonColor: string[];
}

export default function Card({
  title,
  vipCondition,
  serverDescription,
  priceString,
  identifier,
  cardColor,
  buttonColor,
  onPressAction,
  disabled,
  isLoading,
}: CardProps) {
  return (
    <View
      style={[
        styles.cardView,
        globalStyles.boxShadow,
        {backgroundColor: cardColor},
      ]}>
      <FontText
        name={'extraBold'}
        size={normalize(16)}
        color={disabled ? colors.gray : colors.black}>
        {title}
      </FontText>
      {vipCondition && (
        <FontText pTop={wp(3)} name={'bold'} size={normalize(14)}>
          {vipCondition}
        </FontText>
      )}

      <FontText
        pTop={wp(3)}
        name={'medium'}
        size={normalize(14)}
        color={disabled ? colors.gray : colors.black}>
        {serverDescription}
      </FontText>

      <TouchableOpacity
        disabled={disabled}
        onPress={() => onPressAction(identifier)}>
        <LinearGradient
          colors={buttonColor}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}>
          <View style={styles.innerContainer}>
            {isLoading ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <FontText
                textAlign={'center'}
                name={'bold'}
                size={normalize(16)}
                color={disabled ? colors.gray : colors.black}>
                {priceString}
              </FontText>
            )}
            <SvgIcon.NextArrow style={styles.arrowStyle} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    height: wp(12),
    width: wp(76),
    marginTop: wp(4),
    borderRadius: wp(3), // <-- Outer Border Radius
  },
  innerContainer: {
    borderRadius: wp(2.5), // <-- Inner Border Radius
    flex: 1,
    margin: wp(0.6), // <-- Border Width
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    backgroundColor: 'transparent',
  },
  cardView: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: wp(2.7),
    paddingVertical: wp(4),
    paddingHorizontal: wp(2),
    marginBottom: wp(4),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
  },
  btnStyle: {
    marginHorizontal: wp(5),
    paddingVertical: wp(1),
    backgroundColor: colors.black,
    borderRadius: wp(3),
    width: wp(76),
    height: wp(12),
    marginTop: wp(4),

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  arrowStyle: {
    position: 'absolute',
    right: wp(8),
  },
});
