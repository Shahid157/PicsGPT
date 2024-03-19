/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {FontText} from '../../components';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../assets';
import {hp, wp} from '../../constants';
import {Button} from 'react-native-paper';
import {borderRadius} from '../../constants/appConstants';
import Header from './Header';
import {useEffect, useState} from 'react';
import SvgIcon from '../../assets/SvgIcon';
import Input from '../../components/Input';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';

interface PhotosAccessProps {
  navigation?: any;
  route?: any;
}
export default function PantsSize({navigation, route}: PhotosAccessProps) {
  const dispath = useDispatch();
  const {garmentSizes} = useSelector(state => state.fashion);
  const [selectedSize, setselectedSize] = useState([]);
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
  useEffect(() => {
    console.log('garmentSizes', garmentSizes);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        skip={true}
        navigation={navigation}
        id={3}
        back={true}
        route={route}
      />
      <FontText style={styles.fav}> Pants size ?</FontText>
      <View style={styles.size}>
        <FontText style={{fontWeight: '600', fontSize: 18}}>Pants</FontText>
      </View>
      <View
        style={{
          alignSelf: 'center',
          top: 50,
          paddingBottom: hp(24),
        }}>
        <FlatList
          data={dummySizes}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={item => {
            return (
              <TouchableOpacity
                style={{
                  width: wp(100) / 2.2,
                  height: hp(12),
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 4,
                  backgroundColor: selectedSize.some(
                    (selectedItem: any) => selectedItem?.id === item?.item?.id,
                  )
                    ? colors.blue
                    : colors.lightGray2,
                }}
                onPress={() => {
                  dummySizes.map(innerItem => {
                    if (innerItem?.id === item?.item?.id) {
                      if (selectedSize.length === 0) {
                        setselectedSize([...selectedSize, item?.item]);
                      } else {
                        setselectedSize([...selectedSize, item?.item]);
                      }
                    }
                  });
                }}>
                <FontText
                  style={[
                    styles.sizeText,
                    {
                      color: selectedSize.some(
                        (selectedItem: any) =>
                          selectedItem?.id === item?.item?.id,
                      )
                        ? colors.white
                        : colors.black,
                    },
                  ]}>
                  {item?.item?.size}
                </FontText>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonColor={colors.black}
          labelStyle={styles.btnLabel}
          onPress={() => {
            let unique1 = selectedSize.reduce(function (acc, curr) {
              if (!acc.includes(curr)) acc.push(curr);
              return acc;
            }, []);
            if (unique1.length > 0) {
              navigation.navigate('JacketSize', {
                gender: route.params.gender,
                brands: route.params.brands,
                shirtsize: route.params.shirtsize,
                pantssize: unique1,
              });
            } else {
              Alert.alert('Select size');
            }
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
  sizeText: {fontWeight: '700', fontSize: 20},

  size: {
    top: 30,
    width: '90%',
    paddingLeft: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp(5),
    backgroundColor: colors.lightGray2,
  },
  fav: {fontSize: 20, letterSpacing: 0.4, left: 10, top: 10, fontWeight: '700'},
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
