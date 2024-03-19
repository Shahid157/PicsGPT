import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Asset} from 'react-native-image-picker';

export type TabNavigatorParams = {
  Home: NavigatorScreenParams<HomeStackNavigatorParams>;
  AddModel: undefined;
  Activity: undefined;
  AddPhotoAIStyle: undefined;
  ProfileStack: {userImg: string};
  AddStyle: undefined;
  AddLocation: {selectedStyle: any; selectedModel: any};
  GuideLines: {selectionType: string};
  UploadImage: {imageList: Asset[]; selectionType: string};
  AddPhotoAIModel: undefined;
};
export type PhotoAIStackParams = {
  Home: NavigatorScreenParams<HomeStackNavigatorParams>;
  AddModel: any;
  Activity: any;
  AddPhotoAIStyle: any;
  UserDetail: {userImg: string};
  AddStyle: any;
  AddLocation: {selectedStyle: any; selectedModel: any};
  GuideLines: {selectionType: string};
  UploadImage: {imageList: Asset[]; selectionType: string};
  AddPhotoAIModel: any;
  navigation: any;
};

export type TabScreenProps<T extends keyof TabNavigatorParams> =
  BottomTabScreenProps<TabNavigatorParams, T>;

export type HomeStackNavigatorParams = {
  HomeStack: {isPaymentDone: boolean};
  ModelDisplay: {modelDetails: any};
  UserDetail: {userImg: string; route?: any; navigation?: any};
  EditModel: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackNavigatorParams> =
  NativeStackScreenProps<HomeStackNavigatorParams, T>;

export type DrawerParams = {
  Tabs: any;
  GuideLines: {selectionType: string};
  UploadImage: {imageList: Asset[]; selectionType: string};
  AddStyle: {image: any};
  AddLocation: {selectedStyle: any; selectedModel: any};
  navigation: any;
  Payment: {
    selectedStyle: any;
    selectedModel: any;
    selectedLocation: any;
    isPhotoAIScreen: boolean;
  };
};

export type DrawerStackProps<T extends keyof DrawerParams> = DrawerScreenProps<
  DrawerParams,
  T
>;

export type ApplicationParams = {
  MyDrawer: undefined;
  Splash: undefined;
};
