/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SvgIcon, colors} from '../../assets';
import globalStyles from '../../styles';
import {CommonHeader, FontText, Loading} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import CustomTabBar from './CustomTabBar';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {
  borderRadius,
  dataModes,
  jobStatus,
  photoAIAPIHeaders,
  photoAIConstants,
} from '../../constants/appConstants';

import fonts from '../../assets/fonts';
import fetchUserModelsCollection from '../../api/fashion/fetch-custom-modals';
import {user_collections_api} from '../../store/actions/fashion.action';
import {setModel} from '../../store/reducers/modelSelectSlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  supabaseDynamic,
  supabaseKey,
  supabaseUrl,
} from '../../supabase/supabase';

import {postRequestApi} from '../../utils/AxiosHelper';
import {jobActions} from '../../store/actions';
import {saveSingleIDGeneration} from '../../api/fashion/single-id-generations';
import {
  photoAICreditStatus,
  photoAIJobPriorities,
} from '../../constants/photoAIConstants';
import {jobInterface} from '../../interfaces/appCommonIternfaces';
import {useToast} from 'react-native-toast-notifications';
import supabaseTables from '../../constants/supabaseTables';
import GenerationListSkelton from '../../components/GenerationListSkelton/GenerationListSkelton';
import {hp} from '../../constants';
import strings from '../../assets/strings';

export default function UserDetail() {
  const [tabBarIndex, setTabBarIndex] = React.useState<number>(0);
  const [customModal, setCustomModal] = useState([]);
  const [userGenerations, setUserGenerations] = useState([]);
  const [savedGenerations, setSavedGenerations] = useState();
  const [isLoadingItem, setIsLoadingItem] = useState({});
  const [retry, setRetry] = useState(false);
  const [routes] = React.useState([
    {key: 'style', title: 'Style', image: <SvgIcon.S />},
    {key: 'videos', title: 'Videos', image: <SvgIcon.Play />},
    {key: 'shop', title: 'Shop', image: <SvgIcon.Square />},
  ]);

  const toast = useToast();
  useEffect(() => {}, [retry]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userProfilePic = useSelector(
    (state: any) => state.auth?.user?.user_metadata?.picture,
  );
  const userName = useSelector(
    (state: any) => state.auth?.user?.user_metadata?.name,
  );
  const userEmail = useSelector((state: any) => state.auth?.user?.email);
  const {userId} = useSelector((state: {auth: any}) => state.auth);

  useEffect(() => {
    fetchCustomModal(userId);
    fetchSavedData(userId);
    getGenerationDetails();
  }, [navigation, tabBarIndex, useIsFocused()]);

  const renderTabBar = (props?: any) => {
    return (
      <CustomTabBar
        activeIndex={tabBarIndex}
        data={routes}
        onTabChange={(i: number) => setTabBarIndex(i)}
        {...props}
      />
    );
  };

  const getGenerationDetails = async () => {
    let {data: single_id_user_generations} = await supabaseDynamic(
      supabaseUrl,
      supabaseKey,
    )
      .from('single_id_user_generations')
      .select('*')
      .eq('status', jobStatus.complete)
      .eq('user_id', userId)
      .not('results', 'is', null)
      .order('created_at', {ascending: false});
    setUserGenerations(single_id_user_generations);
  };
  const fetchCustomModal = async (user_id: string) => {
    const res = await fetchUserModelsCollection(user_id);
    if (res?.length < 1) {
      const apiRes = await user_collections_api(user_id);
      if (apiRes.data) {
        setCustomModal(apiRes.data);
      }
    } else {
      setCustomModal(res);
    }
  };

  async function deleteModel(item: any) {
    try {
      const {error} = await supabaseDynamic(supabaseUrl, supabaseKey)
        .from(supabaseTables.userCollectionDetails)
        .delete()
        .eq('user_id', userId)
        .eq('id', item);
      if (error) {
        throw new Error('Error deleting model');
      }
      fetchCustomModal(userId);
      toast.show('Model deleted successfully', {
        type: 'success',
        placement: 'top',
        duration: 1500,
        animationType: 'slide-in',
      });
    } catch (error) {
      toast.show('Error in deletion', {
        type: 'warning',
        placement: 'top',
        duration: 1500,
        animationType: 'slide-in',
      });
    }
  }

  const onImageSelection = (item: any) => {
    dispatch(setModel(item));
    navigation.navigate('AddPhotoAIStyle', {
      screen: 'AddPhotoAI',
      params: {id: 2},
    });
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
        // setResp(respon);
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
  const handelDeleteGeneration = async (jobId: string) => {
    const deleteResponse = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('single_id_user_generations')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);

    if (deleteResponse.error) {
      console.error('Error deleting existing data:', deleteResponse.error);
      return;
    }
    await getGenerationDetails();
    toast.show('Result deleted successfully', {
      type: 'success',
      placement: 'top',
      duration: 1500,
      animationType: 'slide-in',
    });
  };

  const deleteSavedGeneration = async (item: any) => {
    const deleteResponse = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('saved_collection')
      .delete()
      .eq('user_id', userId)
      .eq('url', item);

    if (deleteResponse.error) {
      console.error('Error deleting existing data:', deleteResponse.error);
      return;
    }
    fetchSavedData(userId);
    toast.show('Deleted successfully', {
      type: 'success',
      placement: 'top',
      duration: 1500,
      animationType: 'slide-in',
    });
  };
  const fetchSavedData = async (userid: string) => {
    const response = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('saved_collection')
      .select('*')
      .eq('user_id', userid);
    // console.log(response.data);

    setSavedGenerations(response.data);
  };

  const handelSavedUnsavedGenerations = async (inputData: any) => {
    const {
      id,
      user_id,
      usedItems: {usedModel, usedStyle},
      results,
    } = inputData;

    const preparedData = {
      user_id: user_id,
      inference_id: id,
      url: results[0],
      usedItems: {
        usedModel: {
          name: usedModel.full_name,
          gender: usedModel.gender,
          img_url: usedModel.url,
        },
        usedPrompt: {
          name: usedStyle.prompt_name,
          prompt: usedStyle.prompt,
          img_url: usedStyle.img_url,
        },
      },
    };
    setIsLoadingItem(prevLoadingState => ({
      ...prevLoadingState,
      [preparedData.url]: true,
    }));

    const existingData = await supabaseDynamic(supabaseUrl, supabaseKey)
      .from('saved_collection')
      .select('*')
      .eq('user_id', user_id)
      .eq('url', preparedData.url);

    if (existingData.data && existingData.data.length) {
      const deleteResponse = await supabaseDynamic(supabaseUrl, supabaseKey)
        .from('saved_collection')
        .delete()
        .eq('user_id', user_id)
        .eq('url', preparedData.url);

      if (deleteResponse.error) {
        console.error('Error deleting existing data:', deleteResponse.error);
        return;
      }
      setIsLoadingItem(prevLoadingState => ({
        ...prevLoadingState,
        [preparedData.url]: false,
      }));
      await fetchSavedData(userId);

      toast.show('Unsaved successfully', {
        type: 'success',
        placement: 'top',
        duration: 1500,
        animationType: 'slide-in',
      });
    } else {
      const insertResponse = await supabaseDynamic(supabaseUrl, supabaseKey)
        .from('saved_collection')
        .insert(preparedData)
        .select('*');
      if (insertResponse.error) {
        console.error('Error inserting data:', insertResponse.error);
        return;
      }
      await fetchSavedData(userId);
      setIsLoadingItem(prevLoadingState => ({
        ...prevLoadingState,
        [preparedData.url]: false,
      }));
      toast.show('Saved successfully', {
        type: 'success',
        placement: 'top',
        duration: 1500,
        animationType: 'slide-in',
      });
    }
  };

  return (
    <View style={styles.container}>
      <CommonHeader />
      <View>
        <FlatList
          contentContainerStyle={{paddingBottom: hp(10)}}
          data={
            tabBarIndex === 0
              ? userGenerations
              : tabBarIndex === 1
              ? customModal
              : savedGenerations
          }
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={styles.listHeaderMainContainer}>
              <View style={[globalStyles.rowJB, styles.headerRowContainer]}>
                <View style={styles.profileImageContainer}>
                  <FastImage
                    style={styles.profileImg}
                    source={{
                      uri: userProfilePic,
                    }}
                    defaultSource={require('../../assets/images/UserDefaultImage.png')}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <FontText
                    pTop={wp(0)}
                    textAlign={'center'}
                    name={'bold'}
                    size={normalize(14)}
                    color={colors.black}>
                    {userName ? userName : userEmail}
                  </FontText>
                  <FontText
                    pTop={wp(3)}
                    textAlign={'center'}
                    name={'bold'}
                    size={normalize(14)}
                    color={colors.gray}>
                    {userName ? userName : userEmail}
                  </FontText>
                  <Button
                    style={styles.editBtn}
                    labelStyle={styles.editBtnLabel}
                    mode="contained">
                    {'Edit'}
                  </Button>
                </View>
              </View>
              <View style={styles.tabBarContainer}>{renderTabBar()}</View>
            </View>
          )}
          ListEmptyComponent={
            <View style={{flex: 1}}>
              {userId && tabBarIndex !== 0 && (
                <View style={styles.emptyTextContainer}>
                  <FontText
                    name="medium"
                    size={normalize(12)}
                    color={colors.black}>
                    {userId && tabBarIndex === 1
                      ? 'You have no models yet'
                      : tabBarIndex === 2
                      ? 'You have no saved items'
                      : null}
                  </FontText>
                </View>
              )}
              {tabBarIndex === 0 && (
                <>
                  {userGenerations?.length ? (
                    <GenerationListSkelton />
                  ) : (
                    <View style={styles.noTextContainer}>
                      <SvgIcon.Styley style={{marginBottom: wp(3)}} />
                      <FontText style={{textAlign: 'center'}}>
                        {strings.noGenerationText}
                      </FontText>
                      <Button
                        style={styles.btnStyle}
                        labelStyle={styles.btnLable}
                        onPress={() => navigation.navigate('AddPhotoAIStyle')}
                        mode="contained">
                        {'Generate'}
                      </Button>
                    </View>
                  )}
                </>
              )}
            </View>
          }
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <View>
                {tabBarIndex === 0 || tabBarIndex === 2 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ImageViewer', {
                          jobID: item.job_id,
                        });
                      }}>
                      <FastImage
                        style={styles.listImage}
                        source={{
                          uri: item?.results ? item?.results[0] : item.url,
                        }}
                      />
                    </TouchableOpacity>
                    {tabBarIndex === 0 && (
                      <>
                        <TouchableOpacity
                          style={styles.generationDelete}
                          onPress={() => handelDeleteGeneration(item?.job_id)}>
                          <SvgIcon.Delete />
                        </TouchableOpacity>
                        <FontText
                          name={'medium'}
                          size={normalize(14)}
                          color={colors.white}
                          style={styles.imageName}
                          numberOfLines={1}
                          pTop={wp(1)}>
                          {item?.usedItems?.usedModel?.full_name}
                        </FontText>
                        <TouchableOpacity
                          style={styles.recycleIcon}
                          onPress={() => retryApi(item)}>
                          <SvgIcon.recreate style={{padding: wp(2)}} />
                        </TouchableOpacity>
                        {tabBarIndex === 0 && (
                          <TouchableOpacity
                            style={styles.saveIcon}
                            onPress={() => handelSavedUnsavedGenerations(item)}>
                            {savedGenerations?.some(
                              (data: any) => data?.url === item?.results[0],
                            ) ? (
                              <SvgIcon.SaveFilled />
                            ) : (
                              <SvgIcon.Save />
                            )}
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {tabBarIndex === 2 && (
                      <TouchableOpacity
                        style={styles.deleteIcon}
                        onPress={() => deleteSavedGeneration(item?.url)}>
                        <SvgIcon.Delete />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  tabBarIndex === 1 && (
                    <View style={{flex: 1}}>
                      <TouchableOpacity onPress={() => onImageSelection(item)}>
                        <FastImage
                          style={styles.modelImages}
                          source={{uri: item?.url}}
                        />
                        <TouchableOpacity
                          style={styles.modelDeleteIcon}
                          onPress={() => deleteModel(item.id)}>
                          <SvgIcon.Delete />
                        </TouchableOpacity>
                      </TouchableOpacity>
                      <FontText
                        style={{
                          alignSelf: 'center',
                          marginTop: wp(0.5),
                          marginBottom: wp(2),
                        }}>
                        {item?.full_name}
                      </FontText>
                    </View>
                  )
                )}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileImg: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(4),
    borderWidth: 1.5,
    borderColor: colors.gray200,
    resizeMode: 'cover',
  },
  btnColor: {
    paddingHorizontal: wp(5),
    paddingVertical: wp(2.7),
    backgroundColor: colors.blue,
    borderRadius: wp(1.8),
    borderWidth: 1,
  },
  modelImage: {
    width: wp(47),
    height: wp(47),
    borderRadius: wp(1),
  },
  btnStyle: {
    width: wp(40),
    marginHorizontal: wp(5),
    paddingVertical: wp(2),
    backgroundColor: colors.black,
    borderRadius: borderRadius.none,
    marginTop: wp(5),
  },
  btnLable: {
    fontSize: normalize(16),
    fontFamily: fonts.bold,
    fontWeight: '600',
  },
  shareBtn: {
    top: wp(2.5),
    backgroundColor: colors.gray200,
    height: wp(14),
    width: wp(14),
    justifyContent: 'center',
    alignItems: 'center',
    right: wp(3),
  },
  editBtn: {
    width: wp(20),
    height: wp(10),
    backgroundColor: colors.white,
    borderRadius: wp(3),
    marginTop: wp(3.5),
    borderWidth: wp(0.5),
    borderColor: colors.gray,
  },
  editBtnLabel: {
    fontSize: normalize(12),
    fontFamily: fonts.bold,
    fontWeight: '500',
    color: colors.black,
  },
  imageName: {
    width: '70%',
    position: 'absolute',
    top: wp(51),
    left: wp(3),
  },

  recycleIcon: {
    height: wp(7),
    width: wp(7),
    position: 'absolute',
    top: wp(53),
    left: wp(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    height: wp(7),
    width: wp(7),
    position: 'absolute',
    top: wp(1),
    left: wp(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    height: wp(7),
    width: wp(7),
    position: 'absolute',
    top: wp(1),
    left: wp(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelDeleteIcon: {
    height: wp(7),
    width: wp(7),
    position: 'absolute',
    top: wp(1),
    left: wp(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextContainer: {
    marginTop: wp(50),
    alignItems: 'center',
    alignSelf: 'center',
  },
  loader: {
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    left: wp(0.1),
  },
  generationDelete: {
    height: wp(7),
    width: wp(7),
    position: 'absolute',
    top: wp(1),
    left: wp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTextLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: wp(5),
    paddingTop: wp(5),
    marginBottom: wp(2),
  },
  noTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(15),
  },
  listImage: {
    height: wp(61),
    width: wp(48.5),
    backgroundColor: colors.gray,
    marginBottom: wp(1),
    marginLeft: wp(1),
  },
  modelImages: {
    height: wp(61),
    width: wp(48.5),
    backgroundColor: colors.lightGray,
    marginBottom: wp(1),
    marginLeft: wp(1),
  },
  listHeaderMainContainer: {
    backgroundColor: colors.white,
    height: wp(50),
    flex: 1,
  },
  profileImageContainer: {
    width: '30%',
    height: wp(25.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRowContainer: {
    marginTop: wp(6),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  detailsContainer: {
    height: wp(25.5),
    width: '70%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: wp(2),
  },
  tabBarContainer: {
    justifyContent: 'center',
    width: wp(90),
    marginLeft: wp(4.5),
    alignContent: 'center',
  },
});
