import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';

type TOrderState = {
  orderItem: TOrder | null;
  orders: TOrder[];
  name: string;
  loading: boolean;
  error?: string | null;
};

const initialState: TOrderState = {
  orderItem: null,
  orders: [],
  name: '',
  loading: false,
  error: null
};

export const orderBurger = createAsyncThunk(
  'order/getOrderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export const getOrders = createAsyncThunk('orders/getAll', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/getItem',
  async (id: number) => await getOrderByNumberApi(id)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderItem(state) {
      state.orderItem = null;
    },
    resetOrders(state) {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(orderBurger.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.orderItem = payload.order;
        state.loading = false;
      });
    builder
      .addCase(getOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, { error }) => {
        state.error = error.message;
      })
      .addCase(getOrders.fulfilled, (state, { payload }) => {
        state.orders = payload;
      });
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, { payload }) => {
        state.orderItem = payload.orders[0];
        state.loading = false;
      });
  },
  selectors: {
    ordersSelector: (state) => state.orders,
    orderItemSelector: (state) => state.orderItem,
    orderLoadingSelector: (state) => state.loading
  }
});

export const { ordersSelector, orderItemSelector, orderLoadingSelector } =
  orderSlice.selectors;
export const { resetOrderItem, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
