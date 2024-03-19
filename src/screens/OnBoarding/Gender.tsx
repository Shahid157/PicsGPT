/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/react-in-jsx-scope */
import {FontText} from '../../components';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors} from '../../assets';
import {hp, wp} from '../../constants';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';
import {Toast} from 'react-native-toast-notifications';
import Header from './Header';
import Checkbox from '../../components/Checkbox';
import {useEffect, useState} from 'react';

interface PhotosAccessProps {
  navigation?: any;
  route?: any;
}
export default function Gender({navigation, route}: PhotosAccessProps) {
  const [genderArray, setgenderArray] = useState([
    {
      type: 'Male',
      isSelected: false,
    },
    {
      type: 'Female',
      isSelected: false,
    },
    {
      type: 'Other',
      isSelected: false,
    },
    {
      type: 'Prefer not to say',
      isSelected: true,
    },
  ]);
  useEffect(() => {}, [genderArray]);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        skip={true}
        id={0}
        navigation={navigation}
        back={true}
        route={route}
      />
      <View style={styles.centerContainer}>
        <Image
          source={require('../../assets/images/gallery.png')}
          style={styles.galleryImage}
        />
        <FontText style={styles.genderText}>Set a Gender</FontText>
      </View>
      <View style={{top: hp(8)}}>
        {genderArray.map(item => {
          return (
            <TouchableOpacity style={styles.section}>
              <FontText style={styles.type}>{item.type}</FontText>
              <TouchableOpacity
                style={{
                  width: 25,
                  right: 10,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                  borderWidth: 2,
                  borderColor: colors.gray,
                }}
                onPress={() => {
                  genderArray.map(section => {
                    if (section.type === item.type) {
                      return (item.isSelected = !item.isSelected);
                    }
                  });
                  console.log('genderArray', genderArray);
                  setgenderArray([...genderArray]);
                }}>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 10,
                    backgroundColor: item.isSelected
                      ? colors.blue
                      : 'transparent',
                  }}></View>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          buttonColor={colors.black}
          labelStyle={styles.btnLabel}
          onPress={() => {
            let selectedGender = '';
            genderArray.map(item => {
              if (item.isSelected) {
                selectedGender = item.type;
              }
            });
            if (selectedGender) {
              navigation.navigate('Brands', {gender: selectedGender});
            } else {
              Alert.alert('Select Gender');
            }
          }}
          style={styles.button}>
          Continue
        </Button>
        <FontText style={styles.bottomText}>
          These help with our AI Earn a credit for each answer
        </FontText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(100),
    backgroundColor: colors.white,
  },
  bottomText: {color: colors.gray3, fontSize: 13, fontWeight: '600'},
  type: {fontWeight: '500', left: 10},
  section: {
    width: '90%',
    marginVertical: 3,
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    backgroundColor: colors.lightGray,
  },
  genderText: {fontSize: 18, fontWeight: '800', top: 15, color: 'black'},
  title: {
    fontWeight: '900',
  },
  titleContainer: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    top: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryImage: {
    height: wp(30),
    width: wp(30),
    backgroundColor: colors.gray1,
    borderRadius: wp(15),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
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
