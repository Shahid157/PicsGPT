import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

interface ModelSelectState {
  modelSelected: Record<string, any>;
}

const initialState: ModelSelectState = {
  modelSelected: {},
};

export const modelSelectSlice = createSlice({
  name: 'modelSelected',
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<Record<string, any>>) => {
      state.modelSelected = action.payload;
    },
    resetModel: state => {
      state.modelSelected = {};
    },
  },
});

export const {setModel, resetModel} = modelSelectSlice.actions;

export const selectModel = (state: RootState) =>
  state.modelSelected.modelSelected;

export default modelSelectSlice.reducer;
