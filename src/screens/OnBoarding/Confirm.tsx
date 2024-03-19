/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {FontText} from '../../components';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../assets';
import {hp, wp} from '../../constants';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';
import Header from './Header';
import {useEffect} from 'react';
import SvgIcon from '../../assets/SvgIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {postRequestApi} from '../../utils/AxiosHelper';
import {supabase} from '../../supabase/supabase';
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/actions';

interface PhotosAccessProps {
  navigation?: any;
  route?: any;
}
export default function Confirm({navigation, route}: PhotosAccessProps) {
  const {gender, brands, shirtsize, pantssize, jacketsize} = route?.params;
  const dummySizes = [
    {
      id: 0,
      size: 'X-Small',
    },
    {
      id: 1,
      size: 'Small',
    },
    {
      id: 2,
      size: 'Large',
    },
    {
      id: 3,
      size: 'Medium',
    },
    {
      id: 4,
      size: 'X-Large',
    },
    {
      id: 5,
      size: '2-XL',
    },
    {
      id: 6,
      size: '3-XL',
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('gender', gender);
    console.log('brands', brands);
    console.log('shirtsize', shirtsize);
    console.log('pantssize', pantssize);
    console.log('jacketsize', jacketsize);
  }, []);
  const postUpdateProfile = async () => {
    let userId = await AsyncStorage.getItem('userId');
    console.log(userId);

    // {"data":{"user_id":"25c5f01e-12a6-4bc6-b36f-f1d196eab87e","user_name":"@mework3407775","full_name":"mework340","gender":"Man","garment_sizes":[{"gender":"Man","sizes":[{"type":"Shirt","val":"Neck 15"},{"type":"Pants","val":"Waist 32"},{"type":"Jacket","val":"XLarge"},{"type":"Suits","val":"35L"}]}],"favourite_brands":[{"brand":"BALMAIN","brand_id":"390ac02a-70ff-4ff2-b9d1-a62caab22a4d"},{"brand":"BRIONI","brand_id":"a8892b6c-0229-44c6-bc1b-2164e1f555c3"}],"default":false},"user_id":"25c5f01e-12a6-4bc6-b36f-f1d196eab87e"}
    let newArray = [];
    brands.map(value => {
      let newobj = {};
      newobj.brand = value.brand;
      newobj.brand_id = value.brand_id;
      newArray.push(newobj);
    });
    let data = {
      user_id: userId,
      user_name: 'waseem',
      full_name: 'mework340',
      gender: 'Man',
      garment_sizes: [
        {
          gender: 'Man',
          sizes: [
            {type: 'Shirt', val: 'Neck 15'},
            {type: 'Pants', val: 'Waist 32'},
            {type: 'Jacket', val: 'XLarge'},
            {type: 'Suits', val: '35L'},
          ],
        },
      ],
      favourite_brands: [
        {brand: 'BALMAIN', brand_id: '390ac02a-70ff-4ff2-b9d1-a62caab22a4d'},
        {brand: 'BRIONI', brand_id: 'a8892b6c-0229-44c6-bc1b-2164e1f555c3'},
      ],
    };
    const response = await supabase
      .from('Users')
      .update(data)
      .eq('user_id', userId);

    console.log('CheckSupaResponse', response?.error);
    if (response.error === null) {
      navigation.navigate('MyDrawer' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        skip={true}
        id={5}
        navigation={navigation}
        back={true}
        route={route}
      />
      <FontText style={styles.fav}> Confirm</FontText>
      <View style={styles.size}>
        <FontText style={{fontWeight: '600', fontSize: 18}}>Gender</FontText>
        <FontText
          style={{fontWeight: '400', fontSize: 14, color: colors.lightBG}}>
          {gender}
        </FontText>
      </View>
      <View style={styles.brands}>
        <FontText style={{fontWeight: '600', fontSize: 18}}>
          Favorite Brands
        </FontText>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            justifyContent: 'space-around',
          }}>
          {brands.map(item => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(25),
                  right: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  backgroundColor: colors.blue,
                  borderRadius: 15,
                }}>
                <FontText style={{color: colors.white}}>{item.brand}</FontText>
                <SvgIcon.GrayClose />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.sizes}>
        <FontText style={{fontWeight: '600', fontSize: 18}}>Sizes</FontText>
        <View style={{flexDirection: 'row', top: 10}}>
          <FontText style={{fontWeight: '600', fontSize: 16}}>Shirts</FontText>
          <FontText
            style={{
              fontWeight: '400',
              left: 20,
              fontSize: 14,
              color: colors.lightBG,
            }}>
            {shirtsize.map(item => item.size) + ''}
          </FontText>
        </View>
        <View style={{flexDirection: 'row', top: 15}}>
          <FontText style={{fontWeight: '600', fontSize: 16}}>Pants</FontText>
          <FontText
            style={{
              fontWeight: '400',
              left: 20,
              fontSize: 14,
              color: colors.lightBG,
            }}>
            {pantssize.map(item => item.size) + ''}
          </FontText>
        </View>
        <View style={{flexDirection: 'row', top: 20}}>
          <FontText style={{fontWeight: '600', fontSize: 16}}>Jackets</FontText>
          <FontText
            style={{
              fontWeight: '400',
              left: 20,
              fontSize: 14,
              color: colors.lightBG,
            }}>
            {jacketsize.map(item => item.size) + ''}
          </FontText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonColor={colors.black}
          labelStyle={styles.btnLabel}
          onPress={() => {
            postUpdateProfile();
          }}
          style={styles.button}>
          Continue
        </Button>
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
  sizes: {
    top: 50,
    width: '90%',
    paddingLeft: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 30,
    backgroundColor: colors.lightGray2,
  },
  sizeText: {fontWeight: '700', fontSize: 20},
  brands: {
    top: 40,
    width: '90%',
    paddingLeft: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    backgroundColor: colors.lightGray2,
  },
  size: {
    top: 30,
    width: '90%',
    paddingLeft: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp(8),
    backgroundColor: colors.lightGray2,
  },
  fav: {
    fontSize: 25,
    paddingTop: 10,
    letterSpacing: 0.4,
    left: 10,
    fontWeight: '700',
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
