import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useState} from 'react';
import {normalize, wp} from '../../styles/responsiveScreen';
import {FontText} from '..';
import {SvgIcon, colors} from '../../assets';
import FastImage from 'react-native-fast-image';
import {url} from '../../constants/linkingUrls';

interface GridListProps {
  data: any;
  handleScroll?: (event: any) => void;
  gridViewStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<any>;
  listStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isText?: boolean;
  isSelect?: boolean;
  onImagePress?: any;
  screensEnabled?: boolean;
  isModel?: boolean;
  isFantasyGarment?: boolean;
  isAdd?: boolean;
  isUserScreen?: boolean;
  btnTitle?: string;
  btnSubTitle?: string;
  onAddManualPress?: () => void;
  isMultiSelect?: boolean;
  onSelectedStyles?: any;
  isProfileGenerationData?: boolean;
  filter?: string;
  ListEmptyComponent?: React.JSX.Element;
  ListFooterComponent?: React.JSX.Element;
  ListHeaderComponent?: React.JSX.Element;
  onEndReached?: () => void;
}
interface ListItem {
  id: string;
  url: string;
}

export default function GridList({
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
  isProfileGenerationData,
  handleScroll,
  ListFooterComponent,
  ListHeaderComponent,
  onEndReached,
  isUserScreen,
}: GridListProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [multiSelectedImg, setMultiSelectedImg] = useState<string[]>([]); // Assuming item.id is of type string
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [multiSelectStyle, setMultiSelectStyle] = useState<any[]>([]);
  const newList = isAdd ? [{id: 'add'}, ...data] : data;
  const onSelectPressHandler = (item: ListItem, idx?: any) => {
    setSelectedImg(item.id);

    if (isMultiSelect) {
      const index = multiSelectStyle.findIndex((e?: any) => e.id === item.id);
      const newArray = [...multiSelectStyle];
      const newImgArray = [...multiSelectedImg];
      if (multiSelectedImg.includes(item.id)) {
        newImgArray.splice(index, 1);
        newArray.splice(index, 1);
      } else {
        newImgArray.push(item?.id);
        newArray.push(item);
      }
      setMultiSelectedImg(newImgArray);
      setMultiSelectStyle(newArray);
      onSelectedStyles(newArray);
    } else {
      onImagePress(item?.job_id);
    }
  };

  const onDeleteStyle = (idx?: any) => {
    const newArray = [...multiSelectStyle];
    const newImgArray = [...multiSelectedImg];
    newImgArray.splice(idx, 1);
    newArray.splice(idx, 1);
    setMultiSelectedImg(newImgArray);
    setMultiSelectStyle(newArray);
    onSelectedStyles(newArray);
  };

  return (
    <View>
      <FlatList
        scrollEnabled={screensEnabled}
        style={[{marginVertical: wp(2)}, listStyle]}
        contentContainerStyle={[{paddingBottom: wp(2)}, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={newList}
        onScroll={handleScroll}
        nestedScrollEnabled
        keyExtractor={({id}) => id.toString()}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({item, index}) => {
          const firstImage = item?.results && item?.results[0]?.trim();
          return (
            <>
              {isAdd && index === 0 ? (
                <TouchableOpacity
                  onPress={onAddManualPress}
                  activeOpacity={0.8}
                  style={[
                    imageStyle,
                    {backgroundColor: colors.black},
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
                <View style={{marginBottom: 10}}>
                  <TouchableOpacity
                    onPress={() => onSelectPressHandler(item, index)}
                    style={[styles.GridViewContainer, gridViewStyle]}>
                    {isModel ? (
                      <Image style={imageStyle} source={item?.image} />
                    ) : (
                      <>
                        <FastImage
                          source={{
                            uri: isFantasyGarment
                              ? item?.collection[0]?.trim()
                              : isProfileGenerationData
                              ? firstImage
                              : item?.url?.trim(),
                            priority: FastImage.priority.high,
                          }}
                          defaultSource={{
                            uri: url.defaultPicture,
                          }}
                          resizeMode={
                            isUserScreen
                              ? FastImage.resizeMode.cover
                              : FastImage.resizeMode.contain
                          }
                          onLoadStart={() => setIsLoading(true)}
                          onLoadEnd={() => setIsLoading(false)}
                          style={[
                            imageStyle,
                            isSelect || isMultiSelect
                              ? {
                                  borderWidth: 2,
                                  borderColor:
                                    (isSelect && item.id === selectedImg) ||
                                    (isMultiSelect &&
                                      multiSelectedImg.includes(item.id))
                                      ? colors.blue
                                      : colors.lightGray2,
                                  borderRadius: wp(2),
                                  backgroundColor: colors.lightGray2,
                                }
                              : null,
                          ]}></FastImage>
                        {isUserScreen && (
                          <>
                            <FontText
                              name={'medium'}
                              size={normalize(14)}
                              color={colors.white}
                              style={styles.imageName}
                              numberOfLines={1}
                              pTop={wp(1)}>
                              {item?.usedItems?.usedModel?.full_name}
                            </FontText>
                            <TouchableOpacity style={styles.recycleIcon}>
                              <SvgIcon.Recycle />
                            </TouchableOpacity>
                          </>
                        )}
                      </>
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
                        {item?.name}
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

      {isMultiSelect && multiSelectStyle?.length > 0 ? (
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
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.multiImg}
                  />
                </>
              );
            }}
          />
        </View>
      ) : null}
    </View>
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
  recycleIcon: {
    height: wp(7),
    width: wp(7),
    backgroundColor: colors.white,
    position: 'absolute',
    top: wp(51),
    borderRadius: wp(5),
    left: wp(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageName: {
    width: '70%',
    position: 'absolute',
    top: wp(51),
    left: wp(3),
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
