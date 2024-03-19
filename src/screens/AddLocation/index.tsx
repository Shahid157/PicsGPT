import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonHeader, FontText, SelectionTab} from '../../components';
import DataSource from '../../constants/data';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import globalStyles from '../../styles';
import {ToggleButton} from 'react-native-paper';
import TabBar from './TabBar';
import {supabase} from '../../supabase/supabase';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addActions} from '../../store/actions';
import {DrawerStackProps, TabScreenProps} from '../../navigation/types';
import utils from '../../helpers/utils';

const {locationData, modelCategory, selectionData} = DataSource;
interface AddLocationProps {
  navigation?: any;
  route?: any;
}
interface ListItem {
  id: string;
  img_url: string;
  title: string;
}

export default function AddLocation({
  navigation,
  route,
}: DrawerStackProps<'AddLocation'> | TabScreenProps<'AddLocation'>) {
  const [loading, setLoading] = useState(false);
  const [selectionProcess, setSelectionProcess] = useState(selectionData);
  const [selectedLoc, setSelectedLoc] = useState(0);
  const [index, setIndex] = React.useState(0);
  const [customLoc, setCustomLoc] = React.useState('');
  const [locationUrl, setLocationUrl] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({} as any);
  const dispatch = useDispatch();
  const selectedModel = useSelector(
    (state: any) => state.addReducer.jobCollection,
  );

  useEffect(() => {
    utils.startLoader();
    setLoading(true);
    getStyleDetails().then((results: any) => {
      setLocationUrl(results);
    });
    setLoading(false);
    utils.stopLoader();
  }, []);

  useEffect(() => {
    const newState = selectionProcess.map((obj: any) => {
      if (obj.type === 'Model') {
        return {...obj, image: selectedModel?.modelImages[0]};
      }
      if (obj.type === 'Style') {
        return {...obj, image: selectedModel?.[0]};
      }
      if (obj.type === 'Location') {
        return {...obj, isSelected: true};
      }
      return obj;
    });
    setSelectionProcess(newState);
  }, []);

  const getStyleDetails = async () => {
    let {data: Prompts, error} = await supabase.from('Prompts').select('*');
    return Prompts;
  };

  const onLocationPress = (id?: any, image?: any) => {
    setSelectedLoc(id);
    setSelectedLocation(image);
    const newState = selectionProcess.map((obj: any) => {
      if (obj.type === 'Location') {
        return {...obj, isSelected: true, image: image?.img_url?.trim()};
      }
      return obj;
    });
    setSelectionProcess(newState);
    dispatch(
      addActions.addLocation({
        images: image?.img_url?.trim(),
        type: image?.prompt?.trim(),
        prompt_type: image?.title,
      }),
    );
  };

  const onNextPress = async () => {
    if (customLoc) {
      await dispatch(
        addActions.addLocation({
          images: '',
          type: customLoc,
          prompt_type: 1,
        }),
      );
    } else {
      await dispatch(
        addActions.addLocation({
          images: selectedLocation?.img_url?.trim(),
          type: selectedLocation?.prompt?.trim(),
          prompt_type: selectedLocation?.id,
        }),
      );
    }

    navigation.getParent()?.navigate('Payment', {
      isPhotoAIScreen: false,
    });
  };

  const {bottom} = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={globalStyles.bottomShadow}>
        <CommonHeader />
      </View>
      <View style={{flex: 5}}>
        <FlatList
          style={[{marginVertical: wp(2)}]}
          contentContainerStyle={[{paddingBottom: wp(2), alignSelf: 'center'}]}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          data={locationUrl}
          keyExtractor={({id}) => id}
          renderItem={({item}: {item: ListItem}) => {
            return (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() =>
                    onLocationPress(item?.id, item?.img_url?.trim())
                  }
                  style={[styles.GridViewContainer]}>
                  <Image
                    source={{uri: item?.img_url?.trim()}}
                    style={[
                      styles.locImg,
                      {
                        borderWidth:
                          item?.id === selectedLoc.toString() ? 2 : 0,
                        borderColor: colors.blue,
                      },
                    ]}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <FontText
                  name={'bold'}
                  lines={1}
                  textAlign={'center'}
                  size={normalize(14)}
                  color={colors.gray500}
                  pBottom={wp(2)}
                  style={{width: wp(28)}}>
                  {item?.title}
                </FontText>
              </View>
            );
          }}
        />
      </View>
      <TabBar
        activeIndex={index}
        data={[{title: 'Standard'}, {title: 'Custom'}]}
        onTabChange={(i?: any) => setIndex(i)}
      />
      {index === 1 ? (
        <View key={index.toString()} style={{marginBottom: wp(10)}}>
          <TextInput
            value={customLoc}
            onChangeText={setCustomLoc}
            placeholderTextColor={'#737373'}
            placeholder="Default Input. Maximum height of container to occupy only 5 lines of input texts. Provide a scroll post 5 lines."
            style={styles.inputStyle}
            multiline
          />
        </View>
      ) : null}
      <SelectionTab
        isType="Location"
        navigation={navigation}
        selectionProcess={selectionProcess}
        modelCategory={modelCategory}
        onClosePress={() =>
          navigation.getParent()?.navigate('Home', {isPaymentDone: false})
        }
        onNextPress={onNextPress}
        isLocation
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  locImg: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(1),
  },
  inputStyle: {
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    marginHorizontal: wp(4),
    borderRadius: wp(2),
    height: wp(38),
    paddingHorizontal: wp(3),
    paddingTop: wp(2.5),
    fontSize: normalize(16),
    lineHeight: wp(6),
  },
});
