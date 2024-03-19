import {ScrollView, StyleSheet, View, Linking} from 'react-native';
import React, {useRef} from 'react';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import FontText from '../components/FontText';
import {SvgIcon, colors, fonts} from '../assets';
import {isX, normalize, wp} from '../styles/responsiveScreen';
import {Button} from 'react-native-paper';
import {LinkCard} from '../components';
import {supabase} from '../supabase/supabase';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {url, urlHandler} from '../constants/linkingUrls';
import {useSelector, useDispatch} from 'react-redux';
import PopUp from '../components/PopUp/PopUp';
import {chatOpen} from '../store/reducers/chatModalReducer';
import {authActions} from '../store/actions';
import userPaymentsAction from '../store/actions/userPayments.action';
import LoginBottomSheet from '../components/LogInBottomSheet/Index';
import {Modalize} from 'react-native-modalize';

export default function DrawerContent({
  descriptors,
  navigation,
  state,
  ...rest
}: DrawerContentComponentProps) {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const onLogOutHandler = async () => {

    const {data} = await supabase.auth.getSession();

    dispatch(authActions.logout(data));
    dispatch(userPaymentsAction.clearUserCredits());
    navigation.closeDrawer();

    //to move user back on home screen if he logout from any other screen
    navigation.navigate('Home' as never);
  };
  const bottomSheetRef = useRef<Modalize>(null);
  const isLogin = useSelector((state: any) => state?.auth?.isLogin);

  const {isModalOpen} = useSelector((state: any) => state.modalReducer);

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <FontText size={normalize(18)} fontWeight={600} pBottom={wp(2.6)}>
        {'Settings'}
      </FontText>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: wp(10)}}>
        {/* DO NOT REMOVED WE WILL USE LATER */}
        {/* <View style={[styles.cardView, {marginTop: wp(4)}]}>
          <FontText size={normalize(12)} fontWeight={500} pBottom={wp(2.6)}>
            {'Billing'}
          </FontText>
          <View style={[styles.cardView, {backgroundColor: colors.lightGray2}]}>
            <View style={globalStyles.rowJB}>
              <FontText size={normalize(12)} fontWeight={500}>
                {'Gold subscription'}{' '}
              </FontText>
              <FontText fontWeight={500} size={normalize(12)}>
                {'$11/month'}
              </FontText>
            </View>
            <Button
              style={styles.btnStyle}
              labelStyle={styles.btnLabelStyle}
              mode="contained"
              onPress={() =>
                navigation.navigate('Payment', {
                  selectedStyle: '',
                  selectedModel: '',
                  selectedLocation: '',
                })
              }>
              {'Continue '}
            </Button>
          </View>
          <LinkCard linkName="Billing History" leftIcon={<SvgIcon.Billing />} />
        </View> */}
        <View style={[styles.cardView]}>
          <FontText size={normalize(12)} pBottom={wp(2.6)}>
            {'Support'}
          </FontText>
          <LinkCard linkName="URL invite" leftIcon={<SvgIcon.Url />} />
          <LinkCard
            linkName="Instagram"
            leftIcon={<SvgIcon.Instagram />}
            onPress={() => {
              urlHandler(url.Instagram, 'Instagram', dispatch);
            }}
          />
          <LinkCard
            linkName="Facebook"
            leftIcon={<SvgIcon.Facebook />}
            onPress={() => {
              urlHandler(url.Facebook, 'Facebook', dispatch);
            }}
          />
          <LinkCard
            linkName="TikTok"
            leftIcon={<SvgIcon.TikTok />}
            onPress={() => {
              urlHandler(url.TikTok, 'TikTok', dispatch);
            }}
          />
          <LinkCard
            linkName="Twitter"
            leftIcon={<SvgIcon.Twitter />}
            onPress={() => urlHandler(url.Twitter, 'Twitter', dispatch)}
          />
        </View>
        <View style={[styles.cardView]}>
          <FontText size={normalize(12)} pBottom={wp(2.6)}>
            {'Support'}
          </FontText>
          <LinkCard
            linkName="Help center"
            leftIcon={<SvgIcon.Help />}
            onPress={() => {
              navigation.closeDrawer();
              dispatch(chatOpen(true));
            }}
          />
          <LinkCard linkName="Contact us" leftIcon={<SvgIcon.Contact />} />
        </View>
        <View style={[styles.cardView]}>
          <FontText size={normalize(12)} pBottom={wp(2.6)}>
            {'Privacy'}
          </FontText>
          <LinkCard
            linkName="Permission"
            leftIcon={<SvgIcon.Permission />}
            onPress={() => {
              Linking.openSettings();
            }}
          />
        </View>
        <View style={[styles.cardView]}>
          <FontText size={normalize(12)} pBottom={wp(2.6)}>
            {'Legal'}
          </FontText>
          <LinkCard
            linkName="Privacy policy & ToS"
            leftIcon={<SvgIcon.Terms />}
            onPress={() =>
              urlHandler(url.PrivacyPolicy, 'PrivacyPolicy', dispatch)
            }
          />
        </View>
        <Button
          style={[
            styles.btnStyle,
            {backgroundColor: colors.black, marginHorizontal: wp(5)},
          ]}
          labelStyle={styles.btnLabelStyle}
          mode="contained"
          onPress={() => {
            if (isLogin) {
              onLogOutHandler();
            } else {
              navigation.closeDrawer();
              bottomSheetRef.current?.open();
            }
          }}>
          {isLogin ? 'Sign Out' : 'Sign In'}
        </Button>
      </ScrollView>
      <PopUp
        description="Something went wrong could not open url"
        isVisible={isModalOpen}
        title="Error"
      />
      <LoginBottomSheet modalizeRef={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: isX ? wp(15) : wp(10),
    paddingHorizontal: wp(5),
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: wp(5),
    paddingTop: isX ? wp(15) : wp(10),
  },
  cardView: {
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(2),
  },
  btnStyle: {
    marginTop: wp(3.5),
    backgroundColor: colors.black,
    borderRadius: wp(0),
  },
  btnLabelStyle: {
    fontSize: normalize(14),
    fontFamily: fonts.semiBold,
    fontWeight: '700',
    color: colors.white,
  },
});
