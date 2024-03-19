import {
  Pressable,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../../assets';
import {CommonHeader, FontText, PhotoSelectionGridList} from '../../components';
import EmptyGrid from '../../components/EmptyGrid';
import {normalize, wp} from '../../styles/responsiveScreen';
import {Modalize} from 'react-native-modalize';
import globalStyles from '../../styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {creationFilters} from '../../constants/photoAIConstants';
import {setModel} from '../../store/reducers/modelSelectSlice';
import {rawData} from '../../constants/photoAIConstants';
import fetchUserModelsCollection from '../../api/fashion/fetch-custom-modals';
import {user_collections_api} from '../../store/actions/fashion.action';
import {showToast} from '../../components/CommonToast';

interface AddProps {
  validateUser: () => boolean;
}

export default function AddModel({}: AddProps) {
  const [filterModel, setFilterModel] = useState([]);
  const [customModal, setCustomModal] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(creationFilters[0]);
  const bottomSheetRef = useRef<Modalize>(null);
  const {userId} = useSelector((state: {auth: any}) => state.auth);
  const {isPremium} = useSelector((state: {auth: any}) => state.auth);
  const userPaymentData = useSelector((state: {auth: any}) => state.payments);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector(
    (state: any) => state.uploadImagesReducer.userUploadedImages,
  );

  const stockModelsData = useSelector(
    (state: any) => state.stockModelsData?.stockModelsData,
  );

  const celebsData = useSelector((state: any) => state.celebsData?.celebsData);

  useEffect(() => {
    if (selectedFilter === creationFilters[0]) {
      setFilterModel(user);
    }
    if (selectedFilter === creationFilters[1]) {
      setFilterModel(stockModelsData);
    }
    if (selectedFilter === creationFilters[2]) {
      setFilterModel(celebsData);
    }
  }, [selectedFilter, user]);

  const newModelHandler = async () => {
    if (!userId) {
      bottomSheetRef?.current?.open();
    } else {
      navigation?.navigate('GuideLines', {selectionType: 'Model'});
    }
  };

  useEffect(() => {
    fetchCustomModal(userId);
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCustomModal(userId);
    });
    return unsubscribe;
  }, [navigation]);

  const fetchCustomModal = async (user_id: string) => {
    const res = await fetchUserModelsCollection(user_id);
    if (res.length < 1) {
      const apiRes = await user_collections_api(user_id);
      if (apiRes.data) {
        setCustomModal(apiRes.data);
      }
    } else {
      setCustomModal(res);
    }
  };

  const onImageSelection = (item: any) => {
    dispatch(setModel(item));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: wp(-12)}}>
        <CommonHeader />
      </View>
      <View style={[globalStyles.rowJB, styles.categoryView]}>
        <View style={styles.tagsWrapper}>
          {creationFilters?.map((item?: any, index?: any) => {
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
      </View>

      {filterModel?.length > 0 ? (
        <PhotoSelectionGridList
          onImagePress={onImageSelection}
          isMultiSelect={isPremium}
          isSelect={!isPremium}
          isAdd
          imageStyle={styles.imgStyle}
          data={filterModel}
          btnTitle={'New Model'}
          btnSubTitle={'(4+ images)'}
          onAddManualPress={newModelHandler}
          myModels={selectedFilter === 'My Models' ? true : false}
        />
      ) : selectedFilter !== creationFilters[0] ? (
        <FlatList
          data={rawData}
          numColumns={2}
          keyExtractor={item => item.toString()}
          renderItem={() => <View style={styles.imagesStyle} />}
        />
      ) : null}

      {customModal.length < 1 && selectedFilter === 'My Models' && (
        <View style={globalStyles.flexCenter}>
          <EmptyGrid newModelHandler={newModelHandler} />
        </View>
      )}

      {customModal.length >= 1 && selectedFilter === 'My Models' && (
        <PhotoSelectionGridList
          data={customModal}
          imageStyle={styles.imgStyle}
          isAdd
          isSelect
          onImagePress={onImageSelection}
          btnTitle={'New Model'}
          btnSubTitle={'(4+ images)'}
          onAddManualPress={() => {
            if (customModal?.length < userPaymentData?.model_limit) {
              newModelHandler();
            } else {
              showToast(
                'You reached your model upload limit, Purchase more for upload',
                'top',
                'error',
              );
            }
          }}
          myModels={selectedFilter === 'My Models' ? true : false}
          isText={true}
        />
      )}
    </SafeAreaView>
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
    width: wp(48.5),
    height: wp(45),
    left: wp(-0.5),
    marginBottom: wp(-0.8),
  },
  categoryView: {
    marginHorizontal: wp(4),
    paddingTop: wp(1.5),
  },
  categoryBox: {
    backgroundColor: colors.black,
    marginRight: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(0),
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
    width: wp(47),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
    backgroundColor: '#f6f7f9',
    marginLeft: 5,
    marginTop: 5,
  },
});
