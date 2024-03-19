import {useState} from 'react';
import {FontText} from '../../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {colors} from '../../assets';
import {wp} from '../../constants';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Toast} from 'react-native-toast-notifications';
import {supabase} from '../../supabase/supabase';
import {authActions} from '../../store/actions';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToast} from '../../components/CommonToast';

interface PhoneConfirmationProps {
  navigation?: any;
  route?: any;
}

export default function PhoneConfirmation({
  navigation,
  route,
}: PhoneConfirmationProps) {
  const [VerificationCode, setVerificationCode] = useState('');
  const CELL_COUNT = 6;
  const [loading, setloading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const dispatch = useDispatch();
  const handlePress = () => {
    Keyboard.dismiss();
  };
  const getvalidateUserFlow = async () => {
    let {data, error} = await supabase
      .from('Users')
      .select('*')
      .eq('phone', route?.params?.phone);
    console.log('check data of user exist in backend', data);
    if (data?.length > 0) {
      navigation.navigate('MyDrawer' as never);
    } else {
      navigation.navigate('Gender' as never);
    }
  };
  const handleVerificationCodeChange = async (code: string) => {
    if (VerificationCode.length === CELL_COUNT) {
      Keyboard.dismiss();
      const updatedToken = VerificationCode;
      const {data, error} = await supabase.auth.verifyOtp({
        phone: route?.params?.phone,
        token: updatedToken,
        type: 'sms',
      });
      if (!data?.user) {
        Alert.alert('Error', error?.message);
      } else {
        const res = Object.assign(data, {rememberMe: true, isEmail: true});
        dispatch(authActions.login(res));
        console.log('check data', data);
        AsyncStorage.setItem('userId', data?.user?.id);
        AsyncStorage.setItem('first', 'true');
        getvalidateUserFlow();
      }
    }
  };
  const handleLoginWithPhone = async () => {
    if (route?.params?.phone.length) {
      setloading(true);
      const {error} = await supabase.auth.signInWithOtp({
        phone: route?.params?.phone,
      });
      if (error) {
        return showToast(
          'Something went wrong, Please try again',
          'top',
          'error',
        );
      }
      setloading(false);
      return showToast(
        'Verification Code Resent to your Phone',
        'top',
        'success',
      );
    } else {
      showToast('Please enter a valid Phone number', 'top', 'error');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => handlePress()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <FontText size={19} color={colors.black} style={styles.title}>
            STYLEY
          </FontText>
        </View>
        <View style={styles.centerContainer}>
          <Image
            source={require('../../assets/images/phone.png')}
            style={styles.galleryImage}
          />
          <FontText style={styles.heading} size={25} color={colors.black}>
            Confirmation
          </FontText>

          <View style={{marginTop: wp(2)}}>
            <CodeField
              ref={ref}
              {...props}
              value={VerificationCode}
              onChangeText={text => setVerificationCode(text)}
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
          </View>

          <View style={styles.bottomContainer}>
            <FontText size={12} color={colors.black}>
              If you didn’t receive a code?
            </FontText>
            <TouchableOpacity
              onPress={() => {
                handleLoginWithPhone();
              }}>
              <FontText size={12} color={colors.blue} style={styles.signInBtn}>
                Resend
              </FontText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonColor={colors.black}
            labelStyle={styles.btnLabel}
            onPress={() => {
              handleVerificationCodeChange(VerificationCode);
            }}
            style={styles.button}>
            Confirm
          </Button>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  titleContainer: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
  },
  centerContainer: {
    height: '80%',
    alignItems: 'center',
  },
  galleryImage: {
    marginTop: wp(10),
    height: wp(30),
    width: wp(30),
    backgroundColor: colors.gray1,
    borderRadius: wp(15),
  },
  heading: {
    marginTop: wp(5),
    fontWeight: '500',
  },
  text: {
    marginTop: wp(2),
  },

  buttonContainer: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.none,
    width: wp(90),
    paddingVertical: wp(3),
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  btnLabel: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },

  codeFieldRoot: {
    marginTop: wp(5),
  },
  cell: {
    width: wp(13),
    height: wp(15),
    lineHeight: wp(15),
    fontSize: 24,
    textAlign: 'center',
    justifyContent: 'center',
    marginRight: wp(1),
    backgroundColor: colors.gray200,
  },
  bottomContainer: {
    flexDirection: 'row',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInBtn: {
    left: wp(0.9),
  },
});
