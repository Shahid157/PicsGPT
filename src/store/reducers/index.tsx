import {combineReducers} from 'redux';
import userGenerations from './userGenerations';
import uploadImagesReducer from './uploadImagesReducer';
import jobs from './jobReducers';
import trackingJob from './trackingJob';
import addReducer from './addReducer';
import addPhotoAIReducer from './addPhotoAIReducer';
import modalReducer from './popUpReducer';
import chatReducer from './chatModalReducer';
import appStateReducer from './app.reducer';
import auth from './authReducer';
import fashion from './fashion.reducer';
import selectedImages from '../reducers/multiSelectSlice';
import modelSelected from '../reducers/modelSelectSlice';
import multipleModelSelectedSlice from './multipleModelSelectedSlice';
import stylesData from '../reducers/stylesDataSlice';
import stockModelsData from '../reducers/stockModelsSlice';
import celebsData from '../reducers/celebsSlice';
import userSelectedImagesReducer from './userSelectedImagesReducer';
import payments from '../reducers/userPayments.reducer';
import likedModals from '../reducers/likedImagesReducer';
import latestJobs from '../reducers/latestJobsSlice';

const appReducer = combineReducers({
  appStateReducer,
  userGenerations,
  uploadImagesReducer,
  jobs,
  trackingJob,
  likedModals,
  addReducer,
  addPhotoAIReducer,
  modalReducer,
  chatReducer,
  auth,
  fashion,
  selectedImages,
  modelSelected,
  stylesData,
  stockModelsData,
  celebsData,
  userSelectedImagesReducer,
  multipleModelSelectedSlice,
  payments,
  latestJobs,
});

export type rootReducer = ReturnType<typeof appReducer>;

const reducer = (state: any, action: {type: any}) => {
  return appReducer(state, action);
};

export default reducer;
