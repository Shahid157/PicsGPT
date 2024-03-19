import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../assets';
import globalStyles from '../../styles';
import {CommonHeader, FontText} from '../../components';
import {isX, normalize, wp} from '../../styles/responsiveScreen';
import GuideLineCriteria from './GuideLineCriteria';
import DataSource from '../../constants/data';
import {Button} from 'react-native-paper';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import TitleSubTitle from './TitleSubTitle';
import utils from '../../helpers/utils';
import {useDispatch} from 'react-redux';
import {
  DrawerStackProps,
  PhotoAIStackParams,
  TabScreenProps,
} from '../../navigation/types';

const {goodModelList, badModelList, goodPhotos} = DataSource;

import {uploadImage} from '../../api/uploadApi';
import {uploadImageAction} from '../../store/actions';
import {UserSelectedImage} from '../../store/actions';
import {borderRadius} from '../../constants/appConstants';

export default function GuideLines({
  navigation,
  route,
}: DrawerStackProps<'GuideLines'> | TabScreenProps<'GuideLines'>) {
  const {selectionType} = route?.params;
  const dispatch = useDispatch();

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

  const GuidelineTitle =
    selectionType === 'Model'
      ? 'Model upload guidelines'
      : selectionType === 'Style'
      ? 'Style upload guidelines'
      : '';

  const GuidelineSubTitle =
    selectionType === 'Model'
      ? 'Guidelines for uploading photos for best results'
      : selectionType === 'Style'
      ? 'Follow these guidelines for the best results'
      : '';

  const goodPhotoTitle =
    selectionType === 'Model'
      ? 'Good photos to use:'
      : selectionType === 'Style'
      ? 'Good style images to use'
      : '';
  const goodPhotoSubTitle =
    selectionType === 'Model'
      ? 'Bad photos to use:'
      : selectionType === 'Style'
      ? 'Bad style images to use'
      : '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}>
        <TitleSubTitle
          title={GuidelineTitle}
          showCrossButton={true}
          subTitle={GuidelineSubTitle}
          onClosePress={() => navigation.goBack()}
        />
        <GuideLineCriteria
          title={goodPhotoTitle}
          type={'good'}
          data={goodPhotos}
          imageData={goodModelList}
        />
        <GuideLineCriteria
          title={goodPhotoSubTitle}
          type={'bad'}
          data={goodPhotos}
          imageData={badModelList}
        />
      </ScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: wp(2),
        }}>
        <FontText style={{fontWeight: '600'}}>
          {'For best results, 10+ images are recommended'}
        </FontText>
      </View>
      <Button
        style={styles.btnStyle}
        labelStyle={styles.btnLable}
        mode="contained"
        onPress={() => lunchLibrary()}>
        {'Got It, Lets Upload  4+ Images'}
      </Button>
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
  },
  btnStyle: {
    marginHorizontal: wp(9),
    paddingVertical: wp(1),
    backgroundColor: colors.blue,
    borderRadius: borderRadius.none,
    marginTop: wp(2),
    marginBottom: isX ? wp(7) : wp(1),
  },
  btnLable: {
    fontSize: normalize(16),
    fontFamily: fonts.bold,
    fontWeight: '600',
  },
});
