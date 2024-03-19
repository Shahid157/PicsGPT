import React, { PropsWithChildren } from 'react'
import { StyleSheet, Text, View, StyleProp, TouchableOpacity } from 'react-native'
import FontText from '../../components/FontText'
import { normalize, wp } from '../../styles/responsiveScreen';

type CardPropTypes = PropsWithChildren & {
  backgroundColor?: string,
  title: string,
  textColor: string,
  oldPriceColor: string,
  oldPrice: string,
  price: string,
  note?: string,
  features: string[],
  productType: 'subscription' | 'one_time',
  duration?: 'monthly' | 'yearly',
  buttonBgColor: string,
  buttonTextColor: string,
  onPress: () => void
}


const Card = ({
  backgroundColor,
  title,
  textColor,
  oldPriceColor,
  oldPrice,
  price,
  note,
  features = [],
  productType,
  duration,
  buttonBgColor,
  buttonTextColor,
  onPress
}: CardPropTypes) => {
  return (
    <View style={{ backgroundColor, ...styles.container }}>
      <FontText size={normalize(13)} fontWeight={600} color={textColor}>{note}</FontText>
      <FontText
        style={{ marginTop: 10, marginBottom: 8 }}
        size={normalize(24)}
        fontWeight={700}
        color={textColor}
      >
        {title}
      </FontText>
      <View style={styles.priceContainer}>
        <FontText
          textDecoration='line-through'
          size={normalize(14)}
          color={oldPriceColor}
        >
          {oldPrice}
        </FontText>
        <FontText
          textAlign='center'
          size={normalize(24)}
          fontWeight={700}
          color={textColor}
          style={{
            lineHeight: 28,
          }}
        >
          {price}
        </FontText>
        <View style={{ alignItems: 'flex-end' }}>
          <FontText size={normalize(14)} color={textColor}>{productType == 'one_time' ? "one time" : duration}</FontText>
        </View>
      </View>

      <View style={styles.features}>

        {features.map((feature, index) => (
          <FontText 
            size={normalize(12)} 
            style={{ marginHorizontal: 2, lineHeight: 18 }} 
            color={textColor}
            key={index}
          >
              {`\u2022 ${feature}`}
          </FontText>
        ))}
      </View>
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          style={{ backgroundColor: buttonBgColor, ...styles.button}}
          onPress={onPress}
        >
          <FontText fontWeight={500} color={buttonTextColor}>Get Started</FontText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  priceContainer: {
    marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20 
  },
  features: {
    marginVertical: 20, flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: 'center'
  },
  button: {
    width: '100%', height: 40, justifyContent: 'center', alignItems: 'center'
  }
})