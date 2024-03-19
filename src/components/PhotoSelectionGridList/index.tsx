import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useState} from 'react';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '..';
import {SvgIcon, colors} from '../../assets';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {setModel} from '../../store/reducers/modelSelectSlice';
import {EmptyModel} from '../../store/reducers/multipleModelSelectedSlice';
import {
  DeleteModel,
  AddModel,
} from '../../store/reducers/multipleModelSelectedSlice';
import {MultiSelect} from 'react-native-element-dropdown';

interface GridListProps {
  data: any;
  gridViewStyle?: StyleProp<any>;
  imageStyle?: StyleProp<any>;
  listStyle?: StyleProp<any>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isText?: boolean;
  isSelect?: boolean;
  onImagePress?: any;
  screensEnabled?: boolean;
  isModel?: boolean;
  isFantasyGarment?: boolean;
  isAdd?: boolean;
  btnTitle?: string;
  btnSubTitle?: string;
  onAddManualPress?: () => void;
  isMultiSelect?: boolean;
  onSelectedStyles?: any;
  myModels?: boolean;
}

interface Item {
  id: string;
  url: string;
}

export default function PhotoSelectionGridList({
  data,
  gridViewStyle,
  imageStyle,
  listStyle,
  contentContainerStyle,
  isText,
  onImagePress,
  isSelect,
  screensEnabled,
  isModel,
  isFantasyGarment,
  isAdd,
  btnTitle,
  btnSubTitle,
  onAddManualPress,
  isMultiSelect,
  onSelectedStyles,
  myModels,
}: GridListProps) {
  const newList = isAdd ? [{id: 'add'}, ...data] : data;
  const [selectedImg, setSelectedImg] = useState(null);
  const dispatch = useDispatch();
  const {multipleModelSelected} = useSelector(
    state => state.multipleModelSelectedSlice,
  );

  const onSelectPressHandler = (item: Item | any, idx?: number | undefined) => {
    if (isSelect) {
      if (selectedImg === item?.id) {
        setSelectedImg(null);
        return;
      }

      setSelectedImg(item.id);
      if (multipleModelSelected.length) {
        dispatch(EmptyModel());
      }
      dispatch(AddModel(item));
    }

    if (isMultiSelect) {
      if (multipleModelSelected.some((model: any) => model.id === item.id)) {
        dispatch(DeleteModel(item.id));
      } else {
        dispatch(AddModel(item));
      }
    } else {
      onImagePress(item);
    }
  };

  return (
    <>
      <FlatList
        scrollEnabled={screensEnabled}
        style={[{marginVertical: wp(2)}, listStyle]}
        contentContainerStyle={[{paddingBottom: wp(2)}, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={newList}
        keyExtractor={({id}) => id.toString()}
        renderItem={({item, index}) => {
          let isSelected = multipleModelSelected.findIndex(
            (model: any) => model.id === item.id,
          );
          return (
            <>
              {isAdd && index === 0 ? (
                <TouchableOpacity
                  onPress={onAddManualPress}
                  activeOpacity={0.8}
                  style={[
                    imageStyle,
                    {backgroundColor: 'black'},
                    styles.GridViewContainer,
                  ]}>
                  <FontText
                    name={'bold'}
                    size={normalize(20)}
                    color={colors.white}>
                    {btnTitle}
                  </FontText>
                  <FontText
                    name={'medium'}
                    size={normalize(14)}
                    color={colors.white}
                    pTop={wp(1)}>
                    {btnSubTitle}
                  </FontText>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => onSelectPressHandler(item)}
                    style={[styles.GridViewContainer, gridViewStyle]}>
                    {isModel ? (
                      <FastImage style={imageStyle} source={item?.uri} />
                    ) : (
                      <FastImage
                        source={{
                          uri: isFantasyGarment
                            ? item?.collection[0]?.trim()
                            : myModels
                            ? item?.collection[0]?.trim()
                            : item?.url?.trim(),
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={[
                          imageStyle,
                          isSelect || isMultiSelect
                            ? {
                                borderWidth: 2,
                                borderColor:
                                  (isSelect && item.id === selectedImg) ||
                                  (isMultiSelect && isSelected !== -1)
                                    ? colors.blue
                                    : colors.lightGray2,

                                borderRadius: wp(2),
                                backgroundColor: colors.gray,
                              }
                            : null,
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                  {isText ? (
                    <View style={{alignItems: 'center'}}>
                      <FontText
                        lines={1}
                        name={'semiBold'}
                        textAlign={'center'}
                        size={normalize(14)}
                        color={colors.gray900}
                        style={{width: wp(40)}}>
                        {myModels ? item?.full_name : item?.name}
                      </FontText>
                      <FontText
                        lines={1}
                        name={'medium'}
                        textAlign={'center'}
                        size={normalize(12)}
                        color={colors.gray500}
                        pTop={wp(1.5)}
                        pBottom={wp(2.2)}
                        style={{width: wp(40)}}>
                        {isFantasyGarment
                          ? item?.garment_type
                          : item?.product_name}
                      </FontText>
                    </View>
                  ) : null}
                </View>
              )}
            </>
          );
        }}
      />

      {/* { We may need it later as requirenments keep on changing   
        isMultiSelect && multiSelectStyle?.length > 0 ? (
        <View>
          <FlatList
            horizontal
            style={styles.imgListView}
            showsHorizontalScrollIndicator={false}
            data={multiSelectStyle}
            renderItem={({item, index}) => {
              return (
                <>
                  <Pressable
                    onPress={() => onDeleteStyle(index)}
                    style={styles.closeIcon}>
                    <SvgIcon.FilledClose />
                  </Pressable>
                  <FastImage
                    source={{
                      uri: item?.url?.trim(),
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.multiImg}
                  />
                </>
              );
            }}
          />
        </View>
      ) : null} */}
    </>
  );
}

const styles = StyleSheet.create({
  modelImage: {
    width: wp(47),
    height: wp(47),
    borderRadius: wp(1),
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(1),
  },
  imgListView: {
    paddingHorizontal: wp(5),
    paddingTop: wp(3),
    paddingBottom: wp(1),
  },
  multiImg: {
    height: wp(17),
    width: wp(17),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: wp(1),
    marginRight: wp(4),
  },
  closeIcon: {
    position: 'absolute',
    top: wp(-3.5),
    right: 0,
    zIndex: 999,
  },
});
