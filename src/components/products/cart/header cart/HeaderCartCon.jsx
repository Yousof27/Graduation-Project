/* eslint-disable no-undef */
import { useDispatch, useSelector } from 'react-redux';
import { CartOperationsApi } from '../../../../redux/auth/authApis';
import { useNavigate } from 'react-router-dom';
import styles from './headerCartCon.module.css';

function HeaderCartCon() {
    const cartData = useSelector(state => state.auth.user.cartInfo);
    const dispatch = useDispatch();

    const clearHandler = () => dispatch(CartOperationsApi({ operation: "clear", data: null }));

    const navigate = useNavigate();

    const buyHandler = () => {
        navigate(`/checkout`, {
            state: {
                type: 'all',
                products: cartData.cart,
                totalPrice: cartData.totalPrice,
                quantity: 0,
            }
        });
    }

    return (
        <>
            <div className={styles.page}>
                <div className={`container ${styles.container}`}>
                    <h2 className={`${styles.page_title} ${cartData?.isEmpty && styles.empty}`}>Your Cart{cartData?.isEmpty ? ' is empty' : ''}</h2>

                    <div className={styles.boxs_con}>
                        {cartData.cart.map(p => <CartItem key={p.product.id} data={p.product} quantity={p.quantity} setCheckoutPageKey={setCheckoutPageKey} />)}
                    </div>

                    {!cartData?.isEmpty ?
                        <div className={styles.options}>
                            <p>Total: ${cartData.totalPrice}</p>
                            <div className={styles.btns}>
                                <button className={styles.clear} onClick={clearHandler}>Clear</button>
                                <button className={styles.buy_all} onClick={buyHandler}>Buy All</button>
                            </div>
                        </div> : null}
                </div>
            </div>
        </>
    )
}

export default HeaderCartCon