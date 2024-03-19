/* eslint-disable react-native/no-inline-styles */
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
import Header from './Header';
import {useEffect, useState} from 'react';
import SvgIcon from '../../assets/SvgIcon';
import Input from '../../components/Input';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBrands} from '../../store/actions/fashion.action';
import {FlatList} from 'react-native-gesture-handler';
import {SvgUri} from 'react-native-svg';
import {filter} from 'lodash';

interface PhotosAccessProps {
  navigation?: any;
  route?: any;
}
export default function Brands({navigation, route}: PhotosAccessProps) {
  const dispath = useDispatch();
  const {popularBrands} = useSelector(state => state.fashion);
  const [allbrands, setallbrands] = useState(popularBrands);
  const [selectedBrand, setSelectedBrand] = useState([]);
  useEffect(() => {
    dispath(fetchBrands());
    console.log('CheckBrands', popularBrands);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        skip={true}
        id={1}
        navigation={navigation}
        back={true}
        route={route}
      />
      <FontText style={styles.fav}> Favourite Brands ?</FontText>
      <View style={styles.search}>
        <Input
          leftIcon={<SvgIcon.Search />}
          inputContainer={styles.input}
          placeholder="Search"
          onSubmit={text => {
            console.log('onsubmitText', text);
          }}
        />
      </View>
      <View
        style={{
          alignSelf: 'center',
          top: 50,
          paddingBottom: hp(24),
        }}>
        <FlatList
          data={allbrands}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.toString()}
          renderItem={item => {
            return (
              <TouchableOpacity
                style={{
                  width: wp(100) / 3.3,
                  height: hp(12),
                  margin: 4,
                  backgroundColor: selectedBrand.some(
                    (selectedItem: any) =>
                      selectedItem?.media_url === item?.item?.media_url,
                  )
                    ? colors.blue
                    : colors.lightGray2,
                }}
                onPress={() => {
                  popularBrands.map(innerItem => {
                    if (innerItem?.media_url === item?.item?.media_url) {
                      if (selectedBrand.length === 0) {
                        setSelectedBrand([...selectedBrand, item?.item]);
                      } else {
                        setSelectedBrand([...selectedBrand, item?.item]);
                      }
                    }
                  });
                }}>
                <SvgUri
                  width="100%"
                  height="100%"
                  color={
                    item.index === selectedBrand ? colors.white : colors.black
                  }
                  uri={item?.item?.media_url}
                />
                <Image
                  source={{uri: item?.item?.media_url}}
                  style={{width: '100%', height: '100%', zIndex: 1000}}
                />
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
            let unique = selectedBrand.reduce(function (acc, curr) {
              if (!acc.includes(curr)) acc.push(curr);
              return acc;
            }, []);
            console.log('Check array unique', unique);
            if (unique.length > 0) {
              navigation.navigate('ShirtSize', {
                gender: route.params.gender,
                brands: unique,
              });
            } else {
              Alert.alert('Select any brand');
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
  input: {
    width: wp(95),
    backgroundColor: colors.lightGray,
    alignSelf: 'center',
  },
  search: {top: 30},
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
