import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../assets/colors';
import {wp} from '../../styles/responsiveScreen';
import Circuler from './Circuler';

const ListRefreshLoader = ({refreshing}) => {
  return (
    <View>
      {refreshing ? (
        <View style={styles.container}>
          <Circuler color={colors.gray} size={wp(6)} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(15),
    height: wp(15),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListRefreshLoader;
