import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  fetchCelebs,
  fetchPhotoStyles,
  fetchStockModels,
} from '../../api/fashion/fetch-photo-styles';
import {addStylesData} from '../../store/reducers/stylesDataSlice';
import {useDispatch, useSelector} from 'react-redux';
import {addStockModelData} from '../../store/reducers/stockModelsSlice';
import {addCelebsData} from '../../store/reducers/celebsSlice';
import fetchUserGeneration from '../../api/fashion/fetch-user-generation';
import {jobActions} from '../../store/actions';
import getUserPaymentsAndCredits from '../../api/fashion/get_user_payments';
import userPaymentsAction from '../../store/actions/userPayments.action';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {
  const navigation = useNavigation();
  const user = useSelector((state: {auth: any}) => state?.auth?.user);
  const dispatch = useDispatch();
  useEffect(() => {
    checkUserState();
  }, []);
  const checkUserState = async () => {
    let value = await AsyncStorage.getItem('first');
    fetchDataFromNetwork();
    // if (value) {
    //   fetchDataFromNetwork();
    // } else {
    //   navigation.navigate('PhotosAccess');
    // }
  };
  useEffect(() => {
    fetchUserData(user?.id);
  }, [user?.id]);

  const fetchUserData = async (userID: string) => {
    if (!userID) {
      dispatch(jobActions.syncJobs([]));
    }
    const userGenerations: any = await fetchUserGeneration(userID);
    dispatch(jobActions.syncJobs(userGenerations?.singleId || []));
    const userPayments: any = await getUserPaymentsAndCredits(userID);
    dispatch(userPaymentsAction.updateUserPayments(userPayments || []));
  };

  const fetchDataFromNetwork = async () => {
    const data: any = await fetchPhotoStyles();
    dispatch(addStylesData(data));
    const stockModels: any = await fetchStockModels();
    dispatch(addStockModelData(stockModels));
    const celebsData: any = await fetchCelebs();
    dispatch(addCelebsData(celebsData));
    navigation.navigate('MyDrawer' as never);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/gif/initial.gif')}
        style={styles.loadingGif}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingGif: {
    height: 150,
    width: 150,
  },
});
