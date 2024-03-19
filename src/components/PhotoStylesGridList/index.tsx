import React, {useState, useRef, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {normalize, wp, hp} from '../../styles/responsiveScreen';
import FontText from '../FontText';
import {colors, fonts} from '../../assets';
import FastImage from 'react-native-fast-image';
import {useToast} from 'react-native-toast-notifications';
import {
  addSelectedImage,
  clearCategory,
  removeSelectedImage,
} from '../../store/reducers/multiSelectSlice';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-notifications';
import {selectedImagesState} from './interfaces';

interface GridListProps {
  data: any;
  imageStyle?: any;
  listStyle?: any;
  isText?: boolean;
  limitedSelection: number;
}

const PhotoStylesGridList = ({
  data,
  imageStyle,
  listStyle,
  isText,
  limitedSelection,
}: GridListProps) => {
  const [viewAll, setViewAll] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [viewList, setViewList] = useState([]);
  const [currentIds, setCurrentIds] = useState([]);
  const toastRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const {selectedImages} = useSelector(
    (state: selectedImagesState) => state.selectedImages,
  );

  const onSelectPressHandler = (item?: any) => {
    const isCurrentlySelected = selectedImages.some(
      (selectedItem: any) => selectedItem === item.style_id,
    );

    if (isCurrentlySelected) {
      dispatch(removeSelectedImage(item));
    } else if (selectedImages.length >= limitedSelection) {
      if (viewAll) {
        toastRef?.current.show(
          `You can select up to ${limitedSelection} items.`,
          {
            type: 'danger',
            placement: 'top',
            duration: 1500,
            animationType: 'slide-in',
          },
        );
      }

      toast.show(`You can select up to ${limitedSelection} items.`, {
        type: 'danger',
        placement: 'top',
        duration: 1500,
        animationType: 'slide-in',
      });
    } else {
      dispatch(addSelectedImage(item));
    }
  };
  const filterCurrentIds = () => {
    const data = viewList.filter((item: any) => {
      return selectedImages.includes(item.style_id);
    });
    const ids = data.map((item: any) => item.style_id);
    setCurrentIds(ids);
  };
  useEffect(() => {
    filterCurrentIds();
  }, [selectedImages, viewList]);

  const onClearPress = () => {
    dispatch(clearCategory(currentIds));
    setViewAll(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={[{marginVertical: wp(1)}]}
        keyExtractor={item => item.indexId.toString()}
        renderItem={({item}) => {
          return (
            <View>
              <View style={styles.titleView}>
                <Text style={styles.itemTitle}>
                  {item.type} ({item.data?.length})
                </Text>
                {item?.type !== 'Trending' && (
                  <View style={{flexDirection: 'row'}}>
                    {item?.indexId === 0 && selectedImages.length > 0 && (
                      <View style={styles.selectedCountMain}>
                        <FontText style={{color: colors.gray2, fontSize: 11}}>
                          Selected
                        </FontText>
                        <FontText
                          style={{
                            marginLeft: hp(1),
                            color: colors.gray2,
                            fontSize: 11,
                          }}>
                          {selectedImages.length}
                        </FontText>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.heading}
                      onPress={() => {
                        setItemTitle(item?.type);
                        setViewAll(true);
                        setViewList(item.data);
                      }}>
                      <Text style={{color: colors.black, fontSize: 9}}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <FlatList
                style={listStyle}
                horizontal
                contentContainerStyle={[{paddingBottom: wp(2)}]}
                showsVerticalScrollIndicator={false}
                data={item.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => onSelectPressHandler(item)}
                        style={[styles.GridViewContainer]}
                        activeOpacity={0.7}>
                        <FastImage
                          source={{
                            uri: item?.img_url?.trim(),
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          style={[
                            imageStyle,
                            {
                              backgroundColor: colors.lightGray2,
                              borderColor: colors?.blue,
                              borderWidth: selectedImages.some(
                                (selectedItem: any) =>
                                  selectedItem === item.style_id,
                              )
                                ? wp(0.5)
                                : wp(0),
                            },
                          ]}
                        />
                      </TouchableOpacity>

                      {isText ? (
                        <View style={styles.promptName}>
                          <FontText
                            lines={2}
                            name={'semiBold'}
                            size={normalize(12)}
                            color={colors.white}
                            style={{
                              width: wp(30),
                            }}>
                            {item?.prompt_name}
                          </FontText>
                        </View>
                      ) : null}
                    </View>
                  );
                }}
              />
            </View>
          );
        }}
      />

      <Modal animationType="fade" visible={viewAll}>
        <View style={{flex: 1, marginTop: hp(2)}}>
          {selectedImages.length >= limitedSelection ? (
            <Toast ref={toastRef} />
          ) : null}
          <Toast ref={toastRef} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp(5),
              marginHorizontal: wp(2),
            }}>
            <TouchableOpacity
              onPress={() => {
                onClearPress();
              }}>
              <FontText
                size={14}
                name={'semi-bold'}
                color={colors.black}
                style={{paddingLeft: wp(1)}}>
                Clear
              </FontText>
            </TouchableOpacity>
            <View style={{position: 'absolute', left: wp(26.5)}}>
              <FontText style={styles.title}>{itemTitle}</FontText>
            </View>
          </View>
          <View>
            <FlatList
              data={viewList}
              style={{marginTop: hp(2), marginHorizontal: wp(0.7)}}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <View style={{marginHorizontal: wp(1)}}>
                    <TouchableOpacity
                      onPress={() => onSelectPressHandler(item)}>
                      <FastImage
                        source={{
                          uri: item?.img_url?.trim(),
                          priority: FastImage.priority.normal,
                        }}
                        style={[
                          styles.modalImage,
                          {
                            borderColor: selectedImages.some(
                              (selectedItem: any) =>
                                selectedItem === item.style_id,
                            )
                              ? colors?.blue
                              : colors?.lightGray2,
                            backgroundColor: colors?.lightGray2,
                            borderWidth: wp(0.5),
                          },
                        ]}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>

                    {isText ? (
                      <View style={{position: 'absolute', bottom: 8, left: 8}}>
                        <FontText
                          lines={2}
                          name={'semiBold'}
                          size={normalize(12)}
                          color={colors.white}
                          style={{
                            width: wp(30),
                          }}>
                          {item?.prompt_name}
                        </FontText>
                      </View>
                    ) : null}
                  </View>
                );
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setViewAll(false);
            }}
            style={styles.nextBtn}>
            <FontText
              size={14}
              name={'semi-bold'}
              color={colors.black}
              style={styles.nextBtnLabel}>
              Continue with selected items: {currentIds.length}
            </FontText>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default PhotoStylesGridList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modelImage: {
    width: wp(47),
    height: wp(47),
    borderRadius: wp(1),
  },
  GridViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(1),
    width: wp(30),
    height: wp(30),
  },
  imgListView: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(5),
    paddingTop: wp(3),
    position: 'absolute',
    borderTopEndRadius: wp(2),
    bottom: 0,
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
    borderRadius: wp(12),
    height: hp(2.5),
    width: wp(5),
    top: wp(-2),
    right: 0,
    alignItems: 'center',
    zIndex: 989,
    backgroundColor: colors.red,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    height: wp(30),
    width: wp(30),
    top: wp(1),
    left: wp(1.1),
  },
  TrendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    height: hp(40),
    width: wp(60),
  },
  TrendingOverlayList: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    height: hp(40),
    width: wp(45),
    marginTop: wp(2),
    marginRight: wp(1),
    borderRadius: wp(3),
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(15),
    height: hp(3),
    backgroundColor: colors.halfWhite,
  },
  titleView: {
    marginHorizontal: wp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 6,
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    fontWeight: '600',
  },
  promptName: {position: 'absolute', bottom: 8, left: 8},
  title: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginLeft: wp(10),
  },
  modalImage: {
    height: hp(40),
    width: wp(48),
    marginTop: wp(1),
    marginRight: wp(-1),
    borderRadius: wp(3),
  },
  tick: {
    position: 'absolute',
    top: wp(13),
    left: wp(13),
  },
  selectedCountMain: {
    flexDirection: 'row',
    marginRight: wp(0.5),
    borderRadius: 1,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: hp(0.2),
    alignItems: 'center',
  },
  selectedCount: {
    flexDirection: 'row',
    marginRight: wp(0.5),
    borderRadius: 1,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: hp(0.2),
    alignItems: 'center',
    position: 'absolute',
    left: wp(79),
  },
  nextBtn: {
    width: '80%',
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: wp(4),
    backgroundColor: colors.blue,
  },
  nextBtnLabel: {
    color: colors.white,
    fontWeight: '700',
  },
});
