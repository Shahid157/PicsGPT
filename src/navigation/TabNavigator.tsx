/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import MyTabBar from './MyTabBar';
import AddModel from '../screens/AddModel';
import Activity from '../screens/Activity';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ModelDisplay from '../screens/ModelDisplay';
import UserDetail from '../screens/UserDetail';
import EditModel from '../screens/EditModel';
import AddPhotoAIModel from '../screens/AddPhotoAIModel';
import ImageViewer from '../screens/UserDetail/ImageViewer';
import {useRoute} from '@react-navigation/native';
import {
  TabNavigatorParams,
  HomeStackNavigatorParams,
  PhotoAIStackParams,
} from './types';
import AddLocation from '../screens/AddLocation';
import AddStyle from '../screens/AddStyle';
import GuideLines from '../screens/GuideLines';
import UploadImage from '../screens/UploadImage';
import PhotoAI from '../screens/PhotoAI/PhotoAI';

const Tab = createBottomTabNavigator<TabNavigatorParams>();
const HomeStack = createNativeStackNavigator<HomeStackNavigatorParams>();
const PhotoAIStack = createNativeStackNavigator<PhotoAIStackParams>();
const UploadPhotoStack = createNativeStackNavigator();
const ProfileStackNavigator = createNativeStackNavigator();

const HomeStackNavigator = () => {
  const route = useRoute();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen
        name="HomeStack"
        component={Home}
        initialParams={route.params}
      />
      <HomeStack.Screen component={ImageViewer} name="ImageViewer" />
      <HomeStack.Screen name="ModelDisplay" component={ModelDisplay} />
      <HomeStack.Screen name="UserDetail" component={UserDetail} />
      <HomeStack.Screen name="EditModel" component={EditModel} />
    </HomeStack.Navigator>
  );
};
const UserUploadPhotoNavigator = () => {
  const route = useRoute();
  return (
    <UploadPhotoStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="UploadImageGuidelines">
      <UploadPhotoStack.Screen
        name="UploadImageGuidelines"
        component={GuideLines}
        initialParams={route.params}
      />
      <UploadPhotoStack.Screen name="UploadImage" component={UploadImage} />
    </UploadPhotoStack.Navigator>
  );
};

const ProfileStack = () => {
  const route = useRoute();
  return (
    <ProfileStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStackNavigator.Screen component={UserDetail} name="UserDetail" />
      <ProfileStackNavigator.Screen
        component={ImageViewer}
        name="ImageViewer"
      />
    </ProfileStackNavigator.Navigator>
  );
};

const PhotoAINavigator = () => {
  return (
    <PhotoAIStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="AddPhotoAI">
      <PhotoAIStack.Screen name="AddPhotoAI" component={PhotoAI} />
      <PhotoAIStack.Screen
        name="GuideLines"
        component={UserUploadPhotoNavigator}
        options={{presentation: 'modal', gestureEnabled: false}}
      />
      <PhotoAIStack.Screen name="AddPhotoAIModel" component={AddPhotoAIModel} />
      <PhotoAIStack.Screen name="AddStyle" component={AddStyle} />
      <PhotoAIStack.Screen name="AddLocation" component={AddLocation} />
      <PhotoAIStack.Screen component={ImageViewer} name="ImageViewer" />
    </PhotoAIStack.Navigator>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />

      {/* will focus on these two tabs stack after making other stacks stable */}
      {/* <Tab.Screen name="AddModel" component={AddModel} /> */}
      {/* <Tab.Screen name="Activity" component={Activity} /> */}

      <Tab.Screen name="AddPhotoAIStyle" component={PhotoAINavigator} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
}
