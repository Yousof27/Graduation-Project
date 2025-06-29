import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { CartOperationsApi } from "../redux/auth/authApis";

function useCart(product) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const cartInfo = useSelector((state) => state.auth?.user?.cartInfo);

  const inCart = useMemo(() => {
    return cartInfo?.cart?.some((p) => p.product.id === product?.id);
  }, [cartInfo?.cart, product?.id]);

  const loginRedirectHandler = useCallback(() => {
    if (!authData.isAuthenticated) {
      navigate("/login");
      toast.info("Please Login First");
      return true;
    }
    return false;
  }, [authData.isAuthenticated, navigate]);

  const addToCartHandler = useCallback(async () => {
    try {
      if (loginRedirectHandler()) return;
      const res = await dispatch(CartOperationsApi({ operation: "add", data: product })).unwrap();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, [loginRedirectHandler, dispatch, product]);

  const removeFromCartHandler = useCallback(async () => {
    try {
      const res = await dispatch(CartOperationsApi({ operation: "remove", data: product?.id })).unwrap();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, product?.id]);

  return {
    inCart,
    addToCartHandler,
    removeFromCartHandler,
  };
}

export default useCart;
