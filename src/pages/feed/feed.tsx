import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  feedSelector,
  resetFeeds
} from '../../services/slices/feedSlice/feedSlice';
import { getFeeds } from '../../services/slices/feedSlice/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
    return () => {
      dispatch(resetFeeds());
    };
  }, []);

  const feed = useSelector(feedSelector);
  const orders: TOrder[] = feed.orders;
  const handleGetFeeds = () => {
    dispatch(resetFeeds());
    dispatch(getFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
