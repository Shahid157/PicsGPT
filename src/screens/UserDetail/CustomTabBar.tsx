import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {hp, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface CustomTabBarProps {
  data?: any;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

export default function CustomTabBar({
  data,
  activeIndex,
  onTabChange,
}: CustomTabBarProps) {
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
              key={route.key}>
              <View>{route?.image}</View>
              <View style={[styles.activeTab, {opacity: activeTabOpacity}]} />
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
    paddingTop: hp(2.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
  },
  activeTab: {
    backgroundColor: colors.darkGray,
    height: wp(0.8),
    position: 'absolute',
    bottom: -0.45,
    width: '45%',
    borderRadius: wp(2),
  },
  tabBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(3),
  },
});
