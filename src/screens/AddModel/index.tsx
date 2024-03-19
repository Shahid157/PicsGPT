import {Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SvgIcon, colors} from '../../assets';
import {
  CommonHeader,
  FontText,
  GridList,
  LogInBottomSheet,
  SelectionTab,
} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import DataSource from '../../constants/data';
import {supabase} from '../../supabase/supabase';
import {Modalize} from 'react-native-modalize';
import globalStyles from '../../styles';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import utils from '../../helpers/utils';
import {addActions} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {TabScreenProps} from '../../navigation/types';
import {FlatList} from 'react-native-gesture-handler';
import {rawData} from '../../constants/photoAIConstants';

const {modelCategory, selectionData} = DataSource;

export default function AddModel({navigation}: TabScreenProps<'AddModel'>) {
  const [selectionProcess, setSelectionProcess] = useState(selectionData);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelUrl, setModelUrl] = useState<any>([]);
  const [filterModel, setFilterModel] = useState<any>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [filterData, setFilterData] = useState<string[]>([
    'All',
    'Male',
    'Female',
  ]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [userData, setUserData] = useState('');
  const bottomSheetRef = useRef<Modalize>(null);
  const userId = useSelector((state: {auth: any}) => state.auth.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      utils.startLoader();
      setLoading(true);
      await getModelDetails().then((results: any) => {
        setModelUrl(results);
        const filterData = results.filter(function (e?: any) {
          return e?.First;
        });
        setFilterModel(filterData);
      });
      setLoading(false);
      utils.stopLoader();
      const newState = selectionProcess.map(obj => {
        if (obj.type === 'Model') {
          return {...obj, isSelected: true, image: ''};
        }
        return obj;
      });
      setSelectedModel('');
      setSelectionProcess(newState);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterData = modelUrl.filter(function (e?: any) {
      if (selectedFilter === 'All') {
        return e?.First;
      }
      return e?.First === selectedFilter;
    });
    setFilterModel(filterData);
  }, [selectedFilter]);

  const newModelHandler = async () => {
    if (!userId) {
      bottomSheetRef.current?.open();
    } else {
      navigation.getParent()?.navigate('GuideLines', {selectionType: 'Model'});
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (!userId) {
          bottomSheetRef.current?.open();
        }
        await AsyncStorage.getItem('userId').then((json?: any) => {
          setUserData(JSON.parse(json));
          return JSON.parse(json);
        });
      };
      fetchData();
    }, []),
  );

  const getModelDetails = async () => {
    let {data: FreeModels, error} = await supabase
      .from('FreeModels')
      .select('*');
    return FreeModels;
  };

  const onImageSelection = async (img: any) => {
    if (!userId) {
      bottomSheetRef.current?.open();
    } else {
      setSelectedModel(img?.url?.trim());
      const newState = selectionProcess.map(obj => {
        if (obj.type === 'Model') {
          return {...obj, image: img.url?.trim()};
        }
        return obj;
      });
      dispatch(
        addActions.addModelImages({
          images: img?.collection,
          previewImage: img?.url?.trim(),
          type: img?.gender,
          person_id: img?.person_id,
        }),
      );
      setSelectionProcess(newState);
    }
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
        {loading && filterModel?.length < 0 && (
          <FlatList
            data={rawData}
            numColumns={2}
            keyExtractor={item => item.toString()}
            renderItem={() => <View style={styles.imagesStyle} />}
          />
        )}

        {filterModel?.length > 0 && (
          <GridList
            data={filterModel}
            filter={selectedFilter}
            listStyle={{marginHorizontal: wp(3)}}
            imageStyle={styles.imgStyle}
            isSelect
            isAdd
            onImagePress={(img: any) => onImageSelection(img)}
            btnTitle={'New Model'}
            btnSubTitle={'Upload 4+ Photos'}
            onAddManualPress={newModelHandler}
          />
        )}
      </View>
      <SelectionTab
        isType="Model"
        navigation={navigation}
        selectionProcess={selectionProcess}
        modelCategory={modelCategory}
        isLocation={selectedModel !== ''}
        onClosePress={() =>
          navigation.getParent()?.navigate('Home', {isPaymentDone: false})
        }
        onNextPress={() => navigation.getParent()?.navigate('AddStyle')}
      />
      <LogInBottomSheet modalizeRef={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  btnStyle: {
    marginHorizontal: wp(5),
    paddingVertical: wp(1),
    backgroundColor: colors.black,
    borderRadius: wp(3),
    marginBottom: wp(3),
  },
  imgStyle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
  },
  categoryView: {
    marginHorizontal: wp(4),
    paddingTop: wp(1.5),
    // paddingBottom: wp(1),
  },
  categoryBox: {
    backgroundColor: colors.black,
    marginRight: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(5),
    borderWidth: 2,
    marginTop: wp(2),
  },
  tagsWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  imagesStyle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
    backgroundColor: '#f6f7f9',
    marginLeft: 10,
    marginTop: 5,
  },
  mainStyles: {
    marginTop: 10,
    marginHorizontal: 5,
    flex: 1,
  },
});
