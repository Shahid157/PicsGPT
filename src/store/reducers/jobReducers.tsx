import {jobInterface} from '../../interfaces/appCommonIternfaces';
import {
  CREATE_JOB_SUCCESS,
  SYNC_JOBS,
  UPDATE_JOB_DATA,
  UPDATE_JOB_STATUS,
  DELETE_JOB,
  RUNNING_JOB,
} from '../types';

interface Action {
  type: string;
  payload: any;
}

const initialState = {
  jobs: [],
  jobDetails: {},
  loading: false,
  runningJobs: [],
};

export default function jobsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case CREATE_JOB_SUCCESS: {
      let oldJobs: any[] = state.jobs;
      oldJobs.unshift(action.payload);
      return {
        ...state,
        jobs: oldJobs,
      };
    }

    case UPDATE_JOB_DATA: {
      let indexOfJob = state.jobs.findIndex(
        (job: jobInterface) => job.job_id === action?.payload?.job_id,
      );
      if (indexOfJob === -1) return state;
      let oldJobs: jobInterface[] = state.jobs;
      oldJobs[indexOfJob] = action.payload;
      return {
        ...state,
        jobs: oldJobs,
      };
    }

    case UPDATE_JOB_STATUS: {
      let indexOfJob = state.jobs.findIndex(
        (job: jobInterface) => job.job_id === action?.payload?.existingJobId,
      );
      if (indexOfJob === -1) return state;
      let oldJobs: jobInterface[] = state.jobs;
      oldJobs[indexOfJob] = {
        ...oldJobs[indexOfJob],
        job_id: action.payload.newJobId,
        status: action.payload.newStatus,
      };
      return {
        ...state,
        jobs: oldJobs,
      };
    }

    case DELETE_JOB: {
      const jobToDeleteId = action.payload;
      const updatedJobs = state.jobs.filter(
        (job: jobInterface) => job.job_id !== jobToDeleteId,
      );
      return {
        ...state,
        jobs: updatedJobs,
      };
    }

    case RUNNING_JOB: {
      let oldJobs: any[] = [];
      oldJobs.unshift(action.payload);
      return {
        ...state,
        runningJobs: oldJobs,
      };
    }

    case SYNC_JOBS: {
      return {
        ...state,
        jobs: action.payload,
      };
    }
    default:
      return state;
  }
}
