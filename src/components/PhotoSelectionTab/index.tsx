import {StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';
import React from 'react';
import {colors, SvgIcon} from '../../assets';
import globalStyles from '../../styles';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {removeSelectedImage} from '../../store/reducers/multiSelectSlice';
import {creationTab} from '../../screens/PhotoAI/interfaces';
import {getStyleByID} from '../../utils/helpers';
import {hp, wp} from '../../styles/responsiveScreen';
import {useDispatch} from 'react-redux';

interface SelectionTabProps {
  selectionProcess: creationTab[];
  isType: string;
  onClosePress: () => void;
  onNextPress: () => void;
  onTabChange: (tab: creationTab) => void;
  isModel?: boolean;
  disableNext: boolean;
}

export default function PhotoSelectionTab({
  selectionProcess,
  onClosePress,
  onNextPress,
  onTabChange,
  isType,
  disableNext,
}: SelectionTabProps) {
  const {modelSelected} = useSelector((state: any) => state.modelSelected);
  const {selectedImages} = useSelector((state: any) => state.selectedImages);
  const mainData = useSelector((state: any) => state?.stylesData?.stylesData);

  const EmptyImageView = (item: any) => {
    const isSelected = item.item?.type === isType;
    return (
      <View
        style={[
          styles.imageBox,
          {
            borderColor: isSelected ? colors.blue : '#00000010',
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      />
    );
  };

  const dispatch = useDispatch();

  const onDeleteStyle = (item?: any) => {
    dispatch(removeSelectedImage(item));
  };

  const ImageView = (item: any) => {
    const isSelected = item?.type === isType;
    return item?.image ? (
      <FastImage
        style={[
          styles.imageBox,
          {
            borderColor: isSelected ? colors.blue : '#00000010',
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        source={{
          uri: item?.image,
          priority: FastImage.priority.high,
        }}
      />
    ) : null;
  };

  const renderImageView = (item: any) => {
    const photoStyleUrl = getStyleByID(selectedImages[0], mainData);

    const modelUrl = modelSelected?.uri
      ? modelSelected?.uri
      : modelSelected?.url;
    const newModel = modelUrl ? modelUrl : item?.image;

    switch (item.type) {
      case 'Model':
        return newModel ? (
          <ImageView image={newModel} type={item.type} />
        ) : (
          <EmptyImageView item={item} />
        );
      case 'Style':
        return photoStyleUrl?.img_url ? (
          <ImageView image={photoStyleUrl?.img_url} type={item.type} />
        ) : (
          <EmptyImageView item={item} />
        );
      default:
        return <EmptyImageView item={item} />;
    }
  };

  return (
    <View style={styles.topContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onClosePress}
          style={[
            globalStyles.colC,
            globalStyles.boxShadow,
            styles.previousBox,
          ]}>
          {isType === 'Model' ? <SvgIcon.backArrow /> : <SvgIcon.Close />}
        </TouchableOpacity>
        {/*
        we may need it later 
        {selectionProcess.map((tab: creationTab) => {
          return (
            <Pressable
              onPress={() => onTabChange(tab)}
              key={tab.id}
              style={globalStyles.colC}>
              {renderImageView(tab)}
              <FontText
                name="medium"
                size={normalize(10)}
                color={colors.gray3}
                pTop={wp(1.5)}>
                {tab.type}
              </FontText>
            </Pressable>
          );
        })} */}

        <View style={styles.mainView}>
          {selectedImages?.length > 0 ? (
            <FlatList
              horizontal
              style={styles.imgListView}
              showsHorizontalScrollIndicator={false}
              data={selectedImages}
              renderItem={({item}) => {
                let selectedItem = getStyleByID(item, mainData);
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => onDeleteStyle(selectedItem)}
                      style={styles.closeIcon}>
                      <FastImage
                        source={require('../../assets/images/close.png')}
                        style={{
                          height: hp(1.7),
                          width: wp(2),
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <FastImage
                      source={{
                        uri: selectedItem?.img_url?.trim(),
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={styles.multiImg}
                    />
                  </View>
                );
              }}
            />
          ) : null}
        </View>

        <TouchableOpacity
          disabled={disableNext}
          onPress={onNextPress}
          style={[
            globalStyles.colC,
            styles.previousBox,
            {backgroundColor: disableNext ? colors.darkBlue : colors.blue},
          ]}>
          <SvgIcon.Forward />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingTop: wp(1),
    paddingHorizontal: wp(4),
    paddingBottom: wp(0.5),
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previousBox: {
    height: wp(11),
    width: wp(11),
    borderRadius: wp(3),
    backgroundColor: colors.white,
  },
  imageBox: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(2),
    backgroundColor: colors.gray4,
    borderWidth: 1,
    borderColor: '#00000010',
  },
  categoryView: {
    marginHorizontal: wp(2.5),
    paddingTop: wp(4),
    paddingBottom: wp(1),
  },
  categoryBox: {
    backgroundColor: colors.black,
    marginLeft: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(5),
    borderWidth: 2,
  },
  imgListView: {
    backgroundColor: colors.white,
    paddingTop: 5,
    borderTopEndRadius: wp(2),
    marginTop: hp(0.8),
  },
  closeIcon: {
    position: 'absolute',
    borderRadius: wp(12),
    height: hp(1.8),
    width: wp(3.6),
    top: wp(-1),
    right: 6,
    alignItems: 'center',
    zIndex: 989,
    backgroundColor: colors.red,
  },
  multiImg: {
    height: wp(10),
    width: wp(10),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: wp(1),
    marginRight: wp(4),
  },
  mainView: {
    flexDirection: 'row',
    flex: 1,
    width: wp(18),
    marginLeft: wp(1),
    height: wp(16),
  },
});
