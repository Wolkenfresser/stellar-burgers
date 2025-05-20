import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientSlice/ingredientSlice';
import constructorReducer from './slices/constructorSlice/constructorSlice';
import orderReducer from './slices/orderSlice/orderSlice';
import feedsReducer from './slices/feedSlice/feedSlice';
import userReducer from './slices/userSlice/userSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedsReducer,
  user: userReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
