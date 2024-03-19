import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '..';
import {AnyAsyncThunk} from '@reduxjs/toolkit/dist/matchers';

const initialState = {
  multipleModelSelected: [],
};

export const multipleModelSelectedSlice = createSlice({
  name: 'modelSelectedSlice',
  initialState,
  reducers: {
    AddModel: (state, action: any) => {
      state.multipleModelSelected.push(action.payload);
    },
    DeleteModel: (state, action: any) => {
      let modelToDelete = action.payload;

      let updatedModels = state.multipleModelSelected?.filter(
        model => model?.id !== modelToDelete,
      );

      return {
        ...state,
        multipleModelSelected: updatedModels,
      };
    },
    EmptyModel: state => {
      state.multipleModelSelected = [];
    },
  },
});

export const {AddModel, DeleteModel, EmptyModel} =
  multipleModelSelectedSlice.actions;

export const selectModel = (state: RootState) =>
  state.modelSelected.modelSelected;

export default multipleModelSelectedSlice.reducer;
