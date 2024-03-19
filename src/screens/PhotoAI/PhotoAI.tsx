import {StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PhotoSelectionTab from '../../components/PhotoSelectionTab';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {creationTabs} from '../../constants/photoAIConstants';
import {creationTab} from './interfaces';
import AddPhotoAIStyle from '../AddPhotoAIStyle';
import AddPhotoAIModel from '../AddPhotoAIModel';
import {CommonHeader, LogInBottomSheet} from '../../components';
import {Modalize} from 'react-native-modalize';
import {wp} from '../../constants';
import {colors} from '../../assets';
import PagerView from 'react-native-pager-view';
import {resetModel, setModel} from '../../store/reducers/modelSelectSlice';
import {
  addSelectedImages,
  resetSelectedImages,
} from '../../store/reducers/multiSelectSlice';
import handleUserSelection from '../../api/fashion/user-selection';
import PaymentModal from '../Payment';
import MultipleOptionsPopup from '../../components/MultipleOptionsPopup/multipleOptionsPopup';
import {EmptyModel} from '../../store/reducers/multipleModelSelectedSlice';

export default function PhotoAI({route}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<Modalize>(null);
  const pagerViewRef = useRef<PagerView>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTab, setselectedTab] = useState<creationTab>(
    creationTabs[route?.params?.id != undefined ? route?.params?.id : 0],
  );
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [creation, setCreation] = useState([]);
  const {modelSelected} = useSelector((state: any) => state.modelSelected);
  const {selectedImages} = useSelector((state: any) => state.selectedImages);
  const {multipleModelSelected} = useSelector(
    state => state.multipleModelSelectedSlice,
  );

  const {userId} = useSelector((state: any) => state.auth);

  useEffect(() => {
    validateUser();
    userId && getUserSelection();
  }, [userId]);

  useEffect(() => {
    if (route?.params?.data) {
      const creationTabs = [
        {
          id: 1,
          image: route?.params?.id === 0 ? route?.params?.data?.img_url : '',
          type: 'Style',
          isSelected: false,
        },
        {
          id: 2,
          image: route?.params?.id === 1 ? route?.params?.data['3d-url'] : '',
          type: 'Model',
          isSelected: false,
        },
      ];

      setCreation(creationTabs);
      isNextDisabled();
    }
  }, [route?.params?.data]);

  const validateUser = () => {
    if (!userId) {
      bottomSheetRef.current?.open();
      return false;
    } else {
      return true;
    }
  };

  //if userId doesn't exist will open the LoginSheet
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!userId) {
        bottomSheetRef.current?.open();
      }
    });
    return unsubscribe;
  }, [navigation, userId]);

  const getUserSelection = async () => {
    let data: any = await handleUserSelection(userId);
    if (data?.length) {
      let selectedData = data[0];
      selectedData?.selected_model?.length &&
        dispatch(setModel(selectedData?.selected_model[0]));
      selectedData?.selected_styles?.length &&
        dispatch(addSelectedImages(selectedData.selected_styles));
    }
  };

  useEffect(() => {
    if (selectedTab.id === 1) {
      pagerViewRef.current?.setPage(0);
    } else if (selectedTab.id === 2) {
      pagerViewRef.current?.setPage(1);
    }
  }, [selectedTab]);

  const handleClosePress = async () => {
    if (selectedTab.id === 2) {
      onTabChange(creationTabs[0]);
    } else {
      if (selectedImages.length) {
        setShowConfirmationPopUp(true);
      } else {
        exit();
      }
    }
  };

  const handleNextPress = async () => {
    if (selectedTab.id === 1) {
      onTabChange(creationTabs[1]);
      return;
    }
    if (isNextDisabled()) return;
    saveUserSelectedData();
    setShowModal(true);
  };

  const onTabChange = (tab: creationTab) => {
    if (!userId) {
      bottomSheetRef.current?.open();
      return false;
    }
    setselectedTab(tab);
    saveUserSelectedData();
  };

  const saveUserSelectedData = async () => {
    try {
      if (!selectedImages?.length) return;
      let selectedStylesIDs: string[] = [];
      selectedImages?.forEach((selectedStyle: any) => {
        selectedStylesIDs.push(selectedStyle.style_id);
      });
      await handleUserSelection(
        userId,
        'update',
        selectedImages,
        modelSelected,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isNextDisabled = () => {
    if (selectedTab.id === 1) {
      return !selectedImages?.length;
    } else if (selectedTab.id === 2) {
      return !multipleModelSelected?.length || !selectedImages?.length;
    } else {
      return false;
    }
  };

  const handleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const exit = () => {
    if (selectedTab.id === 1) {
      navigation.navigate('Home' as never);
    } else {
      onTabChange(creationTabs[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <PagerView
          ref={pagerViewRef}
          style={styles.pagerView}
          initialPage={0}
          scrollEnabled={false}>
          <AddPhotoAIStyle key={1} validateUser={validateUser} />
          <AddPhotoAIModel key={2} validateUser={validateUser} />
        </PagerView>
      </View>
      {selectedImages?.length ? (
        <PhotoSelectionTab
          onTabChange={onTabChange}
          selectionProcess={creation.length > 0 ? creation : creationTabs}
          onClosePress={handleClosePress}
          onNextPress={handleNextPress}
          isType={selectedTab.type}
          disableNext={isNextDisabled()}
        />
      ) : null}
      <LogInBottomSheet modalizeRef={bottomSheetRef} />
      <PaymentModal
        onClosePress={() => setShowModal(false)}
        navigation={navigation}
        showModal={showModal}
        isPhotoAIScreen={true}
        setShowModal={setShowModal}
      />

      <MultipleOptionsPopup
        isVisible={showConfirmationPopUp}
        description="Do you want to clear your drafts for selected styles"
        onOkPress={() => {
          setShowConfirmationPopUp(!showConfirmationPopUp);
        }}
        onCancelPress={() => {
          dispatch(resetSelectedImages());
          dispatch(EmptyModel());
          setShowConfirmationPopUp(!showConfirmationPopUp);
          exit();
        }}
        pressOut={() => {
          setShowConfirmationPopUp(!showConfirmationPopUp);
        }}
        title={''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  topContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(2),
  },
  pagerView: {
    flex: 1,
  },
});
