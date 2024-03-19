import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {hp, wp} from '../../styles/responsiveScreen';
import {rawData} from '../../constants/photoAIConstants';
import {colors} from '../../assets';

interface pressType {
  newModelHandler?: () => void;
}

const GenerationListSkelton = ({newModelHandler}: pressType) => {
  return (
    <View style={styles.mainStyles}>
      <FlatList
        data={rawData}
        numColumns={2}
        keyExtractor={item => item.toString()}
        renderItem={() => <View style={styles.imgStyle} />}
      />
    </View>
  );
};

export default GenerationListSkelton;

const styles = StyleSheet.create({
  imgStyle: {
    height: wp(60),
    width: wp(47),

    marginBottom: wp(0.5),
    backgroundColor: colors.lightSilver,
    marginLeft: 3,
  },
  mainStyles: {
    marginTop: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    position: 'absolute',
    alignSelf: 'center',
    height: hp(7),
    backgroundColor: '#000',
    borderRadius: wp(5),
    bottom: '40%',
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
