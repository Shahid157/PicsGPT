import React, {useState} from 'react';
import {Modal, View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {colors} from '../../assets';
import SvgIcon from '../../assets/SvgIcon';
import {Button} from 'react-native-paper';
import {wp} from '../../constants';
import {normalize} from '../../styles/responsiveScreen';
import fonts from '../../assets/fonts';
import {borderRadius, jobStatus} from '../../constants/appConstants';
import FontText from '../FontText';
import FastImage from 'react-native-fast-image';
import ProgressBar from '../ProgressBar/ProgressBar';
import {jobInterface} from '../../interfaces/appCommonIternfaces';
import {useSelector} from 'react-redux';

interface CustomAlertProps {
  isVisibile?: boolean;
  isError?: boolean;
  onGenerateMorePress: () => void;
  onViewProgressPress: () => void;
  onRequestClose?: () => void;
  onPressClose?: () => void;
}

export default function CustomAlert({
  isError,
  isVisibile,
  onGenerateMorePress,
  onViewProgressPress,
  onRequestClose,
  onPressClose,
}: CustomAlertProps) {
  const latestJobs = useSelector((state: any) => state.latestJobs.latestJobs);
  const listHeight =
    latestJobs.length < 4 ? wp(65) : latestJobs.length < 3 ? wp(110) : wp(60);
  return (
    <SafeAreaView>
      <Modal
        visible={isVisibile}
        animationType={'fade'}
        transparent={true}
        onRequestClose={onRequestClose}>
        <View style={styles.overlay}>
          {isError ? (
            <View style={styles.alertContainer}>
              <View style={styles.titleContainer}>
                <FontText style={styles.title}>Successfull</FontText>
              </View>
              <View style={styles.listContainer(listHeight)}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContainer}
                  data={latestJobs}
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
                                  : wp(53),
                            }}
                            progress={percentage ? percentage : 0}
                            color={
                              item?.status === 'failed'
                                ? colors.red
                                : colors.black
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
                            {`Status:   ${item?.status}`}
                          </FontText>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
              <View style={styles.btnContainer}>
                <Button
                  style={styles.generateBtnStyle}
                  labelStyle={styles.btnLable}
                  buttonColor={colors.black}
                  mode="contained"
                  onPress={onGenerateMorePress}>
                  Generate more
                </Button>
                <Button
                  style={styles.viewProgressBtnStyle}
                  labelStyle={styles.viewBtn}
                  buttonColor={colors.gray}
                  mode="contained"
                  onPress={onViewProgressPress}>
                  View progress
                </Button>
              </View>
              <View style={styles.closeBtnContainer}>
                <Button
                  style={styles.closeBtnStyle}
                  labelStyle={styles.viewBtn}
                  buttonColor={colors.gray}
                  mode="contained"
                  onPress={onPressClose}>
                  Close
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <View style={styles.iconContainer}>
                <SvgIcon.Styley />
                <SvgIcon.CloseRed style={{padding: wp(9), marginTop: wp(5)}} />
              </View>
              <View style={styles.textContainer}>
                <FontText>Failed to connect to server, Try Again</FontText>
              </View>
              <View style={{marginTop: wp(8), alignSelf: 'center'}}>
                <Button
                  style={styles.closeBtnStyle}
                  labelStyle={styles.viewBtn}
                  buttonColor={colors.gray}
                  mode="contained"
                  onPress={onPressClose}>
                  {'Close'}
                </Button>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: colors.white,
    height: '30%',
    width: '90%',
  },
  alertContainer: {
    backgroundColor: colors.white,
    width: '90%',
  },

  titleContainer: {
    marginTop: wp(5),
    marginBottom: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    paddingTop: wp(1),
    fontSize: 19,
    fontWeight: '600',
  },
  alertContent: {
    width: '100%',
    padding: 10,
  },
  listContainer: height => ({
    height: height,
    alignSelf: 'center',
    width: '90%',
    marginBottom: wp(5),
  }),
  btnContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },

  generateBtnStyle: {
    paddingVertical: wp(1),
    borderRadius: borderRadius.none,
    width: '49%',
    marginBottom: wp(2),
  },
  viewProgressBtnStyle: {
    paddingVertical: wp(1),
    borderRadius: borderRadius.none,
    width: '49%',
    marginBottom: wp(2),
  },
  btnLable: {
    fontSize: normalize(13),
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.white,
  },
  closeBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(5),
    width: '90%',
    alignSelf: 'center',
  },
  closeBtnStyle: {
    marginHorizontal: wp(9),
    paddingVertical: wp(1),
    borderRadius: borderRadius.none,
    width: '100%',
  },
  viewBtn: {
    fontSize: normalize(13),
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: colors.black,
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
  flatListContainer: {
    flexGrow: 1,
  },
  finalImg: {
    height: wp(15),
    width: wp(11),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(5),
  },
  textContainer: {
    marginTop: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
