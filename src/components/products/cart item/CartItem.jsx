import { useNavigate } from "react-router-dom";
import styles from "./cartItem.module.css";
import { useDispatch } from "react-redux";
import { CartOperationsApi } from "../../../redux/auth/authApis";

function CartItem({ data, quantity, setCheckoutPageKey }) {
  const { id, name, price, url } = data;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const productInfoHandler = () => {
    navigate(`/market/${id}`, { state: { selectedProduct: data } });
  };

  const buyHandler = () => {
    setCheckoutPageKey(true);
    navigate(`/checkout`, {
      state: {
        type: id,
        products: [data],
        totalPrice: price * quantity,
        quantity,
      },
    });
  };

  const removeHandler = () => {
    dispatch(CartOperationsApi({ operation: "remove", data: id }));
  };

  const increaseHandler = () => {
    dispatch(CartOperationsApi({ operation: "increase", data: id }));
  };

  const decreaseHandler = () => {
    dispatch(CartOperationsApi({ operation: "decrease", data: id }));
  };

  return (
    <div className={styles.box} id={id}>
      <div className={styles.product_image} onClick={productInfoHandler}>
        <img src={url} alt={name} loading="lazy" />
      </div>

      <div className={styles.data}>
        <div className={styles.text}>
          <h2 className={styles.title} onClick={productInfoHandler}>
            {name}
          </h2>
          <p className={styles.price}>${price}</p>
        </div>
        <div className={styles.quantity_con}>
          <span className={styles.less} onClick={decreaseHandler}>
            {"-"}
          </span>
          <span className={styles.quantity}>{quantity}</span>
          <span className={styles.more} onClick={increaseHandler}>
            {"+"}
          </span>
        </div>
        <div className={styles.btns}>
          <button className={styles.remove} onClick={removeHandler}>
            remove
          </button>
          <button className={styles.buy} onClick={buyHandler}>
            buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;