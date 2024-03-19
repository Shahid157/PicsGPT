import {useRef, useState} from 'react';
import {FontText} from '../../components';
import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../assets';
import {wp} from '../../constants';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';
import PhoneInput from 'react-native-phone-number-input';
import {Toast} from 'react-native-toast-notifications';
import {supabase} from '../../supabase/supabase';
import strings from '../../assets/strings';
import {showToast} from '../../components/CommonToast';

interface PhoneAccessProps {
  navigation?: any;
  route?: any;
}
const handlePress = () => {
  Keyboard.dismiss();
};

export default function PhoneAccess({navigation, route}: PhoneAccessProps) {
  const [phone, setPhone] = useState('');
  const [loading, setloading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
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
      } else {
        navigation.navigate('PhoneConfirmation', {
          phone: phoneInput?.current?.getCallingCode() + phone,
        });
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
            Phone Number
          </FontText>
          <FontText style={styles.text} size={12} color={colors.gray}>
            Phone number used to verify via text
          </FontText>
          <View style={{marginTop: wp(15)}}>
            <PhoneInput
              defaultValue={phone}
              ref={phoneInput}
              defaultCode="US"
              layout="first"
              onChangeText={text => {
                setPhone(text);
              }}
              withShadow
              autoFocus
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            buttonColor={colors.black}
            labelStyle={styles.btnLabel}
            onPress={() => {
              if (phone != '') {
                handleLoginWithPhone();
              } else {
                showToast('Phone number is required.', 'top', 'error');
              }
              // navigation.navigate('PhoneConfirmation')
            }}
            style={styles.button}>
            {strings.verification}
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
});
