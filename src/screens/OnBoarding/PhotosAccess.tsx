/* eslint-disable react/react-in-jsx-scope */
import {FontText} from '../../components';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {colors} from '../../assets';
import {wp} from '../../constants';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';
import {showToast} from '../../components/CommonToast';
import strings from '../../assets/strings';

interface PhotosAccessProps {
  navigation?: any;
  route?: any;
}

export default function PhotosAccess({navigation, route}: PhotosAccessProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <FontText size={19} color={colors.black} style={styles.title}>
          STYLEY
        </FontText>
      </View>
      <View style={styles.centerContainer}>
        <Image
          source={require('../../assets/images/gallery.png')}
          style={styles.galleryImage}
        />
        <FontText color={colors.gray}>{strings.access_photo}</FontText>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          buttonColor={colors.black}
          labelStyle={styles.btnLabel}
          onPress={async () => {
            navigation.navigate('PhoneAccess');
            showToast('Permission Grandted !', 'top', 'success');
          }}
          style={styles.button}>
          {strings.access}
        </Button>
      </View>
    </SafeAreaView>
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
    justifyContent: 'center',
  },
  galleryImage: {
    top: wp(-10),
    height: wp(30),
    width: wp(30),
    backgroundColor: colors.gray1,
    borderRadius: wp(15),
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
