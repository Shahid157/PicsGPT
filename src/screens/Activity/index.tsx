import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {CommonHeader, FontText} from '../../components';
import globalStyles from '../../styles';
import {normalize, wp} from '../../styles/responsiveScreen';
import FilterOption from '../Home/FilterOption';
import DataSource from '../../constants/data';
import ActivityItem from './ActivityItem';
import {TabScreenProps} from '../../navigation/types';
import {hp} from '../../constants';

type ActivityProps = TabScreenProps<'Activity'>;
const {notificationData} = DataSource;

export default function Activity({navigation}: ActivityProps) {
  const [trendingEnable, setTrendingEnable] = useState(false);
  const [filterEnable, setFilterEnable] = useState(false);
  const [trending, setTrending] = useState([
    {name: 'Trending', isSelected: true},
    {name: 'Newest', isSelected: false},
    {name: 'Most Liked', isSelected: false},
    {name: 'Newest', isSelected: false},
  ]);
  const [gender, setGender] = useState([
    {name: 'All', isSelected: true},
    {name: 'Males', isSelected: false},
    {name: 'Females', isSelected: false},
  ]);
  // const bottomSheetRef = useRef<Modalize>(null);

  const onSingleChoicePress = (inx: number) => {
    const data = gender.map((item, index) => {
      if (inx === index) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setGender(data);
  };

  return (
    <View>
      <View style={globalStyles.bottomShadow}>
        <CommonHeader />
        <View style={styles.topContainer}></View>
        
        {trendingEnable || filterEnable ? (
          <FilterOption
            filterOption={
              trendingEnable ? trending : filterEnable ? gender : []
            }
            onItemPress={onSingleChoicePress}
          />
        ) : null}
      </View>
      
      {true ? (
        <View style={{marginTop: hp(35)}}>
          <FontText textAlign="center" size={normalize(14)}>
            {'No notification found'}
          </FontText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{paddingBottom: wp(30)}}>
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{marginTop: wp(2)}}
            data={notificationData}
            keyExtractor={({id}) => id.toString()}
            renderItem={({item}) => {
              return <ActivityItem item={item} />;
            }}
          />
          <FontText
            pLeft={wp(4)}
            pTop={wp(3)}
            pBottom={wp(1)}
            name={'bold'}
            size={normalize(16)}>
            {'Old Activity'}
          </FontText>
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{marginTop: wp(2)}}
            data={notificationData}
            keyExtractor={({id}) => id.toString()}
            renderItem={({item}) => {
              return <ActivityItem item={item} />;
            }}
          />
        </ScrollView>
      )}

      {/* <LogInBottomSheet modalizeRef={bottomSheetRef} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(2),
  },
  filter: {marginHorizontal: wp(3), padding: wp(2.5)},
});
