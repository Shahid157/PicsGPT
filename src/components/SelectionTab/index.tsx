import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {colors, SvgIcon} from '../../assets';
import {CommonHeader, FontText} from '../../components';
import {normalize, wp} from '../../styles/responsiveScreen';
import globalStyles from '../../styles';
import FastImage from 'react-native-fast-image';
// import {selectionData} from '../../constants/data';
import {useSelector} from 'react-redux';

interface SelectionTabProps {
  selectionProcess?: any;
  isType?: string;
  onClosePress?: () => void;
  onNextPress?: () => void;
  isLocation?: boolean;
  navigation?: any;
  modelCategory: any;
}

export default function SelectionTab({
  selectionProcess,
  onClosePress,
  onNextPress,
  isLocation,
  navigation,
  isType,
  modelCategory,
}: //   isType,
SelectionTabProps) {
  const selectedData = useSelector(
    (state: any) => state.addReducer.jobCollection,
  );

  const onStepHandler = (type?: any) => {
    if (type === 'Model') {
      navigation.getParent()?.navigate('AddModel');
    } else if (type === 'Style') {
      navigation.getParent()?.navigate('AddStyle');
    } else if (type === 'Location') {
      navigation.getParent()?.navigate('AddLocation');
    }
  };

  const onClose = () => {
    selectionProcess.map((obj: any) => {
      if (obj.type === 'Model') {
        return {...obj, isSelected: false, image: ''};
      }
      return obj;
    });
    onClosePress && onClosePress();
  };

  const EmptyImageView = (item?: any) => {
    const isSelected = item.item?.type === isType;
    return (
      <View
        style={[
          styles.imageBox,
          {
            borderColor: isSelected ? colors.blue : '#00000010',
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      />
    );
  };

  const ImageView = (item: any) => {
    const isSelected = item?.type === isType;
    return item?.image ? (
      <FastImage
        style={[
          styles.imageBox,
          {
            borderColor: isSelected ? colors.blue : '#00000010',
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        source={{
          uri: item?.image,
          priority: FastImage.priority.high,
        }}
        // resizeMode="contain"
      />
    ) : null;
  };

  const renderImageView = (item: any) => {
    const modelUrl = selectedData?.modelUrl;
    const styleUrl = selectedData?.clothUrl;
    const locationUrl = selectedData?.locationImage;
    switch (item.type) {
      case 'Model':
        return modelUrl !== '' ? (
          <ImageView image={modelUrl} type={item.type} />
        ) : (
          <EmptyImageView item={item} />
        );
      case 'Style':
        return styleUrl !== '' ? (
          <ImageView image={styleUrl} type={item.type} />
        ) : (
          <EmptyImageView item={item} />
        );
      case 'Location':
        return locationUrl !== '' ? (
          <ImageView image={locationUrl} type={item.type} />
        ) : (
          <EmptyImageView item={item} />
        );
      default:
        return <EmptyImageView item={item} />;
    }
  };

  const data = [{type: 'Model'}, {type: 'Style'}, {type: 'Location'}];

  return (
    <View style={styles.topContainer}>
      <View style={globalStyles.rowJB}>
        <TouchableOpacity
          onPress={onClose}
          style={[
            globalStyles.colC,
            globalStyles.boxShadow,
            styles.previousBox,
          ]}>
          <SvgIcon.Close />
        </TouchableOpacity>
        {data.map((item: any, index: number) => {
          return (
            <Pressable
              onPress={() => onStepHandler(item.type)}
              key={index}
              style={globalStyles.colC}>
              {renderImageView(item)}
              {/* {item?.image ? (
                <FastImage
                  style={[
                    styles.imageBox,
                    {
                      borderColor: item.isSelected ? colors.blue : '#00000010',
                      borderWidth: item.isSelected ? 2 : 1,
                    },
                  ]}
                  source={{
                    uri:
                      item?.type === 'Style'
                        ? item?.image
                        : item?.image?.trim(),
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode="contain"
                />
              ) : ( */}
              {/* )} */}
              <FontText
                name="medium"
                size={normalize(10)}
                color={colors.gray3}
                pTop={wp(1.5)}>
                {item.type}
              </FontText>
            </Pressable>
          );
        })}
        <TouchableOpacity
          disabled={isLocation ? false : true}
          onPress={onNextPress}
          style={[
            globalStyles.colC,
            styles.previousBox,
            {backgroundColor: isLocation ? colors.blue : '#120CCA50'},
          ]}>
          <SvgIcon.Forward />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingTop: wp(2),
    paddingHorizontal: wp(4),
    paddingBottom: wp(1),
  },
  previousBox: {
    height: wp(11),
    width: wp(11),
    borderRadius: wp(3),
    backgroundColor: colors.white,
  },
  imageBox: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(2),
    backgroundColor: colors.gray4,
    borderWidth: 1,
    borderColor: '#00000010',
  },
  categoryView: {
    marginHorizontal: wp(2.5),
    paddingTop: wp(4),
    paddingBottom: wp(1),
  },
  categoryBox: {
    backgroundColor: colors.black,
    marginLeft: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(5),
    borderWidth: 2,
  },
});
