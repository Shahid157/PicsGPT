/* eslint-disable react/self-closing-comp */
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {isIOS, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcon} from '../../assets';
import {CommonHeader, FontText, Input, Loading} from '../../components';
import globalStyles from '../../styles';
import FilterOption from './FilterOption';
import {requestPermission} from '../../helpers/PushNotification';
import LoginBottomSheet from '../../components/LogInBottomSheet/Index';
import {Modalize} from 'react-native-modalize';
import {fetchSearchInfer, searchUserGenerations} from '../../api/homeApi';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {trackingJobApi} from '../../api/styleDiffusionApi';
import {authActions, jobActions} from '../../store/actions';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import {delay} from '../../helpers/validation';
import {jobInterface} from '../../interfaces/appCommonIternfaces';
import {jobStatus} from '../../constants/appConstants';
import supabaseTables from '../../constants/supabaseTables';
import updateCredit from '../../api/fashion/update_Credits';
import userPaymentsAction from '../../store/actions/userPayments.action';
import {Toast, useToast} from 'react-native-toast-notifications';
import BackgroundService from 'react-native-background-actions';
import {AppDispatch, RootState} from '../../store';
import {normalize} from '../../styles/responsiveScreen';
import {hp} from '../../constants';
import Share from 'react-native-share';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import ContentBottomSheet from '../../components/SampleBottomContent/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getInProgressJobs} from '../../utils/helpers';


interface HomeProps {
  navigation?: any;
  route?: any;
}

const veryIntensiveTask = async (dispatch: AppDispatch, page: number) => {
  try {
    await fetchSearchInfer(page, dispatch);
  } catch (error) {
    // handel error
  }
};

const options = {
  taskName: 'HomeScreenDataFetch',
  taskTitle: 'Fetching Home Screen Data',
  taskDesc: 'Background task to fetch data for the home screen',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: '',
  parameters: {
    delay: 600000,
  },
};

export default function Home({navigation, route}: HomeProps) {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState<string>('');
  const [filter, setFilter] = useState<string>('Trending');
  const [filterEnable, setFilterEnable] = useState<boolean>(false);
  const [genResultdata, setGenResultdata] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [showSearch, setShowSearch] = useState<any>(false);
  const [isHide, setIsHide] = useState(false);
  const fadeInOpacity = useSharedValue(0);
  const [gender, setGender] = useState<{name: string; isSelected: boolean}[]>([
    {name: 'All', isSelected: true},
    {name: 'Males', isSelected: false},
    {name: 'Females', isSelected: false},
  ]);
  const [trendingEnable, setTrendingEnable] = useState(false);
  const [trending, setTrending] = useState<
    {name: string; isSelected: boolean}[]
  >([
    {name: 'Trending', isSelected: true},
    {name: 'Newest', isSelected: false},
    {name: 'Most Liked', isSelected: false},
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const bottomSheetRef = useRef<Modalize>(null);
  const contentSheetRef = useRef<Modalize>(null);
  const auth = useSelector((state: {auth: any}) => state.auth);
  const {jobs} = useSelector((state: {jobs: any}) => state.jobs);
  const runningJob = useSelector(state => state.jobs.runningJobs);
  const modelImages = useSelector(state => state?.likedModals);
  const paymentState = useSelector((state: RootState) => state.payments);
  const [isDownload, setIsDownload] = useState(false);
  const [longPressed, setLongPressed] = useState(false);
  const [longPressedItem, setLongPressedItem] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);

  useEffect(() => {
    if (!auth.rememberMe) {
      dispatch(authActions.logout({}));
      bottomSheetRef.current?.open();
    }
    checkFirstAttention();
    checkNotificationPermission();
    getDetails();
    fetchDataOnBackground();
  }, []);
  const checkFirstAttention = async () => {
    let data = await AsyncStorage.getItem('ComesFirst');
    if (!data) {
      contentSheetRef.current?.open();
    }
  };
  const setFirstAttention = async () => {
    await AsyncStorage.setItem('ComesFirst', 'true');
    contentSheetRef.current?.close();
  };

  useEffect(() => {
    if (filter === 'Most Liked') {
      setFilterData(modelImages);
    }
  }, [modelImages]);

  const fetchDataOnBackground = async () => {
    try {
      await BackgroundService.start(
        () => veryIntensiveTask(dispatch, page),
        options,
      );
      return () => {
        BackgroundService.stop();
      };
    } catch (error) {
      //handel error
    }
  };
  let intervalIds: any = [];
  useEffect(() => {
    const fetchData = async () => {
      let inProgressJobs = getInProgressJobs(jobs || []);
      if (inProgressJobs?.length > 0) {
        await trackingAIApi(inProgressJobs);
      }
    };
    fetchData();
  }, [jobs?.length, runningJob?.length]);

  const trackingAIApi = async (results: jobInterface[]) => {
    let uploaded: any = [];
    for (let index = 0; index < results?.length; index++) {
      const job: jobInterface = results[index];
      const {user_id, job_id, generate_id, usedItems} = job;
      if (intervalIds.find((job: any) => job.job_id === job_id)) return;
      const intervalId = setInterval(async () => {
        try {
          const response = await trackingJobApi(job_id, dispatch, job);
          console.log(
            'TRACKING JOB STATUS ' +
              response.status +
              ' WITH INTERVAL ID ' +
              intervalId +
              ' JOB ID ' +
              job_id +
              ' ON INDEX ' +
              index.toString(),
          );
          if (response.status != null) {
            dispatch(
              jobActions.updateJob({
                ...job,
                ...response,
              }),
            );
            await delay(1000, true);
          }

          if (response?.status === jobStatus.failed) {
            // dispatch(jobActions?.deleteJob(job_id));
            await updateCredit(user_id, 'add', 1);
            await dispatch(
              userPaymentsAction.updateUserCredits({
                credit_left: paymentState.credit_left + 1,
              }),
            );
            // showToast(
            //   '1 credit added to your account due to failed generation',
            //   'top',
            //   'error',
            // );
          }
          if (
            response?.status === jobStatus.complete ||
            response?.status === jobStatus.failed
          ) {
            if (response?.status === jobStatus.complete) {
              await supabaseDynamic(supabaseUrl, supabaseKey)
                .from(supabaseTables.singleIdGenerations)
                .insert({
                  user_id,
                  job_id,
                  generate_id,
                  photo_style: usedItems?.usedStyle || {},
                  selected_model: usedItems?.usedModel || {},
                })
                .select('*');
            }
            await supabaseDynamic(supabaseUrl, supabaseKey)
              .from(supabaseTables.singleIDUsergeneration)
              .update({
                results: response?.files,
                status: response?.status,
              })
              .eq('job_id', job_id)
              .eq('user_id', user_id);
            (response?.files || []).forEach(async (url: string) => {
              let result = {
                user_id: user_id,
                job_id: job_id,
                results: url,
                type: 'single_id',
              };

              await supabaseDynamic(supabaseUrl, supabaseKey)
                .from(supabaseTables.allResults)
                .insert(result)
                .select('*');
            });

            clearInterval(intervalId);
          }
        } catch (e) {
          console.log('e.....', e);
        }
      }, 10000);
      intervalIds.push({job_id, intervalId});
    }
    await delay(1000, true);
    return Promise.resolve(uploaded);
  };

  const checkNotificationPermission = () => {
    if (isIOS) {
      requestPermission();
    }
  };

  const getDetails = async () => {
    const newData: any = await fetchSearchInfer(page, dispatch);
    setPage(page + 1);
    setGenResultdata([...genResultdata, ...newData]);
    if (filter !== 'Most Liked') {
      setFilterData([...genResultdata, ...newData]);
    }
  };

  const onSingleChoicePress = async (inx: number, item?: any) => {
    if (trendingEnable) {
      const data = trending.map((item, index) => {
        if (inx === index) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setTrending(data);
      let finalRes;
      if (item?.name === 'Trending') {
        setFilter('Trending');
        finalRes = genResultdata;
      } else if (item?.name === 'Newest') {
        setFilter('Newest');
        finalRes = await fetchSearchInfer(1, dispatch);
      } else if (item?.name === 'Most Liked') {
        setFilter('Most Liked');
        finalRes = modelImages;
      }
      setFilterData(finalRes);
    } else {
      const data = gender.map((item, index) => {
        if (inx === index) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setGender(data);
      let finalRes;
      if (item?.name === 'All') {
        finalRes = genResultdata;
      } else if (item?.name === 'Females') {
        finalRes = genResultdata?.filter(function (e?: any) {
          return e?.usedItems?.usedModel?.gender === 'woman';
        });
      } else if (item?.name === 'Males') {
        finalRes = genResultdata?.filter(function (e?: any) {
          return e?.usedItems?.usedModel?.gender === 'man';
        });
      }

      setFilterData(finalRes);
    }
  };

  const searchUserGeneration = async (text: any) => {
    const response = await searchUserGenerations(text);

    setFilterData(response);
  };

  const onSearchTextInput = (text: any) => {
    setSearchInput(text);
    if (text?.length >= 3) {
      searchUserGeneration(text);
    } else if (text?.length === 0) {
      getDetails();
    }
  };

  let data = {
    title: 'Create it. Believe it. Live it',
    subTitle: 'Explore feed for coolest Styleys',
    discription: `Create awesome, fun and stylish pics with Styley AI. Just pick the styles of images you like and upload 5+ selfies to create new images of you.`,
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInOpacity.value,
    };
  });

  const getExtention = (filename: string) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const handelDownloadPress = url => {
    setIsDownload(true);
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
        setIsDownload(false);
        Toast.show('Image Downloaded Successfully.');
      });
  };
  const handelHide = (item: any) => {
    setIsHide(true);
    setHiddenItems([...hiddenItems, item]);
    setLongPressed(false);
    setIsHide(false);
  };
  const handelUnHide = (item: any) => {
    const updatedHiddenItems = hiddenItems.filter(
      data => data.job_id !== item.job_id,
    );
    setHiddenItems(updatedHiddenItems);
  };

  const onSharePressHandler = async (item: any) => {
    const shareOptions = {
      message: 'Try Cool Clothes with AI ',
      url: `https://styley.ai/home86?id=${item.id}`,
      failOnCancel: false,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {}
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={globalStyles.bottomShadow}>
          <CommonHeader
            search
            filter
            onChangeSearchText={(text: string) => onSearchTextInput(text)}
            searchInput={searchInput}
            filterPress={() => {
              setFilterEnable(false);
              setTrendingEnable(!trendingEnable);
            }}
          />
        </View>
        {trendingEnable || filterEnable ? (
          <FilterOption
            filterOption={
              trendingEnable ? trending : filterEnable ? gender : []
            }
            onItemPress={onSingleChoicePress}
          />
        ) : null}

        {filterData?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={[{zIndex: -1}]}
            contentContainerStyle={[{alignSelf: 'center'}]}
            numColumns={2}
            data={filterData}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (searchInput?.length >= 3 || filter === 'Most Liked') {
                //do nthing
              } else {
                getDetails();
              }
            }}
            renderItem={({item}: {item: any}) => {
              return (
                <View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.listStyle}
                    onPress={async () => {
                      setLongPressed(false);
                      navigation.navigate('ModelDisplay', {modelDetails: item});
                    }}
                    onLongPress={() => {
                      setLongPressed(true);
                      setLongPressedItem(item);
                    }}>
                    <FastImage
                      source={{
                        uri: item?.results[0],
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={styles.modelImage}
                    />
                  </TouchableOpacity>
                  {hiddenItems.some(
                    (data: any) => data?.job_id === item?.job_id,
                  ) && (
                    <View style={styles.mainOverlyContainer}>
                      <View style={[styles.overlay, {opacity: 0.85}]} />
                      <TouchableOpacity onPress={() => handelUnHide(item)}>
                        <SvgIcon.Eye style={styles.eye} />
                      </TouchableOpacity>
                    </View>
                  )}
                  {item.job_id === longPressedItem.job_id &&
                    longPressed &&
                    !isHide &&
                    !hiddenItems.some(
                      (data: any) => data?.job_id === item?.job_id,
                    ) && (
                      <View style={styles.pressActionContainer}>
                        <View style={styles.hideIconContainer}>
                          <TouchableOpacity
                            style={styles.hideIcon}
                            onPress={() => handelHide(item)}>
                            <SvgIcon.Hide />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.actionsIconContainer}>
                          <View>
                            <TouchableOpacity
                              style={styles.downloadIcon}
                              onPress={() =>
                                handelDownloadPress(item?.results[0])
                              }>
                              {isDownload ? (
                                <Loading
                                  isColor={colors.black}
                                  style={{borderRadius: wp(6)}}
                                  size="small"
                                />
                              ) : (
                                <SvgIcon.Download2 />
                              )}
                            </TouchableOpacity>
                          </View>
                          <View>
                            <TouchableOpacity
                              style={styles.shareIcon}
                              onPress={() => onSharePressHandler(item)}>
                              <SvgIcon.Share2 />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                </View>
              );
            }}
          />
        ) : (
          !isLoading && (
            <View style={globalStyles.flexCenter}>
              <SvgIcon.Styley/>
              <FontText textAlign='center' name={'medium'} size={normalize(15)}>
                {'No Result Found'}
              </FontText>
            </View>
          )
        )}
        <ContentBottomSheet
          data={data}
          onButtonPress={() => {
            setFirstAttention();
          }}
          modalizeRef={contentSheetRef}
        />
        <LoginBottomSheet modalizeRef={bottomSheetRef} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: 'center',
    marginTop: hp(0.5),
    marginBottom: hp(1),
  },
  filter: {marginHorizontal: wp(3), padding: wp(2.5)},
  modelImage: {
    width: wp(49),
    height: wp(49),
    borderRadius: wp(1),
  },
  processingView: {
    width: wp(100),
    position: 'absolute',
    zIndex: 9999,
    backgroundColor: colors.white,
    paddingHorizontal: wp(8),
  },
  finalImg: {
    height: wp(18),
    width: wp(18),
    borderRadius: wp(1),
  },
  iconView: {
    borderWidth: 1,
    borderRadius: wp(2),
    borderColor: colors.gray4,
    paddingHorizontal: wp(2.2),
    paddingVertical: wp(2.2),
  },
  popUpHandle: {
    width: wp(37),
    height: wp(1.2),
    borderRadius: wp(3),
    backgroundColor: colors.gray900,
    alignSelf: 'center',
    marginBottom: wp(3),
    marginTop: wp(5),
  },
  closeIcon: {
    position: 'absolute',
    right: wp(6),
    top: wp(1),
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
  },
  listStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(0.5),
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pressActionContainer: {
    position: 'absolute',
    width: wp(48),
    height: wp(48),

    borderRadius: wp(1),
    top: wp(0.6),
    left: wp(0.8),
    justifyContent: 'flex-end',
  },
  actionsIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hideIconContainer: {
    left: wp(40.9),
  },
  hideIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(7),
    width: wp(7),
    borderRadius: wp(3.5),
  },
  downloadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(7),
    width: wp(7),
    borderRadius: wp(3.5),
  },
  shareIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(7),
    width: wp(7),
    borderRadius: wp(3.5),
  },
  mainOverlyContainer: {
    position: 'absolute',
    top: wp(0.7),
    left: wp(0.6),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    width: wp(48),
    height: wp(48),
    borderRadius: wp(1),
  },
  eye: {
    top: wp(20),
    left: wp(20),
    padding: wp(5),
  },
});
