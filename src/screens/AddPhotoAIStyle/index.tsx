import {View, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CommonHeader, PhotoStylesGridList} from '../../components';
import {wp} from '../../styles/responsiveScreen';
import {useSelector} from 'react-redux';
import FilterOption from '../Home/FilterOption';
import {styles} from './styles';
import {filterItem} from './interfaces';
import {convertPlaneArrayWithCategoryObject} from '../../utils/helpers';
import {rawData} from '../../constants/photoAIConstants';
import ContentBottomSheet from '../../components/SampleBottomContent/Index';
import {Modalize} from 'react-native-modalize';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddPhotoAIStyleProps {
  validateUser?: () => boolean;
}
export default function AddPhotoAIStyle({validateUser}: AddPhotoAIStyleProps) {
  const [searchInput, setSearchInput] = useState<string>('');
  const [styleUrl, setStyleUrl] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<filterItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [filterEnable, setFilterEnable] = useState<boolean>(false);
  const [imagesfliter, setImagesfliter] = useState<any>([]);
  const stylesData = useSelector((state: any) => state.stylesData.stylesData);
  const contentSheetRef = useRef<Modalize>(null);
  let data = {
    title: 'Create it. Believe it. Live it',
    subTitle: 'Explore feed for coolest Styleys',
    discription: `Create awesome, fun and stylish pics with Styley AI. Just pick the styles of images you like and upload 5+ selfies to create new images of you.`,
  };
  useEffect(() => {
    if (selectedFilter) {
      handleFilter(selectedFilter);
    }
  }, [selectedFilter]);
  useEffect(() => {
    checkFirstAttention();
  }, []);
  const checkFirstAttention = async () => {
    let data = await AsyncStorage.getItem('ComesStyle');
    if (!data) {
      contentSheetRef.current?.open();
    }
  };
  const setFirstAttention = async () => {
    await AsyncStorage.setItem('ComesStyle', 'true');
    contentSheetRef.current?.close();
  };
  useEffect(() => {
    if (searchInput.length) {
      let imgs = filterItems(styleUrl);
      setImagesfliter(imgs);
    } else {
      setImagesfliter(styleUrl);
    }
  }, [searchInput, styleUrl]);

  const handleFilter = async (filterName: string) => {
    if (filterName === 'All') {
      const convertedObject = convertPlaneArrayWithCategoryObject(stylesData);
      setStyleUrl(convertedObject);
      const promptCategoriesSet = [];
      promptCategoriesSet.push({name: 'All', isSelected: true});
      convertedObject.forEach((item: {type: string}) => {
        promptCategoriesSet.push({name: item.type, isSelected: false});
      });
      // Convert the Set to an array
      setFilterData(promptCategoriesSet);
    } else {
      const data = stylesData?.filter(
        (model: any) => model?.prompt_category === filterName,
      );
      const convertedObject = convertPlaneArrayWithCategoryObject(data);
      setStyleUrl(convertedObject);
    }
  };

  const onPressFilter = (index: number, item: filterItem) => {
    const data = filterData.map((obj: filterItem, i: number) => {
      if (index === i) {
        obj.isSelected = true;
      } else {
        obj.isSelected = false;
      }
      return item;
    });
    setSelectedFilter(item.name);
    setFilterEnable(false);
  };

  const filterItems = (items: any[]) => {
    return items.reduce((filteredItems: any[], d: {data: any[]}) => {
      const matchingData = d.data.filter(
        (item: {prompt_category: any; prompt: any}) => {
          const searchFrom = [item.prompt_category, item.prompt];
          return searchFrom.some(value =>
            value?.toLowerCase().includes(searchInput.toLowerCase()),
          );
        },
      );
      if (matchingData.length > 0) {
        filteredItems.push({...d, data: matchingData});
      }
      return filteredItems;
    }, []);
  };

  return (
    <View style={[styles.container]}>
      <CommonHeader
        noHeader={true}
        search
        filter
        searchInput={searchInput}
        onChangeSearchText={setSearchInput}
        filterPress={() => {
          setFilterEnable(!filterEnable);
        }}
      />
      {filterEnable ? (
        <FilterOption
          filterOption={filterData}
          onItemPress={onPressFilter}
          isScroll={true}
        />
      ) : null}

      {imagesfliter?.length > 0 ? (
        <PhotoStylesGridList
          data={imagesfliter}
          listStyle={{marginHorizontal: wp(3)}}
          imageStyle={styles.imgStyle}
          isText
          limitedSelection={10}
        />
      ) : (
        <FlatList
          data={rawData}
          numColumns={2}
          keyExtractor={item => item.toString()}
          renderItem={() => <View style={styles.imagesStyle} />}
        />
      )}

      <ContentBottomSheet
        data={data}
        onButtonPress={() => {
          setFirstAttention();
        }}
        modalizeRef={contentSheetRef}
      />
    </View>
  );
}
