import {FontText} from '../../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {colors} from '../../assets';
import {wp} from '../../constants';
import stylistNamePng from '../../assets/images/stylistName.png';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';

interface OnBoardingProps {
  navigation?: any;
  route?: any;
}

export default function OnBoarding({navigation, route}: OnBoardingProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../assets/images/firstImage.png')}
            style={[
              styles.images,
              {
                width: wp(30),
              },
            ]}
          />
          <Image
            source={require('../../assets/images/secoundImage.png')}
            style={[
              styles.images,
              {
                width: wp(40),
              },
            ]}
          />
          <Image
            source={require('../../assets/images/thirdImage.png')}
            style={[
              styles.images,
              {
                width: wp(24),
              },
            ]}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: wp(2),
          }}>
          <Image
            source={require('../../assets/images/fourthImage.png')}
            style={[
              styles.images,
              {
                width: wp(20),
              },
            ]}
          />
          <Image
            source={require('../../assets/images/fifthImage.png')}
            style={[
              styles.images,
              {
                width: wp(38),
              },
            ]}
          />
          <Image
            source={require('../../assets/images/sixthImage.png')}
            style={[
              styles.images,
              {
                width: wp(34),
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.introContainer}>
        <Image source={stylistNamePng} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          buttonColor={colors.black}
          labelStyle={styles.btnLabel}
          onPress={() => navigation.navigate('PhotosAccess')}
          style={styles.button}>
          Get Started
        </Button>
        <TouchableOpacity style={styles.backBTnCon}>
          <FontText color={colors.black} style={{fontWeight: '500'}}>
            Back
          </FontText>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <FontText size={12} color={colors.black}>
          Already have an account ?
        </FontText>
        <TouchableOpacity>
          <FontText
            size={12}
            color={colors.blue}
            textDecoration="underline"
            style={styles.signInBtn}>
            sign in here
          </FontText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    height: '50%',
  },
  images: {
    marginRight: wp(3),
    height: wp(48),
  },
  introContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },
  buttonContainer: {
    height: '20%',
    alignItems: 'center',
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
  backBTnCon: {
    marginTop: wp(10),
  },
  backBtn: {
    color: colors.black,
  },
  bottomContainer: {
    flexDirection: 'row',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 12,
  },
  signInBtn: {
    left: wp(0.1),
  },
});
