import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../../assets/colors';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-reanimated-carousel';
import {wp, hp} from '../../constants';
import {CommonHeader, FontText, Loading} from '../../components';
import SvgIcon from '../../assets/SvgIcon';
import {Switch} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import {useToast} from 'react-native-toast-notifications';

import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';
import {SUPABASE_KEY, SUPABASE_URL} from '@env';
import supabaseTables from '../../constants/supabaseTables';
import {useDispatch, useSelector} from 'react-redux';
import ResultsSkelton from '../../components/ResultsSkelton/ResultsSkelton';
import Share from 'react-native-share';
import {jobInterface} from '../../interfaces/appCommonIternfaces';
import {
  dataModes,
  photoAIAPIHeaders,
  photoAIConstants,
} from '../../constants/appConstants';
import {postRequestApi} from '../../utils/AxiosHelper';
import {
  photoAICreditStatus,
  photoAIJobPriorities,
} from '../../constants/photoAIConstants';
import {jobActions} from '../../store/actions';
import PinchableBox from '../../components/PinchableBox';
import {saveSingleIDGeneration} from '../../api/fashion/single-id-generations';

export default function ImageViewer({route}: any) {
  const carouselRef = useRef(null);
  const jobID = route?.params?.jobID || [];
  const [selectedImg, setSelectedImg] = useState([]);
  const [files, setFiles] = useState([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedUser, setSelectedUser] = useState();
  const [isLoading, setisLoading] = useState(Boolean);
  const [data, setData] = useState([]);
  const [retry, setRetry] = useState(false);
  const userId = useSelector((state: {auth: any}) => state?.auth?.userId);
  const toast = useToast();
  const upperListRef = useRef(null);
  const lowerListRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getJobByID(jobID);
  }, [jobID]);
  useEffect(() => {}, [retry]);
  const getJobByID = async (jobID: string) => {
    const jobDetail = await supabaseDynamic(SUPABASE_URL, SUPABASE_KEY)
      .from(supabaseTables.singleIDUsergeneration)
      .select('*')
      .eq('job_id', jobID);
    if (jobDetail?.data?.length) {
      let jobDetails: jobInterface = jobDetail?.data[0];
      setSelectedImg(jobDetails?.results[0]);
      setIsPrivate(jobDetails?.private);
      setFiles(jobDetails?.results);
      setData(jobDetails);
      setSelectedUser(jobDetails.id);
    }
  };

  const handelPublic = async () => {
    const {error} = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from(supabaseTables.singleIDUsergeneration)
      .update({private: !isPrivate})
      .eq('job_id', jobID)
      .eq('user_id', userId)
      .select();
    setIsPrivate(!isPrivate);
    if (error) {
      setIsPrivate(!isPrivate);
    }
  };

  const handleImagePress = (item: any) => {
    setSelectedImg(item?.trim());
    const selectedIndex = files.findIndex(
      (image: any) => image.trim() === item.trim(),
    );
    if (carouselRef.current) {
      carouselRef?.current?.scrollTo({index: selectedIndex});
    }
  };

  const changeFlatList = (index: number) => {
    lowerListRef?.current?.scrollToIndex({index: index, animated: false});
    upperListRef?.current?.scrollToIndex({index: index, animated: false});
    const imageUrl = lowerListRef?.current?.props?.data[index];
    setSelectedImg(imageUrl);
  };

  const handelDownloadPress = () => {
    setisLoading(true);
    let date = new Date();
    let image_URL = selectedImg;
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
        setisLoading(false);
        toast.show('Image downloaded Sucessfully', {
          type: 'success',
          placement: 'top',
          duration: 1500,
          animationType: 'slide-in',
        });
      });
  };

  const getExtention = (filename: string) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const onSharePressHandler = async () => {
    const shareOptions = {
      message: 'Try Cool Clothes with AI ',
      url: `https://styley.ai/home86?id=${selectedUser}`,
      failOnCancel: false,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {}
  };
  const user = useSelector((state: {auth: any}) => state?.auth?.user);
  const retryApi = async (style: any) => {
    setRetry(true);
    const end_point = '/api/v1/deployments';

    const Prompt = style?.usedItems?.usedStyle?.prompt;
    const data = {
      name: photoAIConstants.name,
      model_id: photoAIConstants.photoAIModelID,
      args: {
        Gender: style.usedItems?.usedModel?.gender,
        Model_images: style?.usedItems?.usedModel?.collection.join(','),
        Prompt,
        Style: 'photo',
      },
    };

    postRequestApi(end_point, data, photoAIAPIHeaders)
      .then(async (response: any) => {
        let {id} = response || {};
        const job_id = response?.job?.id;
        const jobid = response?.job_id;
        const status = response.status;

        const job: jobInterface = {
          user_id: user?.id,
          generate_id: id,
          job_id,
          results: null,
          usedItems: {
            usedModel: style?.usedItems?.usedModel,
            usedStyle: style?.usedItems?.usedStyle,
          },
          priority: photoAIJobPriorities.free,
          private: true,
          emailed: null,
          status: response?.status,
          credit_status: photoAICreditStatus.deducted,
          user_email: user?.email,
        };

        dispatch(jobActions.runningJob(job));
        const respon = await saveSingleIDGeneration(
          dataModes.update,
          job,
          'pending',
          style?.job_id,
        );

        dispatch(
          jobActions.updateJobStatus({
            existingJobId: style.job_id,
            newJobId: jobid,
            newStatus: status,
          }),
        );
        toast.show('Job regeneration started successfully', {
          type: 'success',
          placement: 'top',
          duration: 1500,
          animationType: 'slide-in',
        });
        setRetry(false);
      })
      .catch(e => {
        console.log('error ', e);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <CommonHeader isBack />
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        {files?.length ? (
          <>
            <View style={styles.upperImagesContainer}>
              <FastImage
                style={styles.upperImages}
                source={{uri: data?.usedItems?.usedModel?.img_url}}
                resizeMode="contain"
              />

              <FastImage
                style={styles.upperImages}
                resizeMode="contain"
                source={{uri: data?.usedItems?.usedStyle?.['img_url']}}
              />
            </View>
            <View style={styles.carouselContainer}>
              <Carousel
                width={wp(100)}
                data={files}
                // style={{marginTop: wp(0.2)}}
                onSnapToItem={index => {
                  changeFlatList(index);
                }}
                ref={carouselRef}
                renderItem={({item, index}) => (
                  <View key={index}>
                    <PinchableBox imageUri={item} />
                    {/* not removing for future chnages */}
                    {/* <FastImage
                      style={styles.carouselImage}
                      source={{
                        uri: item,
                        priority: FastImage.priority.high,
                      }}
                      // resizeMode="contain"
                    /> */}
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        style={styles.downloadIcon}
                        onPress={() => handelDownloadPress()}>
                        <SvgIcon.Download2 />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.retryIcon}
                        onPress={() => retryApi(data)}>
                        <SvgIcon.recreate style={{padding: wp(2.8)}} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.shareBtn}
                        onPress={onSharePressHandler}>
                        <SvgIcon.Share2 />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
            <View style={styles.flatListContainer}>
              <FlatList
                ref={lowerListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={files}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleImagePress(item)}
                      key={index}>
                      <FastImage
                        style={[
                          styles.listImg,
                          {
                            borderWidth: selectedImg === item ? 2 : 0,
                            borderColor:
                              selectedImg === item ? colors.blue : colors.white,
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
            </View>
          </>
        ) : (
          <ResultsSkelton />
        )}
        <View style={styles.toolsContainer}>
          <View style={{flexDirection: 'row', marginLeft: wp(-5)}}>
            <TouchableOpacity style={[styles.icons, {paddingLeft: wp(1)}]}>
              <SvgIcon.MagicWand style={{borderRightWidth: 1}} />
              <View style={styles.iconRightBar}></View>
              <FontText style={styles.iconLabels}>Location</FontText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.icons, {paddingLeft: wp(2)}]}>
              <SvgIcon.Eraser2 />
              <View style={styles.iconRightBar}></View>
              <FontText style={styles.iconLabels}>Eraser</FontText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.icons, {paddingLeft: wp(3)}]}>
              <SvgIcon.Scale />
              <FontText style={styles.iconLabels}>UpScale</FontText>
            </TouchableOpacity>
          </View>
          <View style={styles.switchContainer}>
            <FontText style={styles.switchLabel}>Private </FontText>
            <TouchableOpacity>
              <Switch
                value={!isPrivate}
                color={colors.blue}
                onValueChange={handelPublic}
              />
            </TouchableOpacity>
            <FontText style={styles.switchLabel}> Public</FontText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  upperImagesContainer: {
    height: hp(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  upperImages: {
    height: wp(23.2),
    width: wp(25),
    margin: wp(0.1),
  },
  carouselContainer: {
    height: hp(42.7),
    marginVertical: wp(1.6),
  },
  carouselImage: {
    width: wp(99),
    height: hp(43.5),
    alignSelf: 'center',
  },
  tick: {
    position: 'absolute',
    top: wp(13),
    left: wp(13),
  },
  flatListContainer: {
    height: hp(11.7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolsContainer: {
    height: hp(8),
    width: wp(90),
    borderBottomWidth: wp(0.2),
    paddingTop: wp(2),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
    flexDirection: 'row',
  },
  listImg: {
    height: wp(25),
    width: wp(25),
    marginHorizontal: wp(0.8),
    backgroundColor: colors.lightGray,
  },
  shareBtn: {
    height: wp(10),
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    height: hp(5),
    width: wp(98.5),
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: wp(3),
    paddingHorizontal: wp(2),
  },

  iconRightBar: {
    borderRightWidth: 1,
    height: wp(6),
    position: 'absolute',
    left: wp(13.5),
    borderRightColor: colors.gray,
  },
  icons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginVertical: wp(1),
    paddingLeft: wp(1),
  },
  iconLabels: {
    alignSelf: 'center',
    marginTop: wp(1),
    fontSize: 9,
  },
  downloadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(10),
    width: wp(10),
  },
  retryIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(10),
    width: wp(10),
    borderRadius: wp(6),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignSelf: 'center',
    alignItems: 'center',
    borderTopColor: colors.gray,
    marginLeft: wp(3),
    marginBottom: wp(2),
  },
  switchLabel: {
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: wp(25),
    width: wp(25),
    left: wp(0.5),
  },

  loader: {
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp(0.1),
    top: wp(0.1),
  },
});
