/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/react-in-jsx-scope */
import {FontText} from '../../components';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../assets';
import {hp, wp} from '../../constants';
import SvgIcon from '../../assets/SvgIcon';
import strings from '../../assets/strings';

interface Header {
  navigation?: any;
  title?: any;
  id?: Number;
  back?: Boolean;
  skip?: Boolean;
  route?: any;
}
const list = [{text: 0}, {text: 1}, {text: 2}, {text: 3}, {text: 4}, {text: 5}];
export default function Header({
  back,
  id,
  title,
  skip,
  navigation,
  route,
}: Header) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        {list.map(item => {
          return (
            <TouchableOpacity
              style={[
                styles.section,
                {height: item.text === id ? 4 : 2},
              ]}></TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.titleContainer}>
        {back ? (
          <TouchableOpacity>
            <SvgIcon.backArrow
              onPress={() => {
                navigation.goBack();
              }}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <FontText size={19} color={colors.black} style={styles.title}>
          STYLEY
        </FontText>
        {skip && id != 0 ? (
          <TouchableOpacity>
            <FontText>{strings.skip}</FontText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <FontText style={{color: 'white'}}>{strings.skip}</FontText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(6),
    backgroundColor: colors.white,
  },
  section: {
    width: wp(95) / 6,
    height: 2,
    marginHorizontal: 2,
    backgroundColor: 'red',
  },
  title: {
    fontWeight: '900',
  },
  titleContainer: {
    flexDirection: 'row',
    top: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(95),
  },
});
