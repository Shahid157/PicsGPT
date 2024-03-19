import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {CommonHeader, FontText} from '../../components';
import globalStyles from '../../styles';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import {Button} from 'react-native-paper';
import fonts from '../../assets/fonts';
import LinearGradient from 'react-native-linear-gradient';
import SvgIcon from '../../assets/SvgIcon';
import TabBar from './TabBar';
import Purchases, {
  PurchasesStoreProduct,
  PurchasesOffering,
} from 'react-native-purchases';

interface CardProps {
  isGradient?: boolean;
  title?: string;
  vipCondition?: string;
  condition?: string;
  duration?: string;
  titleColor?: string;
  vipConditionColor?: string;
  conditionColor?: string;
  durationColor?: string;
  cardColor?: string;
  buttonColor?: string;
  buttonTitle?: string;
  buttonTextColor?: string;
  buttonSubText?: string;
  onPressAction?: any;
  products: PurchasesOffering;
  isCurrentOffer?: boolean;
}

export default function Card({
  isGradient,
  title,
  duration,
  titleColor,
  vipConditionColor,
  conditionColor,
  durationColor,
  cardColor,
  buttonColor,
  buttonTitle,
  buttonTextColor,
  buttonSubText,
  onPressAction,
  products,
  isCurrentOffer = false,
}: CardProps) {

  const {
    availablePackages,
    identifier,
    metadata,
    serverDescription,
    ...packages
  } = products;

  const packageKeys = Object.keys(packages).sort();

  const tabBarData = packageKeys.map((key) => ({
    key : key,
    title: key
  }))
  const [selectedTab, setTab] = useState<string>(packageKeys[0]);


  const renderContent = () => {
    return (
      <View
        style={[
          styles.cardView,
          globalStyles.boxShadow,
          {backgroundColor: cardColor, marginBottom: isCurrentOffer ? 0 : 12},
        ]}>
        <FontText name={'extraBold'} size={normalize(16)} color={titleColor}>
          {title}
        </FontText>

        <FontText
          pTop={wp(3)}
          name={'bold'}
          size={normalize(14)}
          color={vipConditionColor}>
          {`${metadata.images_count} Images, ${metadata.styles_count} Styles, ${metadata.type}`}
        </FontText>

        <FontText
          pTop={wp(3)}
          name={'medium'}
          size={normalize(14)}
          color={conditionColor}>
          {products.serverDescription}
        </FontText>

        <TouchableOpacity
          onPress={() =>
            onPressAction(products[selectedTab].product.identifier)
          }>
          <LinearGradient
            colors={metadata?.button?.colors ?? ['#cccccc', '#cccccc']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.linearGradient}>
            <View style={styles.innerContainer}>
              <FontText
                textAlign={'center'}
                name={'bold'}
                size={normalize(16)}
                color={colors.black}>
                {products[selectedTab]?.product?.priceString}
                <FontText name={'regular'} color={colors.black}>
                  {selectedTab == 'monthly' ? ' / month' : ' / year'}
                </FontText>
              </FontText>
              <SvgIcon.NextArrow style={styles.arrowStyle} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  if (isCurrentOffer) {
    return (
      <LinearGradient
        colors={['#FF00D6', '#FF3823', '#AD00FC', '#1400FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          padding: 8,
          borderRadius: wp(2.7) + 4,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}>
        {renderContent()}
      </LinearGradient>
    );
  }
  return renderContent();
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
    paddingVertical: wp(4),
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
