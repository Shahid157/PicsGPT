import {StyleSheet} from 'react-native';
import {colors} from '../../assets';
import {wp, hp} from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imgStyle: {
    width: wp(31),
    height: wp(30),
    backgroundColor: colors.gray50,
  },
  btnStyle: {
    marginHorizontal: wp(5),
    paddingVertical: wp(1),
    backgroundColor: colors.black,
    borderRadius: wp(3),
    marginBottom: wp(3),
  },
  imgStyleNew: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
  },
  categoryView: {
    marginHorizontal: wp(4),
    paddingTop: wp(1.5),
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
  filter: {marginHorizontal: wp(3), padding: wp(2.5)},
  topContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(2),
  },
  imagesStyle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
    backgroundColor: colors.halfWhite,
    marginLeft: 10,
    marginTop: 5,
  },
  input: {
    width: wp(90),
    backgroundColor: colors.halfWhite,
    borderColor: colors.halfWhite,
    borderRadius: 0,
  },
});
