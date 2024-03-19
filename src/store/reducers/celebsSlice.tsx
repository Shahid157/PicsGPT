import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

const initialState = {
  celebsData: [] as any[],
};

export const celebsDataSlice = createSlice({
  name: 'celebsData',
  initialState,
  reducers: {
    addCelebsData: (state, action: PayloadAction<any[]>) => {
      const newData = action.payload.flat();
      newData.forEach(newCeleb => {
        const isExisting = state.celebsData.some(
          celeb => celeb.id === newCeleb.id,
        );
        if (!isExisting) {
          state.celebsData.push(newCeleb);
        }
      });
    },
  },
});

export const {addCelebsData} = celebsDataSlice.actions;

export const selectCelebs = (state: RootState) => state.celebsData.celebsData;

export default celebsDataSlice.reducer;
