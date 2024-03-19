import React, {createContext, useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Navigation from './src/navigation/routes';
import {PaperProvider} from 'react-native-paper';
import {Provider, useSelector} from 'react-redux';
import Loader from './src/components/Loader';
import {StatsigProvider} from 'statsig-react-native';
import Freshpaint from '@freshpaint/freshpaint-react-native';
import {initialize} from 'react-native-clarity';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {isAndroid, environments} from './src/constants/index';
import data from './src/constants/data';
import CrispChat, {show} from 'react-native-crisp-chat-sdk';
import {ToastProvider} from 'react-native-toast-notifications';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/store/persistStore';
import {STATSIG_API_KEY, ONE_SIGNAL_KEY, CLARITY_KEY} from '@env';
import {FRESHPAINT_ENV_ID} from '@env';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {colors} from './src/assets';
import SvgIcon from './src/assets/SvgIcon';

interface AppProviderProps {
  children: any;
}

const App = () => {
  var showChat: boolean;
  const AppContext = createContext({});

  GoogleSignin.configure();

  const AppProvider = (props: AppProviderProps) => {
    const loader: any = useRef();
    const globalFunc = {
      startLoader: () => loader.current?.start(),
      stopLoader: () => loader.current?.stop(),
      isLoading: () => loader.current?.isLoading(),
    };
    showChat = useSelector((state: any) => state.chatReducer.isChatOpen);
    return (
      <PaperProvider>
        <AppContext.Provider value={{...globalFunc}}>
          {props.children}
          <Loader ref={loader} />
        </AppContext.Provider>
      </PaperProvider>
    );
  };
  const setupOneSignal = () => {
    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    OneSignal.initialize(ONE_SIGNAL_KEY || '');

    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removinpg the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);

    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener('click', event => {});
  };
  const initializationOfApp = () => {
    setupOneSignal();
    Freshpaint.init(FRESHPAINT_ENV_ID);
    isAndroid && initialize(CLARITY_KEY || '');
  };

  useEffect(() => {
    initializationOfApp();
  }, []);

  return (
    <StatsigProvider
      sdkKey={STATSIG_API_KEY ?? ''}
      waitForInitialization={true}
      user={data.testUserForStatsig}
      options={{
        environment: {tier: environments.STAGING},
      }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppProvider>
            <AppContext.Consumer>
              {funcs => {
                global.props = {...funcs};
                return (
                  <View {...funcs} style={styles.container}>
                    <ToastProvider
                      successColor={colors.green}
                      successIcon={<SvgIcon.Tick />}>
                      <Navigation />
                      {showChat && <CrispChat />}
                    </ToastProvider>
                  </View>
                );
              }}
            </AppContext.Consumer>
          </AppProvider>
        </PersistGate>
      </Provider>
    </StatsigProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
