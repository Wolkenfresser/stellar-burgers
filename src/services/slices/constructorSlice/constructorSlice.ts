import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      payload.type === 'bun'
        ? (state.bun = payload)
        : state.ingredients.push(payload);
    },
    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== payload
      );
    },
    changeOrderIngredients: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const [movedItem] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedItem);
    },
    resetConstructor: (state) => initialState
  },
  selectors: {
    constructorSelector: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  changeOrderIngredients,
  resetConstructor
} = constructorSlice.actions;

export const { constructorSelector } = constructorSlice.selectors;

export default constructorSlice.reducer;
