import React, { forwardRef } from "react";
import styles from "./reviews.module.css";
import { FaStar } from "react-icons/fa";

const Review = forwardRef(({ data: review, animated }, ref) => {
  return (
    <div className={`${styles.review} ${animated ? styles.commentFadeIn : ""}`} ref={ref}>
      <p className={styles.date}>{new Date(review.timestamp).toLocaleDateString()}</p>
      <p className={styles.time}>{new Date(review.timestamp).toLocaleTimeString()}</p>
      <div className={styles.header}>
        <strong>{review.clientName}</strong>
        <div className={styles.rating}>
          <FaStar color="gold" />
          {review.rating}
        </div>
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </div>
  );
});

export default Review;
