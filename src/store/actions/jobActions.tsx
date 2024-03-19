import {
  ADD_JOB_DATA,
  UPDATE_JOB_DATA,
  CREATE_JOB_SUCCESS,
  SYNC_JOBS,
  TRACKING_JOB_SUCCESS,
  UPDATE_JOB_STATUS,
  DELETE_JOB,
  RUNNING_JOB,
} from '../types';

const addNewJob = (payload: any) => ({
  type: CREATE_JOB_SUCCESS,
  payload,
});

const updateJobStatus = (payload: any) => ({
  type: UPDATE_JOB_STATUS,
  payload,
});

const updateJob = (payload: any) => ({
  type: UPDATE_JOB_DATA,
  payload,
});

const syncJobs = (payload: any) => ({
  type: SYNC_JOBS,
  payload,
});

const deleteJob = (payload: any) => ({
  type: DELETE_JOB,
  payload,
});

const setTrackJob = (payload: any) => ({
  type: TRACKING_JOB_SUCCESS,
  payload,
});

const runningJob = (payload: any) => ({
  type: RUNNING_JOB,
  payload,
});

const addModelImages = (payload: any) => {
  return {
    type: ADD_JOB_DATA,
    payload: payload,
  };
};

export default {
  addNewJob,
  updateJob,
  syncJobs,
  setTrackJob,
  addModelImages,
  updateJobStatus,
  deleteJob,
  runningJob,
};
