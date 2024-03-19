import {StyleSheet} from 'react-native';
import {wp} from './responsiveScreen';
import colors from '../assets/colors';

export default StyleSheet.create({
  abs: {
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
  flexibleW: {
    width: 0,
    flexGrow: 2,
  },
  flexibleH: {
    height: 0,
    flexGrow: 2,
  },
  center: {
    alignSelf: 'center',
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: "center",
    padding: wp(3),
  },
  row: {
    flexDirection: 'row',
  },
  rowWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  rowJC: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowAC: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowJB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowC: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowAE: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowJE: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  colJC: {
    justifyContent: 'center',
  },
  colAC: {
    alignItems: 'center',
  },
  colJB: {
    justifyContent: 'space-between',
  },
  colC: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colAE: {
    alignItems: 'flex-end',
  },
  colJE: {
    justifyContent: 'flex-end',
  },
  overlay: {
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#FAFAFA99',
  },
  boxShadow: {
    shadowColor: '#00000070',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: colors.white,
  },
  bottomShadow: {
    backgroundColor: colors.white,
    shadowColor: '#00000050',
    shadowOffset: {width: 0, height: 0}, // change this for more shadow
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  fullShadow: {
    shadowColor: '#00000050',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
    backgroundColor: colors.white,
  },
  GridViewContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(1),
  },
});
