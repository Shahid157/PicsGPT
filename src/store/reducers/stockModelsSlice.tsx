import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

const initialState = {
  stockModelsData: [] as any[],
};

export const stockModelSlice = createSlice({
  name: 'stockModelsData',
  initialState,
  reducers: {
    addStockModelData: (state, action: PayloadAction<any[]>) => {
      const newData = action.payload.flat();
      newData.forEach(newModel => {
        const isExisting = state.stockModelsData.some(
          model => model.id === newModel.id,
        );
        if (!isExisting) {
          state.stockModelsData.push(newModel);
        }
      });
    },
  },
});

export const {addStockModelData} = stockModelSlice.actions;

export const selectStockModels = (state: RootState) =>
  state.stockModelsData.stockModelsData;

export default stockModelSlice.reducer;
