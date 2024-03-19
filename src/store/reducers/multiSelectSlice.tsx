import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

interface MultiSelectState {
  selectedImages: string[];
}

const initialState: MultiSelectState = {
  selectedImages: [],
};

export const multiSelectSlice = createSlice({
  name: 'selectedImages',
  initialState,
  reducers: {
    addSelectedImage: (state, action: PayloadAction<any>) => {
      let styleID = action.payload.style_id;
      const existingImage = state.selectedImages.includes(styleID);
      if (!existingImage) {
        state.selectedImages.push(styleID);
      }
    },
    addSelectedImages: (state, action: PayloadAction<any>) => {
      let styleIDs = action.payload;
      if (styleIDs?.length) {
        state.selectedImages = styleIDs;
      }
    },
    removeSelectedImage: (state, action: PayloadAction<any>) => {
      let styleID = action.payload.style_id;
      state.selectedImages = state.selectedImages.filter(
        style => style !== styleID,
      );
    },
    clearCategory: (state, action: PayloadAction<any>) => {
      const ids = action.payload;
      const selected = state.selectedImages.filter(
        (style: any) => !ids.includes(style),
      );
      state.selectedImages = selected;
    },

    resetSelectedImages: state => {
      state.selectedImages = [];
    },
  },
});

export const {
  addSelectedImage,
  addSelectedImages,
  removeSelectedImage,
  resetSelectedImages,
  clearCategory,
} = multiSelectSlice.actions;

export const selectImages = (state: RootState) =>
  state.selectedImages.selectedImages;

export default multiSelectSlice.reducer;
