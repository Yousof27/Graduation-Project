import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CartOperationsApi } from "../../../../redux/auth/authApis";
import styles from './headerCartItem.module.css'

function HeaderCartItem({ data, quantity, setCheckoutPageKey }) {

    const { id, title, price, url } = data;

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const buyHandler = () => {
        setCheckoutPageKey(true);
        navigate(`/checkout`, {
            state: {
                type: id,
                products: [data],
                totalPrice: price * quantity,
                quantity,
            }
        });
    }

    const removeHandler = () => dispatch(CartOperationsApi({ operation: "remove", data: id }));

    const increaseHandler = () => dispatch(CartOperationsApi({ operation: "increase", data: id }));

    const decreaseHandler = () => dispatch(CartOperationsApi({ operation: "decrease", data: id }));

    return (
        <div className={styles.box} id={1}>
            <div className={styles.product_image}>
                <img src={url} alt={title} loading="lazy" />
            </div>

            <div className={styles.data}>
                <div className={styles.text}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.price}>${price}</p>
                </div>
                <div className={styles.quantity_con}>
                    <span className={styles.less} onClick={decreaseHandler}>{'-'}</span>
                    <span className={styles.quantity}>{quantity}</span>
                    <span className={styles.more} onClick={increaseHandler}>{'+'}</span>
                </div>
                <div className={`${styles.btns}`}>
                    <button className={styles.remove} onClick={removeHandler}>remove</button>
                    <button className={styles.buy} onClick={buyHandler}>buy</button>
                </div>
            </div>
        </div>
    )
}

export default HeaderCartItem