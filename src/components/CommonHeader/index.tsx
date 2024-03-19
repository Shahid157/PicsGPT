import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import NavigationBar from '../NavigationBar';
import {SvgIcon, colors} from '../../assets';
import FontText from '../FontText';
import {normalize, wp} from '../../styles/responsiveScreen';
import {useSelector} from 'react-redux';
import {jobInterface, userPayment} from '../../interfaces/appCommonIternfaces';
import {jobStatus} from '../../constants/appConstants';
import AnimatedBottomSheet from '../../screens/Home/AnimatedBottomSheet';
import {useNavigation} from '@react-navigation/native';
import ProgressCircle from 'react-native-progress-circle';
import AnimatedSearchBox from '@ocean28799/react-native-animated-searchbox';
import {hp} from '../../constants';
import PaymentModal from '../../screens/Payment';
import {getInProgressJobs} from '../../utils/helpers';

let SearchIcon = require('../../assets/images/search.png');
interface HeaderProps {
  isBack?: boolean;
  onProcessPress?: any;
  noHeader?: boolean;
  search?: boolean;
  searchInput?: any;
  filterPress?: () => void;
  filter?: boolean;
  onChangeSearchText?: () => void;
}

export default function Header({
  isBack,
  search,
  filterPress,
  filter,
  searchInput,
  onChangeSearchText,
}: HeaderProps) {
  const {jobs} = useSelector((state: {jobs: any}) => state.jobs);
  const payments = useSelector(
    (state: {payments: userPayment}) => state.payments,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchIconColor, setSearchIconColor] = useState('#000');
  const [showModal, setShowModal] = useState<boolean>(false);

  const [showAll, setshowAll] = useState(true);
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState<any>(false);
  const refSearchBox = useRef();

  const openSearchBox = () => {
    console.log('called search');
    refSearchBox.current.open();
    setShowSearch(true);
  };
  const closeSearchBox = () => {
    refSearchBox.current.close();
    setShowSearch(false);
  };

  const runningJobs = getInProgressJobs(jobs || []);
  const totalProgress = runningJobs.reduce(
    (sum, job) =>
      sum +
      (job?.etr > job?.eta ? 0 : (100 - (job?.etr / job?.eta) * 100) / 100),
    0,
  );
  const averageProgress =
    runningJobs.length > 0 ? totalProgress / runningJobs.length : 0;

  return (
    <>
      <View style={styles.container}>
        <AnimatedBottomSheet
          navigation={navigation}
          isOpen={isOpen}
          show={showAll}
          onCloseIconPress={() => setIsOpen(false)}
          onEyePress={(job_id: string) => {
            setIsOpen(false);
            navigation.navigate('ImageViewer', {
              jobID: job_id,
            });
          }}
          backdropOnPress={() => setIsOpen(prevState => !prevState)}
        />
        <NavigationBar
          hasCenter
          hasLeft
          hasRight
          left={
            isBack ? (
              <Pressable
                style={{
                  padding: wp(3),
                }}
                onPress={() => navigation.goBack()}>
                <SvgIcon.BlackForward />
              </Pressable>
            ) : (
              <>
                {!showSearch ? (
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <SvgIcon.Menu />
                  </TouchableOpacity>
                ) : null}
                {search && !showSearch && (
                  <TouchableOpacity
                    onPress={openSearchBox}
                    style={{marginLeft: wp(2)}}>
                    <FastImage
                      source={SearchIcon}
                      resizeMode="contain"
                      style={{
                        height: hp(4),
                        width: wp(6),
                      }}
                    />
                  </TouchableOpacity>
                )}
                {filter && !showSearch ? (
                  <View>
                    <Pressable
                      onPress={filterPress}
                      style={{marginLeft: wp(2)}}>
                      <SvgIcon.DropDown />
                    </Pressable>
                  </View>
                ) : null}
              </>
            )
          }
          center={
            <>
              {!showSearch && <SvgIcon.Styley />}
              {search && (
                <View
                  style={{
                    position: 'absolute',
                    width: !showSearch ? wp(40) : wp(100),
                  }}>
                  <AnimatedSearchBox
                    ref={ref => (refSearchBox.current = ref)}
                    placeholder={'Search'}
                    placeholderTextColor={colors.black}
                    backgroundColor={colors.white}
                    focusAfterOpened
                    searchIconSize={0}
                    borderRadius={12}
                    onChangeText={onChangeSearchText}
                    onBlur={() => closeSearchBox()}
                  />
                </View>
              )}
            </>
          }
          right={
            !showSearch ? (
              <View style={{flexDirection: 'row', alignItems: 'enter'}}>
                {jobs.filter(
                  (job: jobInterface) =>
                    job.status === jobStatus.pending ||
                    job.status === jobStatus.training ||
                    job.status === jobStatus.docker_pulling ||
                    job.status === jobStatus.running,
                )?.length > 0 ? (
                  <TouchableOpacity
                    style={{marginRight: wp(1)}}
                    onPress={() => {
                      setshowAll(true);
                      setIsOpen(!isOpen);
                    }}>
                    <ProgressCircle
                      percent={averageProgress * 100}
                      radius={12}
                      borderWidth={3}
                      color={colors.blue}
                      bgColor={colors.silverBlue}>
                      <FontText
                        style={{
                          alignSelf: 'center',
                          fontSize: 11,
                          fontWeight: '500',
                        }}
                        color={colors.blue}>
                        {
                          jobs.filter(
                            (job: jobInterface) =>
                              job.status === jobStatus.pending ||
                              job.status === jobStatus.docker_pulling ||
                              job.status === jobStatus.training ||
                              job.status === jobStatus.running,
                          )?.length
                        }
                      </FontText>
                    </ProgressCircle>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{marginRight: wp(1)}}
                    onPress={() => {
                      setshowAll(false);
                      setIsOpen(!isOpen);
                    }}>
                    <View style={styles.circle} />
                  </TouchableOpacity>
                )}
                <View>
                  <TouchableOpacity
                    style={styles.notificationBadge}
                    onPress={() => setShowModal(true)}>
                    <SvgIcon.CreditsCoins style={{right: wp(1)}} />
                    <FontText size={normalize(12.5)} style={{left: wp(1)}}>
                      {payments.credit_left}
                    </FontText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={closeSearchBox}>
                <SvgIcon.Close />
              </TouchableOpacity>
            )
          }
          style={isBack ? {paddingRight: wp(3)} : {paddingHorizontal: wp(3)}}
        />
      </View>

      <PaymentModal
        onClosePress={() => setShowModal(false)}
        navigation={navigation}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    top: wp(1),
    height: hp(11),
    marginBottom: wp(2),
  },
  notificationBadge: {
    flexDirection: 'row',
    height: wp(5),
    backgroundColor: colors.lightGray,
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(1),
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(2.5),
    top: wp(0.5),
  },
  uploadProgressBtn: {
    marginRight: wp(3),
    marginTop: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    height: wp(7),
    width: wp(7),
    borderWidth: wp(1),
    borderColor: colors.lightSilver,
    borderRadius: wp(3.5),
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
  },
  plus: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});
