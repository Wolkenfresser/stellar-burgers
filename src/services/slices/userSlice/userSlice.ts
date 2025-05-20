import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  logoutApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie } from '../../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuth: boolean;
  loading: boolean;
  error?: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: true,
  isAuth: false,
  loading: false,
  error: null
};

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (registerData: Omit<TRegisterData, 'name'>) => {
    const response = await loginUserApi(registerData);
    const { refreshToken, accessToken, user, success } = response;
    if (success) {
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    return user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
  return response;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (registerData: TRegisterData) => await updateUserApi(registerData)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.loading = false;
        state.error = null;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.isAuthChecked = true;
        state.loading = false;
        state.error = error.message;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthChecked = true;
        state.isAuth = false;
        state.user = null;
        state.error = null;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.loading = false;
        state.error = null;
      });
  },
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    isAuthSelector: (state) => state.isAuth,
    userSelector: (state) => state.user,
    userNameSelector: (state) => state.user?.name,
    loadingSelector: (state) => state.loading,
    loginErrorSelector: (state) => state.error
  }
});

export const {
  userNameSelector,
  isAuthCheckedSelector,
  isAuthSelector,
  userSelector,
  loadingSelector,
  loginErrorSelector
} = userSlice.selectors;

export default userSlice.reducer;
