/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { LoaderPage } from "../../common/loading spinners/Loaders";
import styles from "./postReviewCon.module.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import StarRatingInput from "../../common/star rating/StarRatingInput";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useAddReview, useUpdateReview } from "../../../redux/reviews/reviewsApis";
import { motion, AnimatePresence } from "framer-motion";

const PostReviewCon = ({ title, data, Component, type }) => {
  const doctorId = useParams().id;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const reviewInputRef = useRef(null);
  const firstReviewRef = useRef(null);
  const [highlightFirstReview, setHighlightFirstReview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

  // Find if the user has already submitted a review
  const userReview = data.find((review) => review.clientName === user?.username);
  const isUpdateMode = !!userReview;

  const scrollToFirstReview = () => {
    setTimeout(() => {
      setHighlightFirstReview(true);
      firstReviewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setTimeout(() => setHighlightFirstReview(false), 1000);
    }, 400);
  };

  const { mutate: addReview } = useAddReview(doctorId, scrollToFirstReview);
  const { mutate: updateReview } = useUpdateReview(doctorId, scrollToFirstReview);

  const initialValues = {
    clientId: user?.id,
    clientName: user?.username,
    comment: isUpdateMode ? userReview.comment : "",
    rating: isUpdateMode ? userReview.rating : 0,
  };

  const validationSchema = Yup.object({
    comment: Yup.string().required("Comment is required"),
    rating: Yup.number().min(1, "Please rate").required("Rating is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    if (isUpdateMode) {
      updateReview({
        ...values,
        timestamp: new Date().toISOString(),
      });
    } else {
      addReview({
        ...values,
        timestamp: new Date().toISOString(),
      });
    }
    setShowForm(false);
    resetForm();
  };

  const toggleForm = () => {
    if (!isAuthenticated) return navigate("/login");
    setShowForm(!showForm);
    setIsFormFocused(!showForm);
    if (!showForm) {
      setTimeout(() => reviewInputRef.current?.focus(), 350);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {type === "review" && data.length > 0 && (
          <div className={styles.reviewStats}>
            <div className={styles.ratingBadge}>
              {(data.reduce((acc, curr) => acc + curr.rating, 0) / data.length).toFixed(1)}
              <span>/5</span>
            </div>

            <div className={styles.reviewCount}>{data.length} reviews</div>
          </div>
        )}
      </div>
      <div className={`${styles.innerCon} ${type === "review" ? styles.review : ""}`}>
        {type === "review" && data.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <div className={styles.eyeIcon}>👁️</div>
              <div className={styles.plusIcon}>+</div>
            </div>
            <p>No reviews yet</p>
            <p>Be the first to share your experience!</p>
            <button className={styles.ctaButton} onClick={toggleForm}>
              Add Review
            </button>
          </div>
        ) : (
          <div className={styles.data}>
            {type === "review" &&
              Array.isArray(data) &&
              data.map((d, i) => <Component key={i} data={d} animated={i === 0 && highlightFirstReview} ref={i === 0 ? firstReviewRef : null} />)}
          </div>
        )}
      </div>

      {type === "review" && (
        <AnimatePresence>
          {showForm && (
            <motion.div
              className={`${styles.formCon} ${isFormFocused ? styles.focused : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* <div GrownD  */}
              <div className={styles.formHeader}>
                <h4>{isUpdateMode ? "Update Your Review" : "Add Your Review"}</h4>
                <button className={styles.closeButton} onClick={toggleForm}>
                  <IoMdClose />
                </button>
              </div>

              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isValid, dirty, values }) => (
                  <Form className={styles.form}>
                    <div className={styles.formGroup}>
                      <label>Your Rating</label>
                      <div className={styles.ratingContainer}>
                        <Field name="rating" component={StarRatingInput} className={styles.ratingInput} />
                        <div className={styles.ratingValue}>
                          {values.rating ? Number(values.rating.toFixed(1)) : 0}
                          /5
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="comment">Your Experience</label>
                      <Field
                        as="textarea"
                        name="comment"
                        placeholder="Share your experience with this doctor..."
                        innerRef={reviewInputRef}
                        className={styles.textarea}
                        onFocus={() => setIsFormFocused(true)}
                        onBlur={() => setIsFormFocused(false)}
                      />
                    </div>

                    <div className={styles.formActions}>
                      <motion.button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={!(isValid && dirty)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isUpdateMode ? "Update Review" : "Submit Review"}
                      </motion.button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {type === "review" && !showForm && (
        <div className={styles.fabContainer}>
          {user?.role !== "admin" && (
            <motion.button className={styles.fabButton} onClick={toggleForm} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IoMdAdd className={styles.fabIcon} />
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostReviewCon;
