import {CommonActions} from '@react-navigation/native';

let navigationRef: any;

export function setTopLevelNavigation(navigatorRef : any) {
  navigationRef = navigatorRef;
}

export function resetNavigateTo(navigation: any, routeName :string , params: any) {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: routeName, params}],
    }),
  );
}

export function resetNavigate(routeName: string, params: any) {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: routeName, params}],
    }),
  );
}

export function navigationCheckShouldComponentUpdate(props : any) {
  const {navigation} = props;
  return navigation.isFocused();
}

export function navigateTo(routeName: string, params: any) {
  navigationRef.navigate(routeName, params);
}
