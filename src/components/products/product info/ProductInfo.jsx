import styles from "./productInfo.module.css";
import { FaShoppingCart, FaArrowLeft, FaGlasses } from "react-icons/fa";
import useCart from "../../../hooks/useCart";
import { useNavigate, useParams } from "react-router-dom";
import { useProductById } from "../../../redux/products/productsApis";
import { useSelector } from "react-redux";

const ProductInfo = () => {
  const { id: productid } = useParams();
  const navigate = useNavigate();
  const { data, isPending, error } = useProductById(productid);
  const cartData = useCart(data);

  const userRole = useSelector((state) => state?.auth?.user?.role);

  // Loading state
  if (isPending) return <div className={styles.loading}>Loading...</div>;

  // Error state
  if (error) return <div className={styles.error}>Error loading product details.</div>;

  // No data
  if (!data) return <div className={styles.error}>Product not found.</div>;

  const { id, name, brand, desc, sideEffect, type, disease, category, price, maxQuantity, sales, url } = data;

  const { inCart, addToCartHandler, removeFromCartHandler } = cartData || {};
  const typesLevel = {
    Drops: "#FF6B6B",
    Pill: "#4ECDC4",
    Injection: "#9D00FF",
    Implant: "#FF9E6D",
    Glasses: "#FFD166",
  };

  const stockStatus = maxQuantity > 5 ? "Available" : maxQuantity === 0 ? "Not Available" : `Only ${maxQuantity} remains`;

  const stockClass = maxQuantity > 5 ? styles.available : maxQuantity === 0 ? styles.notAvailable : styles.lowStock;

  const fieldsToDisplay = [
    { label: "Name", value: name },
    { label: "Brand", value: brand },
    { label: "Description", value: desc },
    { label: "Side Effects", value: sideEffect },
    { label: "Type", value: type },
    { label: "Disease", value: disease },
    { label: "Category", value: category },
    { label: "Price", value: `$${price}` },
    { label: "Sales", value: sales },
  ].filter(({ value }) => value && value.toString().toLowerCase() !== "none");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {!["admin", "doctor"].includes(userRole) && (
          <button onClick={() => navigate("/market")} className={styles.backButton} aria-label="Back to products">
            <FaArrowLeft className="mr-2" />
            Back to Products
          </button>
        )}

        <div className={styles.content}>
          <div className={`${styles.imageContainer}`}>
            <div className={styles.imageWrapper}>
              <img src={url} alt={name} className={styles.productImage} loading="lazy" />
              <div className={styles.typeBadge} style={{ backgroundColor: typesLevel[type] }}>
                {type}
              </div>
            </div>

            {type === "Glasses" && userRole !== "admin" && (
              <button className={styles.tryARButton} onClick={() => navigate(`/tryAr/${id}`)}>
                <FaGlasses className="mr-2" />
                Try AR
              </button>
            )}
          </div>

          <div className={`${styles.infoContainer}`}>
            <div className={styles.header}>
              <h1 className={styles.title}>{name}</h1>
              <div className={styles.brandTag}>{brand}</div>
            </div>

            <div className={styles.stockStatus}>
              <span className={styles.stockLabel}>Availability:</span>
              <span className={`${styles.stockValue} ${stockClass}`}>{stockStatus}</span>
            </div>

            <div className={styles.fieldsGrid}>
              {fieldsToDisplay.map(({ label, value }) => (
                <div key={label} className={styles.field}>
                  <span className={styles.label}>{label}:</span>
                  <span className={styles.value}>{value}</span>
                </div>
              ))}
            </div>

            <div className={styles.priceContainer}>
              <div className={styles.price}>${price}</div>
              <button
                className={`${styles.button} ${inCart ? styles.remove : styles.add}`}
                onClick={
                  ["admin", "doctor"].includes(userRole)
                    ? () => navigate(`/${userRole === "admin" ? "market_management" : "market"}`)
                    : inCart
                    ? removeFromCartHandler
                    : addToCartHandler
                }
              >
                <FaShoppingCart className="mr-2" />
                {["admin", "doctor"].includes(userRole) ? "Return To Market" : inCart ? "Remove from cart" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
