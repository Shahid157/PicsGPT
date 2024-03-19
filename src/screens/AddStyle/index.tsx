import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import DataSource from '../../constants/data';
import {CommonHeader, FontText, GridList, SelectionTab} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import {SvgIcon, colors} from '../../assets';
import {supabase} from '../../supabase/supabase';
import globalStyles from '../../styles';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {addActions} from '../../store/actions';
import {DrawerStackProps} from '../../navigation/types';
import utils from '../../helpers/utils';
import {styles} from './style';

const {modelCategory, selectionData} = DataSource;

export default function AddStyle({
  navigation,
}: DrawerStackProps<'AddStyle'>) {
  const [selectionProcess, setSelectionProcess] = useState(selectionData);
  const [styleUrl, setStyleUrl] = useState<any>([]);
  const [selectedStyle, setSelectedStyle] = useState([] as any);
  const [userData, setUserData] = useState<string>('');
  const [filterData, setFilterData] = useState(['All', 'Fantasy']);
  const [loading, setLoading] = useState<boolean>();
  const [switchModal, setSwitchMOdal] = useState<boolean>();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const dispatch = useDispatch();
  const selectedData = useSelector(
    (state: any) => state.addReducer.jobCollection,
  );
  useEffect(() => {
    utils.startLoader();
    setLoading(true);
    getStyleDetails().then((results: any) => {
      setStyleUrl(results);
    });
    setLoading(false);
    utils.stopLoader();
  }, []);

  useEffect(() => {
    const newState = selectionProcess.map(obj => {
      if (obj.type === 'Model') {
        return {...obj, image: selectedData?.modelImages[0]};
      }
      if (obj.type === 'Style') {
        return {...obj, isSelected: true};
      }
      return obj;
    });
    setSelectionProcess(newState);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await AsyncStorage.getItem('userId').then((json?: any) => {
          setUserData(JSON.parse(json));
          return JSON.parse(json);
        });
      };
      fetchData();
    }, []),
  );

  useEffect(() => {
    if (selectedFilter === 'All') {
      getStyleDetails().then((results: any) => {
        setStyleUrl(results);
      });
    } else if (selectedFilter === 'My Styles') {
      getUserCollection().then((results: any) => {
        const filterData = results.filter(function (e?: any) {
          return e?.user_id === userData && e?.garment_id != null;
        });
        setStyleUrl(filterData);
      });
    } else if (selectedFilter === 'Fantasy') {
      getFantasyStyleDetails().then((results: any) => {
        setStyleUrl(results);
      });
    }
  }, [selectedFilter]);

  const getUserCollection = async () => {
    let {data: user_collection_details, error} = await supabase
      .from('user_collection_details')
      .select('*');
    return user_collection_details;
  };

  const getStyleDetails = async () => {
    let {data: Garments, error} = await supabase.from('Garments').select('*');
    return Garments;
  };

  const getFantasyStyleDetails = async () => {
    let {data: fantasy_garment, error} = await supabase
      .from('fantasy_garment')
      .select('*');
    return fantasy_garment;
  };

  const onStyleSelection = (list: any) => {
    setSelectedStyle(list);

    const newState = selectionProcess.map(obj => {
      if (obj.type === 'Style') {
        return {...obj, image: list?.length > 0 ? list[0]?.url?.trim() : ''};
      }
      return obj;
    });
    setSelectionProcess(newState);
    const styleCollection = list?.map((e: any) => {
      return {collection: e.collection, garment_id: e.garment_id};
    });
    dispatch(
      addActions.addStyleImages({
        images: list?.length > 0 ? styleCollection : '',
        previewImage: list?.length > 0 ? list[0]?.url?.trim() : '',
        type: list[0]?.type,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={globalStyles.bottomShadow}>
        <CommonHeader />
      </View>
      <View style={[globalStyles.rowJB, styles.categoryView]}>
        <View style={styles.tagsWrapper}>
          {filterData?.map((item?: any, index?: any) => {
            const isSelected = selectedFilter === item;
            return (
              <Pressable
                key={index}
                onPress={() => setSelectedFilter(item)}
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor: isSelected ? colors.black : 'transparent',
                    borderColor: isSelected ? colors.black : colors.gray200,
                  },
                ]}>
                <FontText
                  name={isSelected ? 'extraBold' : 'regular'}
                  size={normalize(11.5)}
                  color={isSelected ? colors.white : colors.gray900}
                  textAlign={'center'}>
                  {item}
                </FontText>
              </Pressable>
            );
          })}
        </View>
        <SvgIcon.Search style={{padding: wp(2.5)}} />
      </View>
      <View style={{flex: 1}}>
        {!loading && styleUrl?.length < 0 ? (
          <View style={globalStyles.flexCenter}>
            <FontText name={'medium'} size={normalize(15)}>
              {'No image found.'}
            </FontText>
          </View>
        ) : (
          styleUrl?.length > 0 && (
            <GridList
              data={styleUrl}
              listStyle={{marginHorizontal: wp(3)}}
              imageStyle={styles.imgStyle}
              isText
              isFantasyGarment={selectedFilter === 'Fantasy' ? true : false}
              btnTitle={'New Style'}
              btnSubTitle={'Upload 4+ Photos'}
              isAdd
              isMultiSelect
              onAddManualPress={() =>
                navigation
                  .getParent()
                  ?.navigate('GuideLines', {selectionType: 'Style'})
              }
              onSelectedStyles={(item?: any) => onStyleSelection(item)}
            />
          )
        )}
      </View>
      <SelectionTab
        isType="Style"
        navigation={navigation}
        selectionProcess={selectionProcess}
        modelCategory={modelCategory}
        isLocation
        onClosePress={() =>
          navigation.getParent()?.navigate('Home', {isPaymentDone: false})
        }
        onNextPress={() =>
          selectedStyle ? navigation.getParent()?.navigate('AddLocation') : {}
        }
      />
    </View>
  );
}
