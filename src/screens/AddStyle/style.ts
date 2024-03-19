import {StyleSheet} from 'react-native';
import {colors} from '../../assets';
import {wp} from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imgStyle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
    backgroundColor: colors.gray50,
  },
  btnStyle: {
    marginHorizontal: wp(5),
    paddingVertical: wp(1),
    backgroundColor: colors.black,
    borderRadius: wp(3),
    marginBottom: wp(3),
  },
  categoryView: {
    paddingHorizontal: wp(4),
    paddingTop: wp(1.5),
    // paddingBottom: wp(1),
  },
  categoryBox: {
    backgroundColor: colors.black,
    marginRight: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(5),
    borderWidth: 2,
    marginTop: wp(2),
  },
  tagsWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
});
