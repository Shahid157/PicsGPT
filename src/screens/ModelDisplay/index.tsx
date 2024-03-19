import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import globalStyles from '../../styles';
import {
  CommonHeader,
  FontText,
  Loading,
  LogInBottomSheet,
} from '../../components';
import {SvgIcon, colors} from '../../assets';
import {normalize, wp} from '../../styles/responsiveScreen';
import FastImage from 'react-native-fast-image';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import {fetchSearchInfer} from '../../api/homeApi';
import {useAppDispatch} from '../../store/hooks';
import {Button} from 'react-native-paper';
import Share from 'react-native-share';
import {HomeStackScreenProps} from '../../navigation/types';
import {borderRadius} from '../../constants/appConstants';
import {addSelectedImage} from '../../store/reducers/multiSelectSlice';
import {Modalize} from 'react-native-modalize';
import {useSelector} from 'react-redux';
import {
  addLikedImages,
  removeLikedImages,
} from '../../store/reducers/likedImagesReducer';
import {hp} from '../../constants';
import Carousel from 'react-native-reanimated-carousel';
import RNFetchBlob from 'rn-fetch-blob';
import {Toast} from 'react-native-toast-notifications';
import PinchableBox from '../../components/PinchableBox';

export interface IList {
  id: string;
  files: any;
}

export default function ModelDisplay({
  navigation,
  route,
}: HomeStackScreenProps<'ModelDisplay'>) {
  const dispatch = useAppDispatch();
  const {modelDetails} = route?.params;
  const [moreLike, setMoreLike] = useState([]);
  const [selectedImg, setSelectedImg] = useState(modelDetails.results[0]);
  const [selectedUser, setSelectedUser] = useState(modelDetails);
  const [selectedMore, setSelectedMore] = useState(modelDetails?.results);
  const [count, setCount] = useState(0);
  const [followData, setFollowData] = useState([] as any);
  const [likeData, setLikeData] = useState([] as any);
  const [followText, setFollowText] = useState(Boolean);
  const [isLiked, setIsLiked] = useState(Boolean);
  const [isLoading, setisLoading] = useState(false);
  const [isDownload, setisDownload] = useState(false);

  const scrollRef = React.createRef<ScrollView>();
  const bottomSheetRef = useRef<Modalize>(null);
  const modelImages = useSelector(state => state?.likedModals);
  const {userId} = useSelector((state: any) => state.auth);
  const carouselRef = useRef(null);
  const lowerListRef = useRef(null);
  const [isPresent, setIsPresent] = useState(
    modelImages.some(obj => obj.job_id === selectedUser.job_id),
  );

  useEffect(() => {
    getDetails();
    getFollowDetails();
    getLikeDetails();
  }, []);

  useEffect(() => {
    const present = modelImages.some(obj => obj.job_id === selectedUser.job_id);
    setIsPresent(present);
  }, [selectedUser, modelImages]);
  useEffect(() => {
    if (count === 2) {
      onLikePressHandler();
    }
  }, [count]);

  const validateUser = () => {
    if (!userId) {
      bottomSheetRef.current?.open();
      return false;
    } else {
      return true;
    }
  };

  const getFollowDetails = async () => {
    let {data: follow, error} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('follow')
      .select('*');
    follow?.map((obj?: any) => {
      if (obj?.user_id === selectedUser?.id) {
        setFollowText(obj?.isFollow);
      }
      return obj;
    });

    setFollowData(follow);
  };

  const getLikeDetails = async () => {
    return;
    // FOR LATER USE
    let {data: Like, error} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('Like')
      .select('*');
    Like?.map((obj?: any) => {
      if (obj?.user_id === selectedUser?.id) {
        setIsLiked(obj?.isLike);
      }
      return obj;
    });
    setLikeData(Like);
  };

  const getDetails = async () => {
    setisLoading(true);
    for (let index = 0; index < 200; index++) {
      const newData: any = await fetchSearchInfer(index, dispatch);
      newData.forEach(async newItem => {
        if (newItem.id === modelDetails?.id) {
          const newData: any = await fetchSearchInfer(index, dispatch);
          setMoreLike(newData);
          setisLoading(false);
          return;
        }
      });
    }
  };

  const onFollowPressHandler = async () => {
    if (validateUser()) {
      return;
      if (
        followData.some((value: any) => value?.user_id === selectedUser?.id)
      ) {
        await followData.map(async (obj: any) => {
          if (obj.user_id === selectedUser?.id) {
            const {data, error} = await supabaseDynamic(
              supabaseUrl,
              supabaseKey,
            )
              .from('follow')
              .update({isFollow: !obj?.isFollow})
              .eq('user_id', selectedUser?.id)
              .select();
            let finalData: any = data;
            getFollowDetails();
            return {...obj, isFollow: finalData[0]?.isFollow};
          }
          return obj;
        });
      } else {
        setFollowText(true);
        const {data, error} = await supabaseDynamic(supabaseUrl, supabaseKey)
          .from('follow')
          .insert([
            {
              follower_id: null,
              user_id: selectedUser?.id,
              media_id: selectedUser?.files[0],
              isFollow: true,
            },
          ])
          .select();
        getFollowDetails();
      }
    }
    //make it function on next build
  };
  const onImagePress = () => {
    setCount(prevCount => prevCount + 1);
  };

  const onLikePressHandler = async () => {
    setCount(0);
    if (validateUser()) {
      if (!isPresent) {
        dispatch(addLikedImages(selectedUser));
      } else {
        dispatch(removeLikedImages(selectedUser.job_id));
      }
      const present = modelImages.some(
        obj => obj.job_id === selectedUser.job_id,
      );
      setIsPresent(present);
      return;
      if (likeData.some((value: any) => value?.user_id === selectedUser?.id)) {
        await likeData.map(async (obj: any) => {
          if (obj.user_id === selectedUser?.id) {
            const {data, error} = await supabaseDynamic(
              supabaseUrl,
              supabaseKey,
            )
              .from('Like')
              .update({isLike: !obj?.isLike})
              .eq('user_id', selectedUser?.id)
              .select();
            let finalData: any = data;
            getLikeDetails();
            return {...obj, isLike: finalData[0]?.isLike};
          }
          return obj;
        });
      } else {
        const {data, error} = await supabaseDynamic(supabaseUrl, supabaseKey)
          .from('Like')
          .insert([
            {
              like_user_id: null,
              user_id: selectedUser?.id,
              media_id: selectedUser?.files[0],
              isLike: true,
            },
          ])
          .select();
        getLikeDetails();
      }
    }
    //make it function on next build
  };

  const handleImagePress = (item: any) => {
    setSelectedImg(item?.trim());
    const selectedIndex = selectedMore.findIndex(
      (image: any) => image.trim() === item.trim(),
    );
    if (carouselRef.current) {
      carouselRef?.current?.scrollTo({index: selectedIndex});
    }
  };

  const onSharePressHandler = async () => {
    const shareOptions = {
      message: 'Try Cool Clothes with AI ',
      url: `https://styley.ai/home86?id=${selectedUser?.id}`,
      failOnCancel: false,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {}
  };

  const onShopStylePressHandler = () => {
    if (selectedUser?.product_url) {
      Linking.openURL(selectedUser?.product_url);
    }
  };
  const onCartPress = () => {
    if (validateUser()) {
    }
  };
  const getExtention = (filename: string) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const changeFlatList = (index: number) => {
    lowerListRef?.current?.scrollToIndex({index: index, animated: false});
    const imageUrl = lowerListRef?.current?.props?.data[index];
    setSelectedImg(imageUrl);
  };

  const handelDownloadPress = url => {
    setisDownload(true);
    let date = new Date();
    let image_URL = url;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.DCIMDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        setisDownload(false);
        Toast.show('Image Downloaded Successfully.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={globalStyles.bottomShadow}>
        <CommonHeader isBack navigation={navigation} />
      </View>
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: wp(5)}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.modelContainer}
            onPress={() => {
              if (validateUser()) {
                dispatch(addSelectedImage(selectedUser?.usedItems?.usedModel));
                navigation.navigate('AddPhotoAIStyle', {
                  screen: 'AddPhotoAI',
                  params: {id: 0, data: selectedUser?.usedItems?.usedModel},
                });
              }
            }}>
            {selectedUser?.usedItems?.usedModel?.img_url ? (
              <Image
                style={styles.modalImage}
                source={{
                  uri: selectedUser?.usedItems?.usedModel?.img_url,
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.modalImage, {justifyContent: 'center'}]}>
                <FontText
                  name={'low'}
                  lines={1}
                  textAlign="center"
                  size={normalize(8)}
                  color={colors.gray}>
                  {'Model not found'}
                </FontText>
              </View>
            )}
            <FontText
              name={'medium'}
              lines={1}
              size={normalize(11)}
              color={colors.black}>
              {selectedUser?.usedItems?.usedModel?.Last
                ? selectedUser?.usedItems?.usedModel?.Last
                : 'Model'}
            </FontText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modelContainer}
            onPress={() => {
              if (validateUser()) {
                dispatch(addSelectedImage(selectedUser?.usedItems?.usedStyle));
                navigation.navigate('AddPhotoAIStyle', {
                  screen: 'AddPhotoAI',
                  params: {id: 0, data: selectedUser?.usedItems?.usedStyle},
                });
              }
            }}>
            <Image
              style={styles.modalImage}
              source={{
                uri: selectedUser?.usedItems?.usedStyle['img_url'],
              }}
              resizeMode="cover"
            />
            <FontText
              name={'medium'}
              lines={1}
              size={normalize(11)}
              color={colors.black}>
              {'Style'}
            </FontText>
          </TouchableOpacity>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            width={wp(100)}
            autoPlay={false}
            data={selectedMore}
            onSnapToItem={index => {
              changeFlatList(index);
            }}
            ref={carouselRef}
            renderItem={({item}) => (
              <View style={{top: wp(4.5)}}>
                <PinchableBox imageUri={item} />
                {/* not removing for future chanegs */}
                {/* <FastImage
                  style={styles.modelImg}
                  source={{
                    uri: item,
                    priority: FastImage.priority.high,
                  }}
                /> */}
                
                <TouchableOpacity
                  style={styles.downloadIcon}
                  onPress={() => handelDownloadPress(item)}>
                  <SvgIcon.Download2 />
                )}
              </TouchableOpacity>
              <View style={styles.carouselBtnContainer}>
                <TouchableOpacity
                  style={styles.iconView}
                  onPress={onLikePressHandler}>
                  {isPresent ? <SvgIcon.FilledLike /> : <SvgIcon.Like />}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onSharePressHandler}
                  style={styles.iconViewShare}>
                  <SvgIcon.Share2 />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <FlatList
          horizontal
          ref={lowerListRef}
          showsHorizontalScrollIndicator={false}
          style={{alignSelf: 'center'}}
          data={selectedMore}
          keyExtractor={index => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  handleImagePress(item);
                }}>
                <FastImage
                  style={[
                    styles.listImg,
                    {
                      borderWidth: item?.trim() === selectedImg ? wp(0.7) : 0,
                      borderColor: colors.blue,
                    },
                  ]}
                  source={{
                    uri: item?.trim(),
                    priority: FastImage.priority.high,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
        <FontText
          pTop={wp(4)}
          textAlign={'center'}
          name={'extraBold'}
          size={normalize(14)}
          color={colors.black}>
          {'More like this'}
        </FontText>
        {isLoading ? (
          <View>
            <View style={{marginTop: 30}}>
              <Loading isColor={colors.black} />
            </View>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={[{marginVertical: wp(1)}]}
            contentContainerStyle={[
              {paddingBottom: wp(10), alignSelf: 'center'},
            ]}
            numColumns={2}
            data={moreLike}
            keyExtractor={(item: IList) => item.id.toString()}
            ListEmptyComponent={null}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.listStyle}
                  onPress={() => {
                    setSelectedImg(item?.results[0]?.trim());
                    setSelectedMore(item?.results);
                    setSelectedUser(item);
                    scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
                  }}>
                  <FastImage
                    source={{
                      uri: item?.results[0],
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.modelImage}></FastImage>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </ScrollView>
      <View style={[globalStyles.rowJB, styles.buttonView]}>
        <Button
          onPress={() => {
            if (validateUser()) {
              dispatch(addSelectedImage(selectedUser?.usedItems?.usedStyle));
              navigation.navigate('AddPhotoAIStyle', {
                screen: 'AddPhotoAI',
                params: {id: 0, data: selectedUser?.usedItems?.usedStyle},
              });
            }
          }}
          buttonColor={colors.black}
          style={styles.btnStyle}
          labelStyle={[styles.btnLabel, {color: colors.white}]}
          mode="contained">
          {'Use Style'}
        </Button>
        <Button
          onPress={() => {
            if (validateUser()) {
              dispatch(addSelectedImage(selectedUser?.usedItems?.usedModel));
              navigation.navigate('AddPhotoAIStyle', {
                screen: 'AddPhotoAI',
                params: {id: 1, data: selectedUser?.usedItems?.usedModel},
              });
            }
          }}
          buttonColor={colors.black}
          style={styles.btnStyle}
          labelStyle={[styles.btnLabel, {color: colors.white}]}
          mode="contained">
          {'Use Model'}
        </Button>
      </View>
      <LogInBottomSheet modalizeRef={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  carouselContainer: {
    height: hp(42.7),
    marginVertical: wp(1.6),
    marginBottom: hp(-0.2),
  },
  loader: {
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp(0.7),
    top: wp(0.8),
  },
  downloadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
    marginVertical: wp(1),
    bottom: wp(0),
    left: wp(3),
    position: 'absolute',
    height: wp(10),
    width: wp(10),
  },
  modalImage: {
    borderWidth: 0.3,
    borderRadius: 10,
    width: wp(22),
    height: hp(13),
  },
  modelContainer: {
    justifyContent: 'center',
    width: wp(25),
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    top: hp(1),
    alignSelf: 'center',
    marginBottom: hp(-3.2),
  },

  profileImg: {
    height: wp(9),
    width: wp(9),
    borderRadius: wp(5),
    marginLeft: wp(3),
    marginRight: wp(3),
  },
  headerView: {
    paddingLeft: wp(1),
    paddingRight: wp(5),
    paddingBottom: wp(1.5),
  },
  modelImg: {
    height: wp(96),
    width: wp(99),
    alignSelf: 'center',
    marginTop: wp(4),
  },
  listImg: {
    height: wp(28),
    width: wp(28),
    marginHorizontal: wp(0.8),
    marginTop: wp(2),
    backgroundColor: colors.lightGray,
  },
  otherImg: {
    width: wp(94),
    height: wp(40),
    alignSelf: 'center',
    borderRadius: wp(2),
    marginBottom: wp(2),
  },
  modelImage: {
    width: wp(49),
    height: wp(49),
  },
  listStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(0.4),
  },
  iconView: {
    top: wp(8),
    padding: wp(2),
    marginRight: wp(2),
    height: wp(10),
    width: wp(10),
    right: wp(28),
    marginVertical: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconViewShare: {
    top: wp(8),
    padding: wp(2),
    marginRight: wp(2),
    height: wp(10),
    width: wp(10),
    left: wp(1),
    marginVertical: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderColor: colors.white,
    borderWidth: 2,
    width: wp(45),
    height: wp(15),
    paddingVertical: wp(1),
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    justifyContent: 'center',
  },
  buttonView: {
    marginHorizontal: wp(3),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: wp(3),
  },
  btnLabel: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: colors.black,
  },
  longPressView: {
    flex: 1,
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray2,
  },
  longPressText: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
  },
  carouselBtnContainer: {
    position: 'absolute',
    bottom: hp(3.8),
    right: wp(4),
    flexDirection: 'row',
  },
});
