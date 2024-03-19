import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

interface LstestJobsState {
  latestJobs: Record<string, any>;
}

const initialState: LstestJobsState = {
  latestJobs: [],
};

export const latestJobsSlice = createSlice({
  name: 'latestJobs',
  initialState,
  reducers: {
    addLatestJobs: (state, action: PayloadAction<Record<string, any>>) => {
      return {
        ...state,
        latestJobs: Array.isArray(state.latestJobs)
          ? [...state.latestJobs, action.payload]
          : [action.payload],
      };
    },
    emptyLatestJobs: state => {
      state.latestJobs = {};
    },
  },
});

export const {addLatestJobs, emptyLatestJobs} = latestJobsSlice.actions;

export const selectModel = (state: RootState) => state.latestJobs.latestJobs;

export default latestJobsSlice.reducer;
