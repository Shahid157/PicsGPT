import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import {FontText} from '..';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface TabBarProps {
  data?: any;
  activeIndex: number;
  onTabChange?: any;
  tabBarStyle?: any;
  activeTabBarStyle?: any;
  isLogin?: boolean;
}
export default function TabBar({
  data,
  activeIndex = 0,
  onTabChange,
  tabBarStyle,
  activeTabBarStyle,
  isLogin,
}: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.tabBarContainer, tabBarStyle]}>
        {data.map((route?: any, index?: any) => {
          const tabFlex = 0.5;
          const activeTabOpacity = activeIndex === index ? 1 : 0;
          return (
            <AnimatedTouchableOpacity
              style={styles.tabBarButtonContainer}
              onPress={() => onTabChange(route.key)}
              key={route.key}>
              <View
                style={[
                  styles.activeTab,
                  activeTabBarStyle,
                  {
                    opacity: activeTabOpacity,
                  },
                ]}
              />
              <FontText
                name={isLogin ? 'bold' : 'medium'}
                size={normalize(14)}
                color={
                  isLogin
                    ? activeIndex === index
                      ? colors.white
                      : colors.black
                    : colors.black
                }>
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
    // paddingBottom: wp(8),
    // borderTopLeftRadius: wp(5),
    // borderTopRightRadius: wp(5),
    marginTop: wp(4),
    backgroundColor: '#6370831F',
    marginHorizontal: wp(12),
    borderRadius: wp(11),
    paddingHorizontal: wp(2),
  },
  activeTab: {
    backgroundColor: colors.white,
    height: '100%',
    position: 'absolute',
    width: '94%',
    borderRadius: wp(11),
    paddingVertical: wp(4),
  },
  tabBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(3),
  },
});
