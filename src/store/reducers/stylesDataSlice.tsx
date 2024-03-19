import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

interface StyleData {
  Hidden: any;
  created_at: string;
  id: number;
  img_url: string;
  negative_prompt: any;
  prompt: string;
  prompt_category: string;
  prompt_name: string;
  style_id: string;
  tags: any;
}

interface StylesDataState {
  stylesData: StyleData[];
}

const initialState: StylesDataState = {
  stylesData: [],
};

export const stylesDataSlice = createSlice({
  name: 'stylesData',
  initialState,
  reducers: {
    addStylesData: (state, action: PayloadAction<StyleData[]>) => {
      const newData = action.payload.flat();
      newData.forEach(newStyle => {
        const isExisting = state.stylesData.some(
          style => style.id === newStyle.id,
        );
        if (!isExisting) {
          state.stylesData.push(newStyle);
        }
      });
    },
  },
});

export const {addStylesData} = stylesDataSlice.actions;

export const selectImages = (state: RootState) => state.stylesData.stylesData;

export default stylesDataSlice.reducer;
