/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {name as appName} from './app.json';
import 'react-native-get-random-values'

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
