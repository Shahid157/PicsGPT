// store.js

import {createStore} from 'redux';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducer, {rootReducer} from './reducers';
import thunk from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'jobs', 'likedModals'],
};

const persistedReducer = persistReducer<rootReducer>(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
