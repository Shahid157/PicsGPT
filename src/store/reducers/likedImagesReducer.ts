import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export const likeImageSlice = createSlice({
  name: 'likedModals',
  initialState: [],
  reducers: {
    addLikedImages: (state, action: PayloadAction<{}>) => {
      state.push(action.payload);
    },
    removeLikedImages: (state, action: PayloadAction<any[]>) => {
      const removed = state.filter(obj => {
        return obj?.job_id !== action.payload;
      });

      return removed;
    },
  },
});
export const {addLikedImages, removeLikedImages} = likeImageSlice.actions;
export default likeImageSlice.reducer;
