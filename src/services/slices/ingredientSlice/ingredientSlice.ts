import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

type TIngredientsState = {
  ingredients: TIngredient[];
  error?: string | null;
  loading: boolean;
};

const initialState: TIngredientsState = {
  ingredients: [],
  error: null,
  loading: false
};

export const getIngredients = createAsyncThunk(
  'ingredient/getIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(getIngredients.fulfilled, (state, { payload }) => {
        state.ingredients = payload;
        state.loading = false;
      });
  },
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    ingredientsLoadingSelector: (state) => state.loading
  }
});

export const { ingredientsSelector, ingredientsLoadingSelector } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
