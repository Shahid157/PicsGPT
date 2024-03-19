/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect} from 'react';
import {setTopLevelNavigation} from './navigationHelper';
import TabNavigator from './TabNavigator';
import DrawerContent from './DrawerContent';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import {Platform} from 'react-native';
import {linking} from '../helpers/linking';
import {DrawerParams, ApplicationParams} from './types';
import Heap from '@heap/react-native-heap';
import {usePostHog, PostHogProvider} from 'posthog-react-native';
import {AppEventsLogger} from 'react-native-fbsdk-next';
import Freshpaint from '@freshpaint/freshpaint-react-native';
import {REVENUECAT_API_KEY, POST_HOG_APL_KEY} from '@env';
import Splash from '../screens/Splash';
import OnBoarding from '../screens/OnBoarding';
import PhotosAccess from '../screens/OnBoarding/PhotosAccess';
import PhoneAccess from '../screens/OnBoarding/PhoneAccess';
import PhoneConfirmation from '../screens/OnBoarding/PhoneConfirmation';
import ImageViewer from '../screens/UserDetail/ImageViewer';
import Gender from '../screens/OnBoarding/Gender';
import Brands from '../screens/OnBoarding/Brands';
import ShirtSize from '../screens/OnBoarding/ShirtSize';
import PantsSize from '../screens/OnBoarding/PantsSize';
import JacketSize from '../screens/OnBoarding/JacketSize';
import Confirm from '../screens/OnBoarding/Confirm';

interface PhotosAccessProps {
  navigation?: any;
  route?: any;
}
const FreshpaintNavigationContainer =
  Freshpaint.withReactNavigationAutotrack(NavigationContainer);

const Navigation = () => {
  const Stack = createNativeStackNavigator<ApplicationParams>();
  const Drawer = createDrawerNavigator<DrawerParams>();
  const posthog = usePostHog();
  useEffect(() => {
    posthog?.capture('Test Capture by POST HOG');
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    // Testing for Facebook Events Loggers
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: 'email',
    });

    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AdClick, {
      test: 'Test LogEvent for ads click',
    });

    if (Platform.OS === 'ios') {
      Purchases.configure({
        apiKey: REVENUECAT_API_KEY ?? '',
        useAmazon: false,
        usesStoreKit2IfAvailable: true,
      });
    } else if (Platform.OS === 'android') {
      // await Purchases.configure({apiKey: "public_google_sdk_key"});
    }
  }),
    [];

  function DrawerNavigatorWrapper() {
    return (
      <Drawer.Navigator
        useLegacyImplementation={false}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#c6cbef',
            // width: '80%',
          },
        }}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name={'Tabs'} component={TabNavigator} />
      </Drawer.Navigator>
    );
  }
  return (
    <FreshpaintNavigationContainer
      ref={(ref: any) => {
        setTopLevelNavigation(ref);
      }}
      linking={linking}>
      <PostHogProvider
        apiKey={POST_HOG_APL_KEY || ''}
        options={{
          host: 'https://app.posthog.com',
        }}
        autocapture={{
          captureTouches: true,
          captureLifecycleEvents: true,
          captureScreens: true,
          ignoreLabels: [],
          customLabelProp: 'ph-label',
          noCaptureProp: 'ph-no-capture',
        }}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={'Splash'} component={Splash} />
          {/* <Stack.Screen name={'OnBoarding'} component={OnBoarding} />
          <Stack.Screen name={'PhotosAccess'} component={PhotosAccess} />
          <Stack.Screen name={'PhoneAccess'} component={PhoneAccess} />
          <Stack.Screen name={'Gender'} component={Gender} />
          <Stack.Screen name={'Brands'} component={Brands} />
          <Stack.Screen name={'ShirtSize'} component={ShirtSize} />
          <Stack.Screen name={'PantsSize'} component={PantsSize} />
          <Stack.Screen name={'JacketSize'} component={JacketSize} />
          <Stack.Screen name={'Confirm'} component={Confirm} />
          <Stack.Screen
            name={'PhoneConfirmation'}
            component={PhoneConfirmation}
          /> */}
          <Stack.Screen name={'MyDrawer'} component={DrawerNavigatorWrapper} />
        </Stack.Navigator>
      </PostHogProvider>
    </FreshpaintNavigationContainer>
  );
};
const HeapNavigationContainer = Heap.withReactNavigationAutotrack(Navigation);

export default HeapNavigationContainer;
// export default Navigation;
