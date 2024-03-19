import React, {useEffect, useState, useRef} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FontText} from '../../components';
import SubscriptionCard from './SubscroptionCard';
import ProductCard from './ProductCard';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import SvgIcon from '../../assets/SvgIcon';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../store/hooks';
import {useSelector} from 'react-redux';
import {delay} from '../../helpers/validation';
import {createDeployment} from '../../api/styleDiffusionApi';
import utils from '../../helpers/utils';
import {postRequestApi} from '../../utils/AxiosHelper';
import {Toast, useToast} from 'react-native-toast-notifications';
import {
  jobInterface,
  photoAIModel,
  userPayment,
} from '../../interfaces/appCommonIternfaces';
import {getStyleByID} from '../../utils/helpers';
import {
  dataModes,
  photoAIAPIHeaders,
  photoAIConstants,
} from '../../constants/appConstants';
import {
  photoAICreditStatus,
  photoAIJobPriorities,
} from '../../constants/photoAIConstants';
import {jobActions} from '../../store/actions';
import {saveSingleIDGeneration} from '../../api/fashion/single-id-generations';
import {resetModel} from '../../store/reducers/modelSelectSlice';
import {resetSelectedImages} from '../../store/reducers/multiSelectSlice';
import handleUserSelection from '../../api/fashion/user-selection';
import updateCredit from '../../api/fashion/update_Credits';
import userPaymentsAction from '../../store/actions/userPayments.action';
import {RootState} from '../../store';
import CustomAlert from '../../components/CustomAlert';
import {
  addLatestJobs,
  emptyLatestJobs,
} from '../../store/reducers/latestJobsSlice';
import AnimatedBottomSheet from '../Home/AnimatedBottomSheet';
import Card from './Card';
import {EmptyModel} from '../../store/reducers/multipleModelSelectedSlice';

declare global {
  var isPaymentDone: boolean;
}

interface PaymentModal {
  navigation?: any;
  isPhotoAIScreen?: boolean;
  showModal: boolean;
  onClosePress: () => void;
  setShowModal: (showModal: boolean) => void;
}

export default function PaymentModal({
  navigation,
  isPhotoAIScreen,
  showModal,
  onClosePress,
  setShowModal,
}: PaymentModal) {
  let show = showModal;
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [versionSelect, setVersionSelect] = useState<boolean>(false);
  const toastRef = useRef(null);
  const [offers, setOffers] = useState<
    {package: string; products: PurchasesOffering}[]
  >([]);
  const [subscriptionType, setSubscriptionType] = useState<
    'monthly' | 'yearly'
  >('monthly');

  const [currentOfferId, setCurrentOfferId] = useState<string>('');
  const dispatch = useAppDispatch();

  const selectedData = useSelector(
    (state: any) => state.addReducer.jobCollection,
  );
  const {modelSelected} = useSelector(
    (state: RootState) => state?.modelSelected,
  );

  const {multipleModelSelected} = useSelector(
    state => state.multipleModelSelectedSlice,
  );
  const {selectedImages} = useSelector(
    (state: RootState) => state.selectedImages,
  );
  const stylesData = useSelector(
    (state: RootState) => state.stylesData.stylesData,
  );

  const user = useSelector((state: RootState) => state?.auth?.user);
  const {userId} = useSelector((state: RootState) => state?.auth);

  const paymentState = useSelector((state: RootState) => state.payments);

  const selectedStyle = useSelector(
    (state: any) => state?.selectedImages?.selectedImages,
  );
  const payments = useSelector(
    (state: {payments: userPayment}) => state.payments,
  );
  const {jobs} = useSelector((state: {jobs: any}) => state.jobs);
  const products: any = [];

  offers.map(item => {
    item?.products && products.push(item.products);
  });

  // we may need this for refreshing data
  // useEffect(() => {
  //   console.log('running');
  //   fetchUserData(user?.id);
  // }, [user?.id, jobs]);
  // const fetchUserData = async (userID: string) => {
  //   if (!userID) {
  //     dispatch(jobActions.syncJobs([]));
  //   }
  //   const userGenerations: any = await fetchUserGeneration(userID);
  //   dispatch(jobActions.syncJobs(userGenerations?.singleId || []));
  //   const userPayments: any = await getUserPaymentsAndCredits(userID);
  //   dispatch(userPaymentsAction.updateUserPayments(userPayments || []));
  // };

  const getProducts = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const offersData = offerings.all;
      const currentOffer = offerings.current;

      setCurrentOfferId(currentOffer?.identifier ?? '');

      const offerEntries = Object.entries(offersData);

      const offerArray = offerEntries
        .map(offer => {
          return {
            package: offer[0],
            products: offer[1],
          };
        })
        .sort((a, b) => {
          const aOrder: number = (a.products.metadata?.order as number) ?? 1000;
          const bOrder: number = (b.products.metadata?.order as number) ?? 1000;
          return aOrder - bOrder;
        });

      setOffers(offerArray);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    utils.stopLoader();
    getProducts();
  }, []);

  const onPressPayment = async (productId: string) => {
    if (productId === 'free') {
      setLoading(true);
      utils.startLoader();
      for (
        let currentStyleIndex = 0;
        currentStyleIndex < selectedImages.length;
        currentStyleIndex++
      ) {
        const currentStyle = selectedImages[currentStyleIndex];
        const photoStyle = getStyleByID(currentStyle, stylesData);

        let prompt = photoStyle?.prompt || '';
        await createDeploymentApi(prompt, photoStyle);
      }
      utils.stopLoader();
      setLoading(false);
      dispatch(resetModel());
      dispatch(resetSelectedImages());
      dispatch(EmptyModel());
      await handleUserSelection(user?.id, 'delete');
      return;
    }
    setLoading(true);
    try {
      const result = await Purchases.purchaseProduct(productId);
      const {productIdentifier} = result;
      const product = await Purchases.getProducts([productIdentifier]);
      await AsyncStorage.setItem('subscription', JSON.stringify(product[0]));
      globalThis.isPaymentDone = true;
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const createDeploymentApi = async (Prompt: string, usedStyle: any) => {
    if (isPhotoAIScreen) {
      const end_point = '/api/v1/deployments';
      const promises = multipleModelSelected.map(
        async (model: photoAIModel) => {
          const data = {
            name: photoAIConstants.name,
            model_id: photoAIConstants.photoAIModelID,
            args: {
              Gender: model.gender,
              Model_images: model.collection.join(','),
              Prompt,
              Style: 'photo',
            },
          };
          try {
            const response = await postRequestApi(
              end_point,
              data,
              photoAIAPIHeaders,
            );
            let {job_id, id, status} = response || {};

            const job: jobInterface = {
              user_id: userId,
              generate_id: id,
              job_id,
              results: null,
              usedItems: {
                usedModel: {
                  name: model.full_name,
                  gender: model.gender,
                  img_url: model.url,
                  collection: model.collection,
                },
                usedStyle,
              },
              priority: photoAIJobPriorities.free,
              private: true,
              emailed: null,
              status,
              credit_status: photoAICreditStatus.deducted,
              user_email: user?.email,
            };
            dispatch(jobActions.addNewJob(job));
            dispatch(addLatestJobs(job));
            await saveSingleIDGeneration(dataModes.insert, job);
            await updateCredit(user?.id, 'deduct', 1);
            dispatch(
              userPaymentsAction.updateUserCredits({
                credit_left: paymentState.credit_left - selectedStyle.length,
              }),
            );
            return true;
          } catch (error) {
            setLoading(false);
            return false;
          }
        },
      );
      const results = await Promise.all(promises);
      const isVisible = results.every((status: any) => status);
      if (!isVisible) {
        setIsVisible(true);
        setIsError(false);
        console.log('isError', isError);
      } else {
        setIsVisible(isVisible);
        setIsError(true);
      }
    } else {
      let uploaded: any = [];
      await selectedData?.clothImages.map(async (item: any) => {
        const modelUrls = selectedData?.modelImages
          ?.map((e: any) => {
            return e.replaceAll("'", '');
          })
          .join(',');
        const itemUrls = item?.collection
          ?.map((e: any) => {
            return e.replaceAll("'", '');
          })
          .join(',');
        try {
          const data = {
            name: 'Style Diffusion',
            model_id: '619094ff-878c-4193-bc4c-cf55b06bbfea',
            args: {
              Clothing_images: itemUrls,
              Clothing_type: selectedData?.modelType,
              Description: selectedData?.location,
              Gender: selectedData?.clothType,
              Model_images: modelUrls,
            },
          };
          const response = await createDeployment(data, dispatch);
          if (response) {
            const images = {
              jobId: response?.job_id,
              Clothing_images: item?.collection[0].replaceAll("'", ''),
              location_images: selectedData?.locationImage,
              Model_images: selectedData?.modelImages[0],
              user_id: userId ? JSON.parse(userId) : '',
              person_id: selectedData?.person_id,
              garment_id: item?.garment_id,
              prompt: selectedData?.location,
              prompt_type: selectedData?.prompt_type,
              payment_id: null,
              credit_status: null,
              payment: null,
            };
          }
          await delay(500, true);

          dispatch(jobActions.addNewJob(response));
        } catch (error) {
          console.log('error,,,..', error);
        }
      });
      await delay(50, true);
      return Promise.resolve(uploaded);
    }
  };
  const serverDescription =
    selectedStyle.length <= payments.credit_left
      ? `${
          selectedStyle?.length * multipleModelSelected?.length
        } Style Selected, ${payments?.credit_left} credits available`
      : `You don't have enough credits to generate photos. ${selectedStyle.length} credits are required, you have ${payments?.credit_left} credits remainng.`;

  return (
    <Modal animationType={'fade'} transparent={true} visible={showModal}>
      <View style={styles.viewCont}>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            marginTop: 55,
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            {/* just commentting this new payment checkout model on AR feedback */}
            
          {/* <TouchableOpacity
            style={{
              backgroundColor: !versionSelect ? 'black' : 'white',
              alignItems: 'center',
              borderColor: 'gray',
              borderRadius: 5,
              borderWidth: 2,
              marginRight: 1,
              padding: 8,
            }}
            onPress={() => {
              if (versionSelect) {
                setVersionSelect(!versionSelect);
              }
            }}>
            <FontText
              textAlign="center"
              fontWeight={600}
              color={!versionSelect ? 'white' : 'black'}>
              V1
            </FontText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: versionSelect ? 'black' : 'white',
              alignItems: 'center',
              borderColor: 'gray',
              borderRadius: 5,
              borderWidth: 2,
              padding: 8,
            }}
            onPress={() => {
              if (!versionSelect) {
                setVersionSelect(!versionSelect);
              }
            }}>
            <FontText
              textAlign="center"
              fontWeight={600}
              color={versionSelect ? 'white' : 'black'}>
              V2
            </FontText>
          </TouchableOpacity> */}
        </View>
        <View style={styles.mainCont}>
          <View style={styles.subHeaderContainer}>
            <Pressable onPress={onClosePress} style={styles.arrowView}>
              <SvgIcon.Close style={{padding: wp(2.5), left: wp(83)}} />
            </Pressable>
          </View>
          <View style={styles.topContainer}>
            {!versionSelect ? (
              <>
                <View style={styles.subHeader}>
                  <FontText
                    textAlign={'center'}
                    name={'extraBold'}
                    size={normalize(18)}>
                    {'STYLEY'}
                    <FontText name={'bold'} size={normalize(18)}>
                      {' = Model x Style.'}
                    </FontText>
                  </FontText>
                </View>
                <View style={styles.topContainer}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    {/*// Show Message if credits are not enough //*/}
                    {isPhotoAIScreen &&
                      selectedStyle.length > payments?.credit_left && (
                        <View style={styles.cautionContainer}>
                          <FontText
                            name={'bold'}
                            size={normalize(12)}
                            color={colors.red}>
                            {`You don't have enough credits to generate photos. ${selectedStyle.length} credits are required, you have ${payments?.credit_left} credits remainng. Please buy any plan from below`}
                          </FontText>
                        </View>
                      )}
                    <AnimatedBottomSheet
                      navigation={navigation}
                      isOpen={isOpen}
                      onCloseIconPress={() => {
                        setIsOpen(!isOpen);
                        onClosePress();
                      }}
                      onEyePress={(job_id: string) => {
                        setIsOpen(!isOpen);
                        onClosePress();
                        navigation.navigate('ImageViewer', {
                          jobID: job_id,
                        });
                      }}
                      backdropOnPress={() => {
                        onClosePress();
                        setIsOpen(prevState => !prevState);
                      }}
                      show={false}></AnimatedBottomSheet>
                    <CustomAlert
                      isVisibile={isVisible}
                      isError={isError}
                      onGenerateMorePress={() => {
                        dispatch(emptyLatestJobs());
                        onClosePress();
                        setIsVisible(!isVisible);
                        navigation.navigate('Home');
                      }}
                      onPressClose={() => {
                        dispatch(emptyLatestJobs());
                        setIsVisible(!isVisible);
                        onClosePress();
                      }}
                      onViewProgressPress={() => {
                        dispatch(emptyLatestJobs());
                        setIsVisible(!isVisible);
                        setIsOpen(true);
                      }}
                      onRequestClose={() => {
                        setIsVisible(!isVisible);
                      }}
                    />
                    {offers.map(offer => {
                      const {metadata} = offer.products;
                      if (metadata.is_subscription) {
                        return (
                          <SubscriptionCard
                            key={offer.package}
                            isGradient
                            isCurrentOffer={currentOfferId === offer.package}
                            title={offer.package}
                            cardColor="#ffffff"
                            buttonTextColor={colors.white}
                            products={offer.products}
                            onPressAction={onPressPayment}
                          />
                        );
                      } else {
                        const vipCondition = `${metadata.images_count} Images, ${metadata.styles_count} Styles, ${metadata.type}`;
                        const product =
                          offer.products.availablePackages[0].product;
                        const serverDescription =
                          offer.products.serverDescription;
                        const productString = product.priceString;
                        const productIdentifier = product.identifier;
                        return (
                          <ProductCard
                            key={offer.package}
                            isGradient
                            title={offer.package}
                            cardColor="#ffffff"
                            buttonTextColor={colors.white}
                            vipCondition={vipCondition}
                            serverDescription={serverDescription}
                            priceString={productString}
                            identifier={productIdentifier}
                            buttonColor={metadata?.button?.colors ?? []}
                            onPressAction={onPressPayment}
                          />
                        );
                      }
                    })}

                    {/*////// will use generate card if user is not new  ////////*/}
                    {isPhotoAIScreen && jobs.length >= 1 && (
                      <ProductCard
                        key={'free'}
                        isGradient
                        title={'Generate'}
                        cardColor="#ffffff"
                        buttonTextColor={colors.white}
                        serverDescription={serverDescription}
                        priceString={'Generate'}
                        identifier={'free'}
                        buttonColor={['#CCCCCC', '#CCCCCC']}
                        disabled={
                          selectedStyle.length <= payments.credit_left
                            ? false
                            : true
                        }
                        onPressAction={onPressPayment}
                        isLoading={loading}
                      />
                    )}
                    {/*//// will use Free card if user is new and first time using the app ////*/}
                    {isPhotoAIScreen && jobs.length < 1 && (
                      <ProductCard
                        key={'free'}
                        isGradient
                        title={'Try'}
                        cardColor="#ffffff"
                        buttonTextColor={colors.white}
                        serverDescription={serverDescription}
                        priceString={'Free'}
                        disabled={
                          selectedStyle.length <= payments.credit_left
                            ? false
                            : true
                        }
                        identifier={'free'}
                        buttonColor={['#CCCCCC', '#CCCCCC']}
                        onPressAction={onPressPayment}
                        isLoading={loading}
                      />
                    )}
                    <FontText
                      textAlign={'center'}
                      name={'medium'}
                      size={normalize(11)}
                      lineHeightFactor={1.8}
                      color={colors.gray500}>
                      {
                        'By selecting a plan and generating results, you agree to our '
                      }
                      <FontText size={normalize(11)} color={colors.gray900}>
                        {'Privacy Policy'}
                      </FontText>
                      {' and '}
                      <FontText size={normalize(11)} color={colors.gray900}>
                        {'Terms of Service'}
                      </FontText>
                    </FontText>
                  </ScrollView>
                </View>
              </>
            ) : (
              <>
                <View style={styles.tabButtonsContainer}>
                  <TouchableOpacity
                    style={{
                      ...styles.tabButton,
                      backgroundColor:
                        subscriptionType === 'yearly' ? '#000000' : '#cecece',
                    }}
                    onPress={() => setSubscriptionType('yearly')}>
                    <FontText
                      color={subscriptionType == 'yearly' ? 'white' : 'black'}>
                      Yearly
                    </FontText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.tabButton,
                      backgroundColor:
                        subscriptionType === 'monthly' ? '#000000' : '#cecece',
                    }}
                    onPress={() => setSubscriptionType('monthly')}>
                    <FontText
                      color={
                        subscriptionType === 'monthly' ? 'white' : 'black'
                      }>
                      Monthly
                    </FontText>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainerStyle}>
                  {/*// Show Message if credits are not enough //*/}
                  {isPhotoAIScreen &&
                    selectedStyle.length > payments?.credit_left && (
                      <View style={styles.cautionContainer}>
                        <FontText
                          name={'bold'}
                          size={normalize(12)}
                          color={colors.red}>
                          {`You don't have enough credits to generate photos. ${selectedStyle.length} credits are required, you have ${payments?.credit_left} credits remainng. Please buy any plan from below`}
                        </FontText>
                      </View>
                    )}
                  <AnimatedBottomSheet
                    navigation={navigation}
                    isOpen={isOpen}
                    onCloseIconPress={() => setIsOpen(false)}
                    onEyePress={(job_id: string) => {
                      setIsOpen(false);
                      navigation.navigate('ImageViewer', {
                        jobID: job_id,
                      });
                    }}
                    backdropOnPress={() => setIsOpen(prevState => !prevState)}
                    show={false}
                  />
                  <CustomAlert
                    isVisibile={isVisible}
                    isError={isError}
                    onGenerateMorePress={() => {
                      dispatch(emptyLatestJobs());
                      onClosePress();
                      setIsVisible(!isVisible);
                      navigation.navigate('Home');
                    }}
                    onViewProgressPress={() => {
                      dispatch(emptyLatestJobs());
                      setIsVisible(!isVisible);
                      setIsOpen(true);
                    }}
                    onRequestClose={() => {
                      setIsVisible(!isVisible);
                    }}
                  />
                  {/* Payment cards */}

                  {offers.map(offer => {
                    const {metadata} = offer.products;
                    const v1: any = metadata.v1;
                    if (!v1) return null;
                    // One time product has only one product in offer, subscription will have yearly and monthly product in offer
                    const products = offer.products.availablePackages;
                    let currentProduct: PurchasesPackage | undefined;

                    if (v1.productType === 'subscription') {
                      if (subscriptionType === 'monthly') {
                        currentProduct = products.find(
                          pr => pr.packageType === 'MONTHLY',
                        );
                      } else {
                        currentProduct = products.find(
                          pr => pr.packageType === 'ANNUAL',
                        );
                      }
                    } else {
                      currentProduct = products[0];
                    }

                    if (!currentProduct) return null;

                    return (
                      <Card
                        backgroundColor={v1.backgroundColor}
                        title={v1.title}
                        note={v1.note}
                        textColor={v1.textColor}
                        oldPriceColor={v1.oldPriceColor}
                        oldPrice={v1.oldPrice}
                        price={currentProduct.product.priceString}
                        duration={subscriptionType}
                        features={v1.features}
                        productType={v1.productType}
                        buttonBgColor={v1.buttonBgColor}
                        buttonTextColor={v1.buttonTextColor}
                        onPress={() =>
                          onPressPayment(
                            currentProduct?.product?.identifier ?? 'free',
                          )
                        }
                      />
                    );
                  })}

                  {/* Cards */}
                  {/*////// will use generate card if user is not new  ////////*/}
                  {/* {isPhotoAIScreen && jobs.length >= 1 && (
                    <ProductCard
                      key={'free'}
                      isGradient
                      title={'Generate'}
                      cardColor="#ffffff"
                      buttonTextColor={colors.white}
                      serverDescription={
                        selectedStyle.length <= payments.credit_left
                          ? `${selectedStyle.length} Style Selected, ${payments?.credit_left} credits available`
                          : `You don't have enough credits to generate photos. ${selectedStyle.length} credits are required, you have ${payments?.credit_left} credits remainng. Please buy any plan to generate`
                      }
                      priceString={'Generate'}
                      identifier={'free'}
                      buttonColor={['#CCCCCC', '#CCCCCC']}
                      disabled={
                        selectedStyle.length <= payments.credit_left
                          ? false
                          : true
                      }
                      onPressAction={onPressPayment}
                      isLoading={loading}
                    />
                  )} */}

                  {/*//// will use Free card if user is new and first time using the app ////*/}
                  {/* {isPhotoAIScreen && jobs.length < 1 && (
                    <ProductCard
                      key={'free'}
                      isGradient
                      title={'Try'}
                      cardColor="#ffffff"
                      buttonTextColor={colors.white}
                      serverDescription={
                        selectedStyle.length <= payments.credit_left
                          ? `${selectedStyle.length} Style Selected, ${payments?.credit_left} credits available`
                          : `You don't have enough credits to generate photos. ${selectedStyle.length} credits are required, you have ${payments?.credit_left} credits remainng. Please buy any plan to generate`
                      }
                      priceString={'Free'}
                      disabled={
                        selectedStyle.length <= payments.credit_left
                          ? false
                          : true
                      }
                      identifier={'free'}
                      buttonColor={['#CCCCCC', '#CCCCCC']}
                      onPressAction={onPressPayment}
                      isLoading={loading}
                    />
                  )} */}

                  <FontText
                    textAlign={'center'}
                    name={'medium'}
                    size={normalize(11)}
                    lineHeightFactor={1.8}
                    color={colors.gray500}>
                    {
                      'By selecting a plan and generating results, you agree to our '
                    }
                    <FontText size={normalize(11)} color={colors.gray900}>
                      {'Privacy Policy'}
                    </FontText>
                    {' and '}
                    <FontText size={normalize(11)} color={colors.gray900}>
                      {'Terms of Service'}
                    </FontText>
                  </FontText>
                </ScrollView>
              </>
            )}
            {paymentState.credit_left > 0 && (
              <View
                style={{
                  width: '100%',
                  height: '13%',
                  justifyContent: 'center',
                  marginTop: versionSelect ? hp(-15) : hp(-12),
                  paddingHorizontal: hp(2),
                  bottom: versionSelect ? wp(-15) : wp(-4.5),
                }}>
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => {
                    if (isPhotoAIScreen && jobs.length >= 1) {
                      onPressPayment('free');
                    } else {
                      setShowModal(false);
                      navigation.navigate('AddPhotoAIStyle', {
                        screen: 'AddPhotoAI',
                        params: {id: 1},
                      });
                    }
                  }}
                  style={{
                    backgroundColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: hp(6),
                  }}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <>
                      <FontText
                        textAlign="center"
                        fontWeight={600}
                        color={'white'}>
                        {'Generate'}
                      </FontText>
                      {isPhotoAIScreen && jobs.length >= 1 && (
                        <FontText
                          textAlign="center"
                          fontWeight={600}
                          size={10}
                          color={'white'}>
                          {serverDescription}
                        </FontText>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '50%',
    margin: 50,
  },
  topContainer: {
    marginBottom: hp(10),
    paddingHorizontal: wp(2),
  },
  linearGradient: {
    height: wp(12),
    width: wp(76),
    marginTop: wp(5),
    borderRadius: wp(3), // <-- Outer Border Radius
  },
  innerContainer: {
    borderRadius: wp(2.5), // <-- Inner Border Radius
    flex: 1,
    margin: wp(0.6), // <-- Border Width
    backgroundColor: colors.black,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    backgroundColor: 'transparent',
  },
  cardView: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: wp(2.7),
    paddingVertical: wp(4),
  },
  arrowView: {
    height: hp(3.6),
    width: wp(8),
    marginLeft: wp(-3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cautionContainer: {
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center',
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  subHeader: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  subHeaderContainer: {paddingHorizontal: wp(5), paddingTop: 10},
  // New design styles
  tabButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignSelf: 'center',
  },
  tabButton: {
    width: wp(43),
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cecece',
  },
  mainCont: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: hp(1),
    marginBottom: hp(5),
    borderRadius: 10,
  },
  viewCont: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
});
