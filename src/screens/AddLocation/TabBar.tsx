import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import {FontText} from '../../components';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface TabBarProps {
  data?: any;
  activeIndex?: number;
  onTabChange?:((index:number) => void) | undefined ;
}

export default function TabBar({data, activeIndex, onTabChange}: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.tabBarContainer]}>
        {data.map((route?: any, index?: any) => {
          const tabFlex = 0.5;
          const activeTabOpacity = activeIndex === index ? 1 : 0;
          return (
            <AnimatedTouchableOpacity
              style={styles.tabBarButtonContainer}
              onPress={() => onTabChange && onTabChange(index)}
              key={index.toString()}>
              <View style={[styles.activeTab, {opacity: activeTabOpacity}]} />
              <FontText
                name={activeIndex === index ? 'bold' : 'medium'}
                size={normalize(16)}
                color={activeIndex === index ? colors.blue : colors.gray500}>
                {route?.title}
              </FontText>
            </AnimatedTouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: wp(1),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
  },
  activeTab: {
    backgroundColor: colors.blue,
    height: wp(1),
    position: 'absolute',
    top: wp(-2),
    width: '100%',
  },
  tabBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(3),
  },
});
