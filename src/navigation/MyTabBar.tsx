/* eslint-disable react/react-in-jsx-scope */
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgIcon from '../assets/SvgIcon';
import {isX, wp} from '../styles/responsiveScreen';
import {colors} from '../assets';
import {useEffect, useRef, useState} from 'react';
import defaultImage from '../assets/images/userDefault.png';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {LogInBottomSheet} from '../components';
import {Modalize} from 'react-native-modalize';
interface MyTabBarProps {
  state?: any;
  descriptors?: any;
  navigation?: any;
}

export default function MyTabBar({
  state,
  descriptors,
  navigation,
}: MyTabBarProps) {
  const [profilePic, setProfilePic] = useState('');
  const userProfilePic = useSelector(
    (state: any) => state.auth?.user?.user_metadata?.picture,
  );

  //to check user is logged_in or not
  const {userId} = useSelector((stateId: RootState) => stateId?.auth);
  const bottomSheetRef = useRef<Modalize>(null);

  useEffect(() => {
    setProfilePic(userProfilePic);
  }, [userProfilePic]);
  return (
    <View style={styles.mainContainer}>
      <LogInBottomSheet modalizeRef={bottomSheetRef} />
      {state.routes.map((route?: any, index?: any) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = async () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            if (route.name === 'Add') {
              await AsyncStorage.setItem(
                '@MySuperStore:key',
                'I like to save it.',
              );
            }

            //to check if user is on profile and logged_in
            if (route.name === 'ProfileStack' && !userId) {
              bottomSheetRef.current?.open();
            } else {
              navigation.navigate({name: route.name, merge: true});
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        let icon;
        if (route.name === 'Home') {
          icon = isFocused ? <SvgIcon.HomeSelected /> : <SvgIcon.Home />;
        } else if (route.name === 'AddModel') {
          icon = isFocused ? <SvgIcon.AddSelected /> : <SvgIcon.Add />;
        } else if (route.name === 'AddPhotoAIStyle') {
          icon = isFocused ? (
            <View style={styles.fillPhotoIcon}>
              <SvgIcon.PhotoAIIcon />
            </View>
          ) : (
            <View style={styles.unFilledIcon}>
              <SvgIcon.PhotoAIIcon />
            </View>
          );
        } else if (route.name === 'Activity') {
          icon = isFocused ? (
            <SvgIcon.ActivitySelected />
          ) : (
            <SvgIcon.Activity />
          );
        } else if (route.name === 'ProfileStack') {
          if (profilePic) {
            icon = (
              <FastImage
                style={styles.profilePicStyle(isFocused)}
                source={{uri: userProfilePic}}
                resizeMode="cover"
              />
            );
          } else {
            icon = (
              <FastImage
                style={styles.defaultProfileCircle(isFocused)}
                source={defaultImage}
                resizeMode="cover"
              />
            );
          }
        }

        return index < 5 ? (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabContainer}>
            {icon}
          </TouchableOpacity>
        ) : null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(1),
    paddingHorizontal: wp(9),
    marginBottom: isX ? wp(7) : wp(4),
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingTop: wp(0),
  },
  fillPhotoIcon: {
    backgroundColor: '#3B35F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unFilledIcon: {
    backgroundColor: 'black',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicStyle: (focused: boolean) => ({
    height: wp(8.2),
    width: wp(8.2),
    borderRadius: wp(5),
    borderColor: colors.blue,
    borderWidth: focused ? wp(0.4) : 0,
    alignSelf: 'center',
    resizeMode: 'cover',
  }),
  defaultProfileCircle: (focused: boolean) => ({
    height: wp(8.2),
    width: wp(8.2),
    borderRadius: wp(5),
    borderColor: colors.blue,
    borderWidth: focused ? wp(0.4) : 0,
  }),
});
