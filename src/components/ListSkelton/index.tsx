import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {rawData} from '../../constants/photoAIConstants';
import {wp} from '../../constants';

export default function ListSekelton() {
  return (
    <FlatList
      data={rawData}
      numColumns={2}
      keyExtractor={item => item.toString()}
      renderItem={() => <View style={styles.imagesStyle} />}
    />
  );
}

const styles = StyleSheet.create({
  imagesStyle: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(2),
    marginBottom: wp(0.5),
    backgroundColor: '#f6f7f9',
    marginLeft: 10,
    marginTop: 5,
  },
});
