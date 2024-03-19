import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store';

interface UserGenerationsState {
  userGenerations: any;
}

const initialState: UserGenerationsState = {
  userGenerations: {},
};

export const userGenerationSlice = createSlice({
  name: 'userGenerations',
  initialState,
  reducers: {
    setUserGeneration: (state, action: PayloadAction<any>) => {
      state.userGenerations = action.payload
    }
  }
})

export const { setUserGeneration } = userGenerationSlice.actions;

export const selectUserGenerations = (state: RootState) => state.userGenerations.userGenerations;

export default userGenerationSlice.reducer;

