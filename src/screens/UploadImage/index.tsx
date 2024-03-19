import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SvgIcon, colors, fonts} from '../../assets';
import globalStyles from '../../styles';
import {BottomSheet, FontText, Input} from '../../components';
import {isX, normalize, wp} from '../../styles/responsiveScreen';
import TitleSubTitle from '../GuideLines/TitleSubTitle';
import {FlatList} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {Modalize} from 'react-native-modalize';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {addActions} from '../../store/actions';
import {DrawerStackProps} from '../../navigation/types';
import DataSource from '../../constants/data';
import {hp} from '../../styles/responsiveScreen';
import {uploadImageAction} from '../../store/actions';
import UserSelectedImage from '../../store/actions/UserSelectedImage';
import * as Progress from 'react-native-progress';
import {
  gpuCollectionAPI,
  uploadImageHandler,
} from '../../store/actions/fashion.action';
import {borderRadius} from '../../constants/appConstants';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import supabaseTables from '../../constants/supabaseTables';
import insertCustomModals from '../../api/fashion/insert-custom-modals';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {uploadImage} from '../../api/uploadApi';
import {user_uuid} from '../../store/hooks';

const genderData = [
  {label: 'Man', value: '1'},
  {label: 'Woman', value: '2'},
  {label: 'Other', value: '3'},
];

export default function UploadImage({
  route,
  navigation,
}: DrawerStackProps<'UploadImage'>) {
  const {imageList, selectionType} = route?.params;
  const [value, setValue] = useState(null || '');
  const [imageUrl, setImageUrl] = useState([]);
  const [genderError, setGenderError] = useState<boolean>(false);
  const [gender, setGender] = useState(null || '');
  const [sType, setSType] = useState(null || '');
  const [isFocus, setIsFocus] = useState(false);
  const [mName, setMName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [progressMap, setProgressMap] = useState<{[key: string]: number}>({});
  const [showRetry, setShowRetry] = useState(false);
  const [isInComplete, setIsInComplete] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');

  const popUp = React.useRef<Modalize>(null);
  const dispatch = useDispatch();
  const uploadedData = useSelector(
    (state: any) => state.userSelectedImagesReducer.userSelectedImages,
  );
  const selectedData = useSelector(
    (state: any) => state.userSelectedImagesReducer.userSelectedImages,
  );
  const {userId} = useSelector((state: any) => state.auth);
  const paymentId = useSelector((state: {payments: any}) => state.payments.id);
  const {session_id} = useSelector((state: {payments: any}) => state.payments);

  const {styleType} = DataSource;
  const renderLabel = (text: string) => {
    return (
      <FontText size={normalize(16)} name={'bold'} pBottom={wp(4)}>
        {text}
      </FontText>
    );
  };
  const onContinuePress = () => {
    popUp?.current?.open();

    setValue('');
  };
  const cancelPress = () => {
    dispatch(UserSelectedImage.clearImagesState(mName));
    navigation.goBack();
    navigation.goBack();
  };

  useEffect(() => {
    handelUpload();
  }, [uploadedData]);

  const onPopUpContinueBtn = async () => {
    if (gender === '' || null) {
      setGenderError(true);
      return;
    }
    if (mName === '') {
      setNameError(true);
      return;
    }

    if (gender || sType) {
      const resp = await gpuCollectionAPI(
        session_id,
        paymentId,
        gender,
        imageUrl,
        mName,
        userId,
      );
      //**/need proper error handling here for supabase and for the gpuCollectionAPI/**//
      const {data: alreadyExist} = await supabaseDynamic(
        supabaseUrl,
        supabaseKey,
      )
        .from(supabaseTables.userCollectionDetails)
        .select('*')
        .or(`person_id.eq.${resp?.id || user_uuid}`)
        .eq('user_id', userId)
        .maybeSingle();

      if (!alreadyExist) {
        const insertData = await insertCustomModals(
          userId,
          mName,
          imageUrl,
          gender,
          resp.id || user_uuid,
        );
        if (!insertData?.data) {
          popUp?.current?.close();
          Alert.alert('Warning!', 'Something went wrong', [
            {text: 'OK', onPress: () => cancelPress()},
          ]);
          return;
        }
      }
      popUp?.current?.close();
      const list = uploadedData?.map((e: any) => e?.media?.url?.trim());
      dispatch(UserSelectedImage.clearImagesState(mName));
      if (selectionType === 'Model') {
        dispatch(
          addActions.addModelImages({
            images: list,
            previewImage: list[0],
            type: gender,
            person_id: list[0]?.id,
          }),
        );
        navigation.goBack();
        navigation.goBack();
      } else if (selectionType === 'Style') {
        dispatch(
          addActions.addStyleImages({
            mages: list,
            previewImage: list[0],
            type: sType,
            garment_id: list[0]?.id,
          }),
        );
        navigation.goBack();
        navigation.goBack();
      }
    }
  };

  const handelUpload = async () => {
    let urlArray = [];
    try {
      for (const item of selectedData) {
        if (progressMap[item.fileName] === 100) {
          continue;
        }
        try {
          const res = await uploadImageHandler(item, progress => {
            setProgressMap(prevProgressMap => ({
              ...prevProgressMap,
              [item.fileName]: progress,
            }));
          });
          setUploadStatus(res);
          urlArray.push(res);
          if (res === 'Network error') {
            setShowRetry(true);
          }
          setShowRetry(false);
        } catch (uploadError) {
          console.error(`Error uploading ${item.fileName}:`, uploadError);
          setProgressMap(prevProgressMap => ({
            ...prevProgressMap,
            [item.fileName]: 0,
          }));
          continue;
        }
      }
      setIsInComplete(false);
      const hasIncompleteProgress = Object.values(progressMap).some(
        progress => progress !== 100,
      );
      if (hasIncompleteProgress) {
        setShowRetry(hasIncompleteProgress);
      }
      setImageUrl(urlArray);
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };
  const lunchLibrary = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10,
      },
      (result: ImagePickerResponse) => {
        if (result?.assets?.length) {
          const selectedImages = result?.assets;
          selectedImages.forEach(image => {
            dispatch(UserSelectedImage.setUploadImage(image));
          });
          uploadImage(selectedImages);
          navigation.navigate('UploadImage', {
            imageList: result?.assets,
            selectionType: selectionType,
          });
        }
      },
    );
  };
  const handleRetry = async item => {
    try {
      if (progressMap[item.fileName] !== 100) {
        setProgressMap(prevProgressMap => ({
          ...prevProgressMap,
          [item.fileName]: 0,
        }));

        const res = await uploadImageHandler(item, progress => {
          setProgressMap(prevProgressMap => ({
            ...prevProgressMap,
            [item.fileName]: progress,
          }));
        });

        setUploadStatus(res);

        if (res === 'Network error') {
          setShowRetry(true);
        }

        setShowRetry(false);

        const hasIncompleteProgress = Object.values(progressMap).some(
          progress => progress !== 100,
        );

        if (hasIncompleteProgress) {
          setShowRetry(true);
        }
      }
    } catch (error) {
      console.error(`Error during retry for ${item.fileName}:`, error);
    }
  };

  const handleDelete = (name: any) => {
    dispatch(UserSelectedImage.setDeleteImage(name));
    dispatch(uploadImageAction.setDeleteImage(name));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <TitleSubTitle
          showCrossButton={true}
          title={'Uploads processing'}
          subTitle={
            selectedData?.length <= 3
              ? 'Please upload minimum 4 pictures'
              : 'Your selected media is being scanned and analyzed to help ensure quality results'
          }
          onClosePress={async () => {
            cancelPress();
          }}
        />
        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={uploadedData}
            style={styles.flatlistStyle}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(value?: any) => {
              const fileName = value?.item?.fileName || '';
              const itemProgress = progressMap[fileName] || 0;
              const isUploadFailed =
                itemProgress !== 100 && uploadStatus === 'Network error';
              return (
                <View
                  style={[
                    globalStyles.rowJB,
                    {
                      marginHorizontal: wp(5),
                      marginVertical: wp(3),
                    },
                  ]}>
                  <View style={globalStyles.rowAC}>
                    <Image
                      source={{uri: value?.item?.uri}}
                      style={styles.uploadImg}
                    />
                    <View style={{width: wp(50)}}>
                      <FontText
                        name={'medium'}
                        size={normalize(12)}
                        color={colors.gray900}
                        pBottom={wp(2)}>
                        {value?.item?.fileName}
                      </FontText>
                      <FontText
                        name={'medium'}
                        size={normalize(12)}
                        color={colors.gray2}
                        pBottom={wp(2)}>
                        {(value?.item?.fileSize * 0.000001).toFixed(1)}mb
                      </FontText>
                      <View style={styles.progressContainer}>
                        <Progress.Bar
                          progress={itemProgress / 100}
                          color={isUploadFailed ? 'red' : 'green'}
                          unfilledColor={'lightgray'}
                          borderWidth={0}
                          width={wp(20)}
                          style={{marginTop: -8}}
                        />
                        <FontText
                          name={'medium'}
                          size={normalize(12)}
                          color={colors.gray2}
                          pBottom={wp(2)}>
                          {itemProgress === 100
                            ? ' Completed'
                            : ' ' + itemProgress + '%'}
                        </FontText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.mainIconView}>
                    {isUploadFailed && (
                      <View style={styles.iconView1}>
                        <TouchableOpacity
                          onPress={() => handleRetry(value?.item)}>
                          <SvgIcon.Retry style={{padding: wp(2)}} />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.iconView2}>
                      <TouchableOpacity
                        onPress={() => handleDelete(value?.item?.fileName)}>
                        <SvgIcon.Delete style={{padding: wp(2)}} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>

      <View style={{bottom: isX ? wp(10) : wp(8)}}>
        {selectedData?.length < 4 && (
          <Button
            style={styles.morebtnStyle}
            labelStyle={styles.btnLable}
            mode="contained"
            onPress={() => lunchLibrary()}>
            {'Add More'}
          </Button>
        )}
        <Button
          style={[
            styles.btnStyle,
            isInComplete || selectedData?.length < 4
              ? {backgroundColor: colors.gray}
              : {backgroundColor: colors.blue},
          ]}
          disabled={isInComplete || selectedData?.length < 4 ? true : false}
          labelStyle={styles.btnLable}
          mode="contained"
          onPress={onContinuePress}>
          {'Continue'}
        </Button>
      </View>
      <BottomSheet
        refName={popUp}
        autoClose={false}
        withHandle
        withReactModal
        content={
          <View style={styles.modelView}>
            <Pressable onPress={() => popUp?.current?.close()}>
              <SvgIcon.Close style={styles.svgCloseIcon} />
            </Pressable>
            {selectionType === 'Model' ? (
              <>
                {renderLabel('Select model details')}
                <Dropdown
                  style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                  data={genderData}
                  dropdownPosition={'top'}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select model gender' : '...'}
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item: any) => {
                    setValue(item.value);
                    setGender(item.label);
                    setIsFocus(false);
                  }}
                />
                {genderError && gender === '' && (
                  <Text style={{color: 'red'}}>Please select model gender</Text>
                )}
                <Input
                  inputContainer={styles.inputView}
                  inputStyle={styles.inputText}
                  placeholder={'Model full name'}
                  value={mName}
                  onChangeText={(text: any) => setMName(text)}
                />

                {nameError && mName === '' && (
                  <FontText pTop={wp(0.5)} size={normalize(10.5)} color="red">
                    please input model's name
                  </FontText>
                )}
              </>
            ) : (
              <>
                {renderLabel('Style product details')}
                <Dropdown
                  style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                  dropdownPosition={'top'}
                  data={styleType}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select style type' : '...'}
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item: any) => {
                    setValue(item.value);
                    setSType(item.label);
                    setIsFocus(false);
                  }}
                />
                <FontText size={normalize(14)} name={'medium'} pTop={wp(3)}>
                  {'Style product url'}
                </FontText>
                <Input
                  inputContainer={styles.inputView}
                  inputStyle={styles.inputText}
                  placeholder={'Type or paste'}
                  value={productUrl}
                  onChangeText={(text: any) => setProductUrl(text)}
                />
              </>
            )}
            <Button
              style={{
                marginBottom: wp(5),
                marginTop: wp(10),
                borderRadius: borderRadius.large,
                paddingVertical: wp(1),
                backgroundColor: colors.blue,
              }}
              labelStyle={styles.btnLable}
              mode="contained"
              onPress={onPopUpContinueBtn}>
              {'Continue'}
            </Button>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    marginTop: wp(5),
    flex: 1,
  },
  uploadImg: {
    height: wp(20),
    width: wp(20),
    borderRadius: wp(2),
    marginRight: wp(4),
  },
  mainIconView: {
    flexDirection: 'row',
    backgroundColor: colors.gray1,
    borderRadius: 2,
  },
  iconView1: {
    borderColor: colors.gray1,
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    borderRightWidth: 0.5,
  },
  iconView2: {
    borderColor: colors.gray1,
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
  },
  morebtnStyle: {
    marginHorizontal: wp(9),
    paddingVertical: wp(1),
    backgroundColor: colors.blue,
    borderRadius: borderRadius.large,
    marginBottom: 10,
  },
  btnStyle: {
    marginHorizontal: wp(9),
    paddingVertical: wp(1),
    backgroundColor: colors.blue,
    borderRadius: borderRadius.large,
    bottom: wp(-7),
  },
  btnLable: {
    fontSize: normalize(16),
    fontFamily: fonts.bold,
    fontWeight: '600',
  },
  modelView: {
    paddingVertical: wp(8),
    paddingHorizontal: wp(7),
  },
  dropdown: {
    height: wp(12),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: wp(4),
  },
  inputView: {
    height: wp(12),
    width: wp(86),
    borderRadius: wp(2.5),
    borderColor: colors.gray2,
    marginVertical: wp(3),
    paddingHorizontal: wp(2),
    left: wp(4),
  },
  inputText: {
    fontSize: normalize(14),
    color: colors.black,
  },
  progressContainer: {
    flexDirection: 'row',
    width: wp(20),
    alignItems: 'center',
  },
  svgCloseIcon: {
    alignSelf: 'flex-end',
    padding: wp(2),
  },
  flatlistStyle: {
    flexGrow: 0,
    height: hp(66.8),
  },
});
