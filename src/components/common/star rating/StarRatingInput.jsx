import React from "react";
import styles from "./StarRatingInput.module.css";

const StarRatingInput = ({ field, form, id }) => {
  const { name, value } = field;

  const handleChange = (newRating) => {
    form.setFieldValue(name, newRating);
  };

  return (
    <div className={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star} className={styles.starLabel} htmlFor={star === 1 ? id : undefined}>
          <input
            type="radio"
            name={name}
            id={star === 1 ? id : undefined}
            value={star}
            checked={value === star}
            onChange={() => handleChange(star)}
            className={styles.starInput}
          />
          <span className={`${styles.star} ${star <= value ? styles.filled : ""}`}>★</span>
        </label>
      ))}
    </div>
  );
};

export default StarRatingInput;
