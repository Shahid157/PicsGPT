import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import globalStyles from '../../styles';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors} from '../../assets';
import FontText from '../../components/FontText';

interface FilterOptionProps {
  filterOption: any;
  onItemPress?: any;
  isScroll?: boolean;
}

export default function FilterOption({
  filterOption,
  onItemPress,
  isScroll,
}: FilterOptionProps) {
  return (
    <View style={[globalStyles.rowJC, styles.optionView]}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        scrollEnabled={isScroll ? isScroll : false}>
        {filterOption.map((item: any, index: number) => {
          return (
            <Pressable key={index} onPress={() => onItemPress(index, item)}>
              <View
                style={[
                  styles.borderView,
                  {
                    borderColor: colors.gray2,
                    backgroundColor : item.isSelected ? colors.black : colors.white,
                    borderWidth:1,
                  },
                ]}>
                <FontText
                  pLeft={wp(3)}
                  pRight={wp(3)}
                  name={item.isSelected ? 'extraBold' : 'medium'}
                  color={item.isSelected ? colors.white : colors.gray2}
                  size={normalize(12)}>
                  {item.name}
                </FontText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  optionView: {paddingVertical: wp(2)},
  borderView: {
    height: wp(7.5),
    marginHorizontal: wp(2.5),
    borderRadius: wp(1),
    justifyContent: 'center',
  },
});
