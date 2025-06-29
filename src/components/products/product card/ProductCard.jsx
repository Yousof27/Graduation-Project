import { useNavigate } from "react-router-dom";
import styles from "./productCard.module.css";
import useCart from "../../../hooks/useCart";
import React from "react";
import { useSelector } from "react-redux";

function ProductCard({ data, children }) {
  const { id, name, desc, sales, type, price, url } = data;
  const { inCart, addToCartHandler, removeFromCartHandler } = useCart(data);

  const userRole = useSelector((state) => state?.auth?.user?.role);

  const typesLevel = {
    Drops: "#FF0000",
    Pill: "#008000",
    Injection: "#9D00FF",
    Implant: "#9D4199",
    Glasses: "#e2a900",
  };
  const navigate = useNavigate();

  const productInfoHandler = () => navigate(`/market/${id}`);

  const handleTryAR = (e) => {
    e.stopPropagation();
    navigate(`/tryAr/${id}`);
  };

  return (
    <div className={styles.box} id={id}>
      <div className={styles.image_con} onClick={productInfoHandler}>
        <div className={`${styles.top} cate`}>
          <div style={{ backgroundColor: typesLevel[type] }}>{type}</div>
          {type === "Glasses" && userRole !== "admin" && (
            <button className={styles.tryAR} onClick={(e) => handleTryAR(e)}>
              Try AR
            </button>
          )}
        </div>
        <img src={url} alt={name} className={styles.product_image} loading="lazy" />
      </div>
      <div className={styles.data}>
        <h2 className={styles.box_title} onClick={productInfoHandler}>
          {name}
        </h2>
        <p className={styles.desc}>{desc.slice(0, 50)}...</p>
        <p className={styles.sales}>Sales: {sales}</p>
        <div className={styles.main}>
          <p className={styles.price}>${price}</p>
          {userRole === "admin" ? (
            children
          ) : (
            <button
              className={`${styles.cart_btn} ${inCart ? styles.add_to_cart : styles.remove_from_cart}`}
              onClick={["admin", "doctor"].includes(userRole) ? productInfoHandler : inCart ? removeFromCartHandler : addToCartHandler}
            >
              {["admin", "doctor"].includes(userRole) ? "More Details" : inCart ? "Remove from cart" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
