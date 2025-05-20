import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetConstructor,
  constructorSelector
} from '../../services/slices/constructorSlice/constructorSlice';
import {
  orderLoadingSelector,
  orderItemSelector,
  resetOrderItem,
  orderBurger
} from '../../services/slices/orderSlice/orderSlice';
import { isAuthSelector } from '../../services/slices/userSlice/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const constructorItems = useSelector(constructorSelector);
  const orderRequest = useSelector(orderLoadingSelector);
  const orderModalData = useSelector(orderItemSelector);
  const isAuth = useSelector(isAuthSelector);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const orderData = !constructorItems.bun
      ? ['']
      : [
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((item) => item._id),
          constructorItems.bun._id
        ];

    dispatch(orderBurger(orderData));
  };

  const closeOrderModal = () => {
    dispatch(resetOrderItem());
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
