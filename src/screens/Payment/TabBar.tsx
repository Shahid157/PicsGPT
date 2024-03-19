import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import {FontText} from '../../components';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface TabBarProps {
  data?: any;
  activeIndex?: number | string;
  onTabChange?: (index: string) => void;
  tabBarStyle?: any;
  activeTabBarStyle?: StyleProp<any>;
  isLogin?: boolean;
}
export default function TabBar({
  data,
  activeIndex = 'monthly',
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
          const activeTabOpacity = activeIndex === route.key ? 1 : 0;
          return (
            <AnimatedTouchableOpacity
              style={styles.tabBarButtonContainer}
              onPress={() => onTabChange && onTabChange(route.key)}
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
                name={'bold'}
                size={normalize(14)}
                style={{textTransform: 'capitalize'}}
                color={activeIndex === route.key ? colors.white : colors.black}>
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
    backgroundColor: '#6370831F',
    marginHorizontal: wp(10),
    borderRadius: wp(11),
    paddingHorizontal: wp(2),
  },
  activeTab: {
    backgroundColor: colors.black,
    height: '100%',
    position: 'absolute',
    width: '100%',
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
