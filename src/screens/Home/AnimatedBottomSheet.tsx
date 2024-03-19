import React, {ReactNode, useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as RNAnimated,
  ActivityIndicator,
} from 'react-native';
import fonts from '../../assets/fonts';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import Animated, {SlideInUp, SlideOutDown} from 'react-native-reanimated';
import {hp} from '../../constants';
import {FontText} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import {useAppDispatch} from '../../store/hooks';
import {postRequestApi} from '../../utils/AxiosHelper';
import {SvgIcon, colors} from '../../assets';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import {jobInterface} from '../../interfaces/appCommonIternfaces';
import FastImage from 'react-native-fast-image';
import {jobStatus} from '../../constants/appConstants';
import {photoAIConstants} from '../../constants/appConstants';
import {photoAIAPIHeaders} from '../../constants/appConstants';
import {photoAIJobPriorities} from '../../constants/photoAIConstants';
import {photoAICreditStatus} from '../../constants/photoAIConstants';
import {jobActions} from '../../store/actions';
import {saveSingleIDGeneration} from '../../api/fashion/single-id-generations';
import {dataModes} from '../../constants/appConstants';
import {GoTrueClient} from '@supabase/supabase-js';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import fetchUserGeneration from '../../api/fashion/fetch-user-generation';
import getUserPaymentsAndCredits from '../../api/fashion/get_user_payments';
import userPaymentsAction from '../../store/actions/userPayments.action';

type AnimatedBottomSheetProps = {
  backdropOnPress: () => void;
  onCloseIconPress?: () => void;
  onInfoIconPress?: () => void;
  onDeleteIconPress?: () => void;
  onRetryIconPress?: () => void;
  onEyePress?: (job_id: string) => void;
  show: boolean;
  isOpen: boolean;
  navigation?: any;
  children?: ReactNode;
};

const AnimatedBottomSheet = ({
  isOpen,
  onCloseIconPress,
  onEyePress,
  onDeleteIconPress,
  onInfoIconPress,
  onRetryIconPress,
  show,
}: AnimatedBottomSheetProps) => {
  const {jobs} = useSelector((state: {jobs: any}) => state.jobs);
  const {userId} = useSelector((state: any) => state.auth);
  const [hideCompletedJobs, setHideCompletedJobs] = useState<boolean>(show);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let inProgressJobs = jobs.filter(
    (job: jobInterface) =>
      job.status === jobStatus.pending ||
      job.status === jobStatus.docker_pulling ||
      job.status === jobStatus.training ||
      job.status === jobStatus.running,
  );

  const user = useSelector((state: {auth: any}) => state?.auth?.user);

  const retryApi = async (style: any) => {
    const end_point = '/api/v1/deployments';
    setLoading(false);

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

        await saveSingleIDGeneration(
          dataModes.update,
          job,
          'pending',
          style?.job_id,
        );
        dispatch(jobActions.runningJob(jobid));
        dispatch(
          jobActions.updateJobStatus({
            existingJobId: style.job_id,
            newJobId: jobid,
            newStatus: status,
          }),
        );
      })
      .catch(e => {
        console.log('error ', e);
      });
  };

  const onDelete = async id => {
    dispatch(jobActions.deleteJob(id));
    saveSingleIDGeneration('delete', id);
  };

  return (
    <Modal
      style={{
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width + 5,
        marginLeft: wp(-1),
        marginTop: hp(20),
      }}
      hasBackdrop={true}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onRequestClose={onCloseIconPress}
      onBackdropPress={onCloseIconPress}
      backdropColor="none"
      isVisible={isOpen}>
      <SafeAreaView>
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutDown}
          style={[styles.view]}>
          <View style={styles.heading}>
            <FontText
              name={'medium'}
              style={{marginLeft: wp(1.5)}}
              size={normalize(20)}
              color={colors.black}>
              {jobs?.length ? 'Processing' : null}
            </FontText>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={onCloseIconPress}
              style={styles.closeIcon}>
              <SvgIcon.WhiteClose style={{padding: wp(1.4)}} />
            </TouchableOpacity>
          </View>

          {jobs?.length ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
              data={
                (hideCompletedJobs && show) ||
                jobs?.length === inProgressJobs?.length
                  ? inProgressJobs
                  : jobs
              }
              nestedScrollEnabled
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}: {index: number; item: jobInterface}) => {
                const percentage: any = item
                  ? item?.status === jobStatus.failed ||
                    item?.status === jobStatus.complete
                    ? 1
                    : item?.etr > item?.eta
                    ? 0
                    : (100 - (item?.etr / item?.eta) * 100) / 100
                  : 0;
                const creationTime = new Date(item.created_at);
                const currentTime = new Date();
                const timeDifference: number =
                  Number(currentTime) - Number(creationTime);
                const hoursDifference = timeDifference / (1000 * 60 * 60);
                const isMoreThan3Hours =
                  hoursDifference > 3 &&
                  item?.status != jobStatus?.complete &&
                  item?.status != jobStatus?.failed;

                return (
                  <View style={styles.mainListView}>
                    <View style={styles.imageContainer}>
                      <FastImage
                        style={[styles.finalImg]}
                        source={{
                          uri: item?.usedItems?.usedModel?.img_url,
                        }}
                      />
                      <FastImage
                        style={[styles.finalImg]}
                        source={{
                          uri: item?.usedItems?.usedStyle?.img_url,
                        }}
                      />
                    </View>
                    <View style={styles.progressContainer}>
                      <ProgressBar
                        height={wp(1.8)}
                        style={{
                          width:
                            item?.status === jobStatus.complete
                              ? wp(40)
                              : item?.status === jobStatus.failed
                              ? wp(28)
                              : wp(50),
                        }}
                        progress={percentage ? percentage : 0}
                        color={
                          item?.status === 'failed' ? colors.red : colors.black
                        }
                        unfilledColor={colors.gray}
                        borderWidth={0}
                      />

                      {item?.status != jobStatus.complete &&
                        item?.status != jobStatus.failed && (
                          <FontText
                            style={{marginTop: wp(-3.5)}}
                            name={'medium'}
                            size={normalize(19)}
                            pLeft={wp(3)}
                            color={colors.red}>
                            {item?.status === jobStatus.failed ||
                            item?.status === jobStatus.complete
                              ? '100%'
                              : ''}
                          </FontText>
                        )}
                      <FontText
                        style={{marginTop: wp(1)}}
                        name={'medium'}
                        size={normalize(10)}
                        color={colors.gray500}>
                        {`Status:   ${
                          item?.status === jobStatus.docker_pulling ||
                          item?.status === null
                            ? jobStatus.pending
                            : item?.status
                        }`}
                      </FontText>
                    </View>
                    <View>
                      {isMoreThan3Hours && (
                        <View
                          style={{
                            ...styles.failedIconBarView,
                            width: wp(20),
                            marginBottom: wp(1.5),
                          }}>
                          <Pressable
                            onPress={async () => {
                              await saveSingleIDGeneration(
                                dataModes.update,
                                item,
                                'failed',
                                item?.job_id,
                              );

                              dispatch(
                                jobActions.updateJobStatus({
                                  existingJobId: item.job_id,
                                  newJobId: item.job_id,
                                  newStatus: 'failed',
                                }),
                              );
                            }}
                            style={{
                              marginLeft: wp(-4),
                              top: wp(-5.5),
                            }}>
                            <SvgIcon.blackClose />
                          </Pressable>
                        </View>
                      )}
                      {item?.status === jobStatus.complete &&
                        item?.status != jobStatus.failed && (
                          <View>
                            <Pressable
                              onPress={() => onEyePress(item.job_id)}
                              style={[styles.iconView]}>
                              <SvgIcon.EyeWhite style={{padding: wp(2.4)}} />
                            </Pressable>
                          </View>
                        )}
                      {item.status === jobStatus.failed && (
                        <View style={styles.failedIconBarView}>
                          <TouchableOpacity
                            onPress={() => {
                              setLoading(true);
                              retryApi(item);
                            }}
                            style={styles.iconView}>
                            {loading ? (
                              <ActivityIndicator
                                size="small"
                                color={colors.black}
                              />
                            ) : (
                              <SvgIcon.RetryWhite style={{padding: wp(2)}} />
                            )}
                          </TouchableOpacity>

                          <View>
                            <Pressable
                              onPress={() => {
                                onDelete(item?.job_id);
                              }}
                              style={{
                                ...styles.iconView,
                                backgroundColor: colors.deleteRed,
                              }}>
                              <SvgIcon.DeleteRed style={{padding: wp(2.4)}} />
                            </Pressable>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={() =>
                jobs?.length != inProgressJobs?.length ? (
                  <SafeAreaView style={{marginTop: wp(4), marginBottom: wp(3)}}>
                    <Pressable
                      style={styles.hideText}
                      onPress={() => setHideCompletedJobs(!hideCompletedJobs)}>
                      <Text>
                        {hideCompletedJobs ? 'Show ' : 'Hide '}
                        {jobs?.length - inProgressJobs?.length} completed jobs
                      </Text>
                    </Pressable>
                  </SafeAreaView>
                ) : null
              }
            />
          ) : (
            <View style={styles.newUserPopUp}>
              <SvgIcon.Styley />
              <FontText
                size={14}
                color={colors.black}
                style={{marginVertical: wp(5)}}>
                No jobs generated for you click on the below button to generate
                job
              </FontText>
              <Button
                style={styles.btnStyle}
                labelStyle={styles.btnLable}
                buttonColor={colors.black}
                mode="contained"
                onPress={() => {
                  onCloseIconPress();
                  navigation.navigate('AddPhotoAIStyle', {
                    screen: 'AddPhotoAI',
                  });
                }}>
                Generate Job
              </Button>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 1,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp(4.5),
    marginHorizontal: wp(3.5),
  },
  flatListContainer: {
    flexGrow: 1,
  },

  view: {
    backgroundColor: colors.white,
    paddingTop: wp(5),
    paddingHorizontal: wp(2),
    bottom: wp(20),
  },

  finalImg: {
    height: wp(15),
    width: wp(11),
    marginRight: 4,
  },
  iconView: {
    borderRadius: wp(6),
    borderColor: colors.gray4,
    backgroundColor: colors?.black,
    marginRight: wp(1),
    marginLeft: wp(1),
    height: wp(8),
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    backgroundColor: colors.black,
    borderRadius: wp(6),
    borderColor: colors.gray4,
    marginRight: wp(1),
    height: wp(8),
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hideText: {
    alignSelf: 'center',
    marginBottom: wp(2),
  },
  failedIconBarView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: wp(-1),
    right: wp(-2),
  },
  mainListView: {
    backgroundColor: colors.lightGray,
    height: wp(20),
    width: wp(90),
    flexDirection: 'row',
    paddingHorizontal: wp(3.8),
    marginBottom: wp(3),
    paddingVertical: wp(2),
    alignItems: 'center',
    alignSelf: 'center',
  },
  imageContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    paddingLeft: wp(3),
    marginLeft: wp(2),
    marginRight: wp(5),
  },
  btnLable: {
    fontSize: normalize(16),
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.white,
  },
  btnStyle: {
    marginHorizontal: wp(9),
    paddingVertical: wp(1),
    backgroundColor: colors.blue,
    width: '90%',
    marginBottom: wp(2),
  },
  newUserPopUp: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: wp(10),
  },
});

export default AnimatedBottomSheet;
