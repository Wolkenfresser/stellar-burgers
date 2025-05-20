import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { ReactElement } from 'react';
import { useSelector } from '../services/store';

import {
  isAuthCheckedSelector,
  userSelector
} from '../services/slices/userSlice/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  return children;
};
