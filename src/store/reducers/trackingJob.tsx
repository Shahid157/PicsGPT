import {TRACKING_JOB, TRACKING_JOB_ERROR, TRACKING_JOB_SUCCESS} from '../types';

const initialState = {
  photoAIJobs:[],
  jobTrackData: {},
  loading: false,
};

type Action = {
  type: string;
  payload?: any;
};

export default function trackingJob(state = initialState, action: Action) {
  switch (action.type) {
    case TRACKING_JOB:
      return Object.assign({}, state, {
        loading: true,
      });
    case TRACKING_JOB_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        jobTrackData: action.payload,
      });
    case TRACKING_JOB_ERROR:
      return Object.assign({}, state, {
        loading: false,
      });
    default:
      return state;
  }
}
