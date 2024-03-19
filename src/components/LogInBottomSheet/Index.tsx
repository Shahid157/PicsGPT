/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
  Linking,
  Keyboard,
  Alert,
} from 'react-native';

import {Modalize} from 'react-native-modalize';
import fetchPremium from '../../api/fashion/fetch_Premium';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {SvgIcon, colors, fonts} from '../../assets';
import {TabView, SceneMap} from 'react-native-tab-view';
import Input from '../Input';
import TabBar from './TabBar';
import {FontText} from '..';
import globalStyles from '../../styles';
import {Button, Text} from 'react-native-paper';
import {isEmailValid} from '../../helpers/validation';
import {supabase} from '../../supabase/supabase';
import {useFocusEffect} from '@react-navigation/native';
import strings from '../../assets/strings';
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/actions';
import Checkbox from '../Checkbox';
import stylistNamePng from '../../assets/images/stylistName.png';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import PhoneInput from 'react-native-phone-number-input';
import {url} from '../../constants/linkingUrls';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Toast} from 'react-native-toast-notifications';
import {showToast} from '../CommonToast';
import MultipleOptionsPopup from '../MultipleOptionsPopup/multipleOptionsPopup';

interface BottomSheetRef {
  modalizeRef?: any;
  onSignInPress?: () => void;
}
interface GoogleButtonProps {
  title?: string;
}
interface DiscordButtonProps {
  title?: string;
}

export default function LoginBottomSheet({modalizeRef}: BottomSheetRef) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verification, setverification] = useState<boolean>(false);
  const [confPassword, setConfPassword] = useState<string>('');
  const [checkValid, setCheckValid] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [VerificationCode, setVerificationCode] = useState();
  const [isSignInLoading, setIsSignInLoading] = useState<boolean>(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const layout = useWindowDimensions();
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setloading] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const phoneInput = useRef<PhoneInput>(null);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [emailLogin, setEmailLogin] = useState<boolean>(false);
  const [routes] = useState<{key: number; title: string}[]>([
    {key: 0, title: 'Sign In'},
    {key: 1, title: 'Sign Up'},
  ]);
  const CELL_COUNT = 6;
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIndex(0);
        setEmail('');
        setPassword('');
        setConfPassword('');
        setCheckValid(false);
      };
      fetchData();
    }, []),
  );
  const handleVerificationCodeChange = async (code: string) => {
    setVerificationCode(code);
    if (code.length === CELL_COUNT) {
      Keyboard.dismiss();
      const updatedToken = code;
      const {data, error} = await supabase.auth.verifyOtp({
        phone: phone,
        token: updatedToken,
        type: 'sms',
      });
      if (!data?.user) {
        Alert.alert('Error', error?.message);
      } else {
        const res = Object.assign(data, {rememberMe: true, isEmail: true});
        dispatch(authActions.login(res));
        modalizeRef?.current.close();
      }
    }
  };
  const FirstRoute = () => (
    <View style={styles.routeContainer}>
      <Image source={stylistNamePng} />
    </View>
  );

  const SecondRoute = () => <View style={styles.secondRouteCont} />;

  const renderScene = SceneMap({
    0: FirstRoute,
    1: SecondRoute,
  });

  const renderTabBar = () => {
    return (
      <TabBar
        activeIndex={index}
        data={routes}
        onTabChange={(i?: any) => {
          setCheckValid(false);
          setEmail('');
          setPassword('');
          setConfPassword('');
          setIndex(i);
          setError('');
        }}
        tabBarStyle={{
          borderRadius: wp(2),
          paddingHorizontal: wp(0),
          backgroundColor: colors.gray1,
        }}
        activeTabBarStyle={styles.activeTab}
        isLogin
      />
    );
  };

  const GoogleButton = ({title}: GoogleButtonProps) => {
    return (
      <Pressable onPress={googleLogin} style={styles.googlePress}>
        <SvgIcon.Google />
        <FontText style={{fontSize: 12, left: 10, fontWeight: '700'}}>
          {title}
        </FontText>
      </Pressable>
    );
  };
  const DiscordButton = ({title}: DiscordButtonProps) => {
    return (
      <Pressable onPress={() => {}} style={styles.googlePress}>
        <SvgIcon.Discord />
        <FontText style={{fontSize: 12, fontWeight: '700'}}>{title}</FontText>
      </Pressable>
    );
  };

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        const {data, error} = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });
        if (!error && data?.user?.role === 'authenticated') {
          const premium = await fetchPremium(data?.user?.id);

          const res = Object.assign(data, {
            rememberMe: true,
            isEmail: false,
            premium: premium,
          });

          dispatch(authActions.login(res));
          modalizeRef?.current.close();
        }
      } else {
        throw new Error('no ID token present!');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Signin Cancelled');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signin IN Progress');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('Something else:', error);
      }
    }
  };
  const onSignInPress = () => {
    setIsVisible(!visible);
    setEmail('');
    setPassword('');
    setConfPassword('');
    setEmailLogin(true);
    setIndex(0);
    setTimeout(() => {
      modalizeRef?.current.open();
    }, 100);
  };
  const onSignUpHandler = async () => {
    setIsSignUpLoading(true);
    setCheckValid(true);
    if (
      email.length !== 0 &&
      isEmailValid(email) &&
      password.length !== 0 &&
      password === confPassword
    ) {
      const res = await supabase.auth.signUp({
        email: email,
        password: password,
      });
    }
    setIsSignUpLoading(false);
    setIsVisible(true);
  };

  const onSignInHandler = async () => {
    setIsSignInLoading(true);
    setCheckValid(true);
    if (email.length !== 0 && isEmailValid(email) && password.length !== 0) {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        const err = error.message;
        setError(err);
      } else if (data?.user?.role === 'authenticated') {
        const premium = await fetchPremium(data?.user?.id);

        const res = Object.assign(data, {
          rememberMe: isChecked,
          isEmail: true,
          premium: premium,
        });

        dispatch(authActions.login(res));
        modalizeRef?.current.close();
      }
    }
    setIsSignInLoading(false);
  };
  const handleLoginWithPhone = async type => {
    if (phone.length) {
      setloading(true);
      const {error} = await supabase.auth.signInWithOtp({
        phone: phoneInput?.current?.getCallingCode() + phone,
      });
      setPhone(phoneInput?.current?.getCallingCode() + phone);
      if (error) {
        return showToast(
          'Something went wrong, Please try again',
          'top',
          'error',
        );
      }
      if (type !== 'resend') {
        setverification(true);
      } else {
        setTimer(60);
      }
      setloading(false);
      return showToast(
        `Verification Code ${
          type !== 'resend' ? 'Sent' : 'Resent'
        } to your Phone`,
        'top',
        'success',
      );
    } else {
      showToast('Please enter a valid Phone number', 'top', 'error');
    }
  };
  const isStrongPassword = (passwordKey: string) => {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    return passwordPattern.test(passwordKey);
  };

  const passwordNotMatch = password !== confPassword;
  const isValidEmail =
    checkValid && (email.length === 0 || !isEmailValid(email));
  const isValidPassword = checkValid && password.length === 0;
  const isValidConfirmPassword =
    checkValid && (confPassword.length === 0 || passwordNotMatch);
  const isPasswordStrong = isStrongPassword(password);

  return (
    <Modalize
      adjustToContentHeight
      ref={modalizeRef}
      withReactModal
      withHandle={false}>
      <View style={{marginBottom: hp(5)}}>
        <FontText
          textAlign={'center'}
          pTop={wp(0.5)}
          style={styles.heading}
          size={normalize(10.5)}
          color={colors.black}>
          {index === 0 ? strings.signin : strings.signup}
        </FontText>
        {/* //phone */}
        {index === 0 && (
          <>
            <View
              style={{
                height: hp(25),
                alignItems: 'center',
              }}>
              <View>
                {verification === false ? (
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={phone}
                    defaultCode="US"
                    layout="first"
                    countryPickerButtonStyle={{backgroundColor: '#f8f8f8'}}
                    containerStyle={{
                      alignSelf: 'center',
                      top: 5,
                      width: '90%',
                    }}
                    onChangeText={text => {
                      setPhone(text);
                    }}
                  />
                ) : (
                  <View style={{height: hp(20)}}>
                    <CodeField
                      ref={ref}
                      {...props}
                      value={VerificationCode}
                      onChangeText={handleVerificationCodeChange}
                      cellCount={CELL_COUNT}
                      rootStyle={styles.codeFieldRoot}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      renderCell={({index, symbol, isFocused}) => (
                        <Text
                          key={index}
                          style={[styles.cell, isFocused && styles.focusCell]}
                          onLayout={getCellOnLayoutHandler(index)}>
                          {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                      )}
                    />
                    <View style={styles.bottomContainer}>
                      <FontText size={12} color={colors.black}>
                        If you didn’t receive a code?
                      </FontText>
                      <TouchableOpacity
                        onPress={() => {
                          handleLoginWithPhone('resend');
                        }}>
                        <FontText
                          size={12}
                          color={colors.blue}
                          style={styles.signInBtn}>
                          Resend
                        </FontText>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <Button
                onPress={() => {
                  if (verification) {
                    setverification(false);
                    setPhone('');
                  } else if (!verification && phone != '') {
                    handleLoginWithPhone();
                    setVerificationCode('');
                  } else {
                    Alert.alert('Phone number is required');
                  }
                }}
                style={[styles.btnStyle, {width: '90%', top: 15}]}
                labelStyle={styles.btnLable}
                mode="contained"
                loading={isSignUpLoading}
                disabled={isSignUpLoading}>
                {verification === false
                  ? strings.verification
                  : 'Change Number'}
              </Button>

              <View style={{marginVertical: 20}}>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.verifyNote}
                  size={normalize(10.5)}
                  color={colors.black}>
                  {verification == false
                    ? strings.verificationNote
                    : strings.verifyNote}
                </FontText>
              </View>
              <View style={[styles.seprator, {top: 5}]}>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.line}
                  size={normalize(10.5)}
                  color={colors.black}>
                  _____________________________
                </FontText>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.OR}
                  size={normalize(10.5)}
                  color={colors.black}>
                  Or
                </FontText>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.line}
                  size={normalize(10.5)}
                  color={colors.black}>
                  _____________________________
                </FontText>
              </View>
            </View>

            <View
              style={[
                styles.btnWrapper,
                {marginTop: !verification ? hp(10) : hp(20)},
              ]}>
              <GoogleButton title={strings.signInWithGoogle} />
              {/* <DiscordButton title={strings.signInWithDiscord} /> */}
            </View>
            {emailLogin ? (
              <View style={[styles.seprator, {marginVertical: 10}]}>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.line}
                  size={normalize(10.5)}
                  color={colors.black}>
                  _____________________________
                </FontText>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.OR}
                  size={normalize(10.5)}
                  color={colors.black}>
                  Or
                </FontText>
                <FontText
                  textAlign={'center'}
                  pTop={wp(0.5)}
                  style={styles.line}
                  size={normalize(10.5)}
                  color={colors.black}>
                  _____________________________
                </FontText>
              </View>
            ) : (
              <View style={styles.accountLink}>
                <FontText size={normalize(11)} textAlign="center" color="grey">
                  {strings?.usewith}
                </FontText>
                <TouchableOpacity
                  onPress={() => {
                    setEmailLogin(true);
                  }}>
                  <FontText
                    size={normalize(11)}
                    style={{textDecorationLine: 'underline', fontWeight: '800'}}
                    textAlign="center"
                    color="blue">
                    {'email'}
                  </FontText>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {index === 0 && emailLogin === true && (
          <View style={styles.container}>
            <Input
              inputContainer={styles.inputView}
              placeholder={strings.email}
              value={email}
              onChangeText={(text: any) => setEmail(text)}
            />
            <FontText
              textAlign={'right'}
              pTop={wp(0.5)}
              size={normalize(10.5)}
              color={isValidEmail ? 'red' : colors.white}>
              {isValidEmail
                ? checkValid && email.length === 0
                  ? strings.emailRequired
                  : strings.invalidEmail
                : strings.valid}
            </FontText>
            <Input
              inputContainer={styles.inputView}
              placeholder={strings.password}
              value={password}
              onChangeText={(text: any) => setPassword(text)}
              secureTextEntry={isSecure}
              rightIcon
              onIconPress={() => setIsSecure(!isSecure)}
            />
            <FontText
              textAlign={'right'}
              pTop={wp(0.5)}
              size={normalize(10.5)}
              color={
                isValidPassword || (password.length !== 0 && !isPasswordStrong)
                  ? 'red'
                  : colors.white
              }>
              {isValidPassword
                ? strings.passwordRequired
                : password.length !== 0 && !isPasswordStrong
                ? strings.passwordMustBeStrong
                : strings.valid}
            </FontText>
            <View style={[globalStyles.rowJB, styles.rememberMe]}>
              <View style={globalStyles.rowJB}>
                <Checkbox
                  onCheckboxPress={handleCheckboxPress}
                  checked={isChecked}
                  lable={strings.rememberMe}
                />
              </View>
              <FontText
                name={'medium'}
                size={normalize(12.11)}
                color={colors.black}
                style={{textDecorationLine: 'underline'}}>
                {strings.forgotPassword}
              </FontText>
            </View>
            <View style={styles.btnWrapper}>
              <Button
                onPress={onSignInHandler}
                style={[styles.btnStyle]}
                labelStyle={styles.btnLable}
                mode="contained"
                loading={isSignInLoading}
                disabled={isSignInLoading}>
                {strings.signin}
              </Button>
            </View>
            {error && (
              <View style={styles.errorView}>
                <FontText
                  name={'medium'}
                  size={normalize(13)}
                  textAlign="center"
                  color="white">
                  {error}
                </FontText>
              </View>
            )}
            <View style={styles.accountLink}>
              <FontText size={normalize(11)} textAlign="center" color="grey">
                {strings?.noAccount}
              </FontText>
              <TouchableOpacity
                onPress={() => {
                  setIndex(1);
                }}>
                <FontText size={normalize(11)} textAlign="center" color="blue">
                  {strings?.singupText}
                </FontText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {index === 1 && (
          <View style={styles.container}>
            <Input
              inputContainer={styles.inputView}
              placeholder={strings.email}
              value={email}
              onChangeText={(text: any) => setEmail(text)}
            />
            <FontText
              textAlign={'right'}
              pTop={wp(0.5)}
              size={normalize(10.5)}
              color={isValidEmail ? 'red' : colors.white}>
              {isValidEmail
                ? checkValid && email.length === 0
                  ? strings.emailRequired
                  : strings.invalidEmail
                : strings.valid}
            </FontText>
            <Input
              inputContainer={styles.inputView}
              placeholder={strings.password}
              value={password}
              onChangeText={(text: any) => setPassword(text)}
              secureTextEntry={true}
            />
            <FontText
              textAlign={'right'}
              pTop={wp(0.5)}
              size={normalize(10.5)}
              color={
                isValidPassword || (password.length !== 0 && !isPasswordStrong)
                  ? 'red'
                  : colors.white
              }>
              {isValidPassword
                ? strings.passwordRequired
                : password.length !== 0 && !isPasswordStrong
                ? strings.passwordMustBeStrong
                : strings.valid}
            </FontText>
            <Input
              inputContainer={styles.inputView}
              placeholder={strings.confirmPassword}
              value={confPassword}
              onChangeText={(text: any) => setConfPassword(text)}
              secureTextEntry={true}
            />
            <FontText
              textAlign={'right'}
              pTop={wp(0.5)}
              size={normalize(10.5)}
              color={isValidConfirmPassword ? 'red' : colors.white}>
              {isValidConfirmPassword
                ? confPassword.length === 0
                  ? strings.confirmPasswordRequired
                  : strings.passwordDoesNotMatch
                : strings.valid}
            </FontText>
            <View style={styles.btnWrapper}>
              <Button
                onPress={onSignUpHandler}
                style={styles.btnStyle}
                labelStyle={styles.btnLable}
                mode="contained"
                loading={isSignUpLoading}
                disabled={isSignUpLoading}>
                {strings.signup}
              </Button>
            </View>
            <View style={styles.accountLink}>
              <FontText size={normalize(11)} textAlign="center" color="grey">
                {strings?.haveAccount}
              </FontText>
              <TouchableOpacity
                onPress={() => {
                  setIndex(0);
                }}>
                <FontText size={normalize(11)} textAlign="center" color="blue">
                  {strings?.signinText}
                </FontText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View style={styles.accountLink}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(url.PrivacyPolicy);
          }}>
          <FontText
            size={normalize(11)}
            style={styles.privacy}
            color="#a6a6a6"
            textAlign="center">
            {strings.PrivacyPolicy}
          </FontText>
        </TouchableOpacity>
      </View>
      <MultipleOptionsPopup
        isVisible={visible}
        description={`Verfication email sent on ${email} please verify!`}
        positiveBtnName="Sign In"
        negativeBtnName="OK"
        onOkPress={() => {
          onSignInPress();
        }}
        onCancelPress={() => {
          setIsVisible(!visible);
          modalizeRef?.current.close();
        }}
      />
    </Modalize>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: wp(8),
  },
  privacy: {
    textDecorationLine: 'underline',
    marginBottom: 20,
    fontWeight: '800',
  },
  bottomContainer: {
    flexDirection: 'row',
    top: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  OR: {
    fontSize: 12,
    paddingTop: 6,
    color: colors.lightBG,
    textAlign: 'center',
  },
  verifyNote: {
    fontSize: 12,
    color: colors.lightBG,
    top: 10,
    textAlign: 'center',
  },
  heading: {fontSize: 30, paddingTop: 30, fontWeight: '800'},
  codeFieldRoot: {
    marginVertical: wp(3),
    width: '90%',
  },
  line: {
    fontSize: 12,
    color: colors.lightBG,
    textAlign: 'center',
  },
  cell: {
    width: wp(13),
    height: wp(15),
    lineHeight: wp(15),
    fontSize: 24,
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
    backgroundColor: colors.gray200,
  },
  seprator: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    marginTop: wp(7),
    marginBottom: wp(2),
  },
  inputView: {
    height: wp(15),
    width: wp(90),
    alignSelf: 'center',
    borderRadius: wp(2),
    borderColor: colors.gray2,
    marginTop: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#EEEEEE',
  },
  borderView: {
    marginTop: wp(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(5),
  },
  googlePress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '90%',
    height: 55,
    borderRadius: wp(1),
    borderWidth: 0.5,
  },
  google: {},
  rememberMe: {
    // marginTop: wp(3),
  },
  square: {
    height: wp(4.7),
    width: wp(4.7),
    borderWidth: 1,
    borderRadius: wp(1.3),
    borderColor: colors.gray500,
  },
  btnStyle: {
    paddingVertical: wp(2.5),
    backgroundColor: colors.black,
    width: wp(90),
    borderRadius: wp(1),
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    width: '100%',
    marginTop: wp(5),
  },
  btnLable: {
    fontSize: normalize(13),
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.white,
  },
  errorView: {
    backgroundColor: colors.red,
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
    marginTop: wp(2.5),
    borderRadius: wp(1),
  },
  routeContainer: {flex: 1, backgroundColor: '#ff4081'},
  secondRouteCont: {flex: 1, backgroundColor: '#673ab7'},
  activeTab: {
    borderRadius: wp(2),
    backgroundColor: colors.black,
    paddingVertical: wp(5),
    width: '100%',
  },
  accountLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(4),
    gap: wp(1),
  },
});
