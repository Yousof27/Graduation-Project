import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./checkout.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddBillToUserHistory } from "../../redux/bills/billsApi.js";
import { successMessage, errorMessage } from "../../redux/toasts.js";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearCart } from "../../redux/auth/authSlice";

// Validation schema using Yup with detailed error messages
const validationSchema = Yup.object({
  nameOnCard: Yup.string()
    .required("Please enter the name on your card")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .test("no-numbers", "Name cannot contain numbers or special characters", (value) => {
      return value ? !/\d/.test(value) : true;
    }),

  cardNumber: Yup.string()
    .required("Please enter your card number")
    .matches(/^\d{16}$/, "Card number must be exactly 16 digits")
    .test("not-all-same", "Card number cannot be all the same digit", (value) => {
      if (!value) return false;
      const firstDigit = value.charAt(0);
      return value.split("").some((digit) => digit !== firstDigit);
    }),

  expiryDate: Yup.string()
    .required("Please enter the expiry date")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Date must be in MM/YY format (e.g., 12/25)")
    .test("not-expired", "Your card has expired. Please use a different card", (value) => {
      if (!value || !value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) return false;
      const [month, year] = value.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth());
      return expiry >= currentMonth;
    })
    .test("reasonable-future", "Expiry date seems too far in the future", (value) => {
      if (!value || !value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) return false;
      const [month, year] = value.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const tenYearsFromNow = new Date();
      tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
      return expiry <= tenYearsFromNow;
    }),

  cvv: Yup.string()
    .required("Please enter your CVV code")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits only")
    .test("cvv-length", "CVV should be 3 digits for most cards, 4 for American Express", (value) => {
      return value && (value.length === 3 || value.length === 4);
    }),

  location: Yup.string()
    .required("Please enter your location")
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location cannot exceed 100 characters")
    .matches(/^[a-zA-Z0-9\s,.-]+$/, "Location can only contain letters, numbers, spaces, commas, periods, and hyphens"),
});

function Checkout() {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const { type, products, quantity, totalPrice } = useLocation().state || {};
  const navigate = useNavigate();
  const { mutate: addBill, isLoading, error: mutationError } = useAddBillToUserHistory(user?.id);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Redirect if no checkout data
  if (!products || !totalPrice) {
    navigate("/cart");
    return null;
  }

  const manyProducts = type === "all";

  // Initial form values
  const initialValues = {
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    location: "", // Added location field
  };

  // Format expiry date input
  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  const handleSubmit = (values, { setSubmitting, setFieldError, resetForm }) => {
    setGeneralError("");

    // Generate unique bill ID
    const billId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create bill object matching the expected structure
    const newBill = {
      id: billId,
      products: manyProducts
        ? products.map((item) => ({
            id: item.product.id,
            img: item.product.url,
            title: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }))
        : products.map((item) => ({
            id: item.id,
            img: item.url,
            title: item.name,
            price: item.price,
            quantity: quantity,
          })),
      totalPrice: totalPrice,
      orderDate: new Date().toISOString(),
      location: values.location, // Include location in the bill
    };

    addBill(newBill, {
      onSuccess: () => {
        // Clear the cart in Redux store after successful purchase
        dispatch(clearCart());
        // Show success toast notification
        successMessage("Your order has been placed", {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: false,
          toastId: `success_${billId}`,
        });
        setShowSuccessMessage(true);
        resetForm();

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      },
      onError: (error) => {
        console.error("Payment error:", error);
        setGeneralError("Payment failed. Please check your details and try again.");
        // Show error toast notification
        errorMessage("Payment failed. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: false,
          toastId: `error_${billId}`,
        });

        // Set specific field errors based on error type
        if (error.message?.includes("card")) {
          setFieldError("cardNumber", "There was an issue with your card number");
        }
        if (error.message?.includes("expired")) {
          setFieldError("expiryDate", "Your card appears to be expired");
        }
        if (error.message?.includes("location")) {
          setFieldError("location", "Invalid location provided");
        }

        setSubmitting(false);
      },
    });
  };

  return (
    <>
      <section className={styles.page}>
        <div className={`container ${styles.container}`}>
          <div className={styles.page_con}>
            <div className={styles.intro}>
              <h2 className={styles.title}>Your Bill</h2>
              <p className={styles.username}>
                Username <span>{user?.username}</span>
              </p>
              <p className={styles.email}>
                Email <span>{user?.email}</span>
              </p>
            </div>

            <div className={styles.table_con}>
              <table className={styles.bill_table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {manyProducts
                    ? products.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={item.product.url}
                              alt={item.product.name}
                              className={styles.product_image}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                          </td>
                          <td>{item.product.name}</td>
                          <td>${item.product.price}</td>
                          <td>{item.quantity}</td>
                          <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))
                    : products.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={item.url}
                              alt={item.name}
                              className={styles.product_image}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>${item.price}</td>
                          <td>{quantity}</td>
                          <td>${(item.price * quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            <div className={styles.finally}>
              <h2 className={styles.total}>
                Total: <span>${totalPrice.toFixed(2)}</span>
              </h2>

              {showSuccessMessage && (
                <div className={styles.successMessage}>
                  <h3>✅ Payment Successful!</h3>
                  <p>Redirecting you to your orders...</p>
                </div>
              )}

              {generalError && (
                <div className={styles.generalError}>
                  <h4>❌ Payment Failed</h4>
                  <p>{generalError}</p>
                </div>
              )}

              {mutationError && (
                <div className={styles.generalError}>
                  <h4>❌ System Error</h4>
                  <p>Something went wrong. Please try again later.</p>
                </div>
              )}

              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                  <Form>
                    <h2 className={styles.title}>Payment Information</h2>

                    <div className={styles.helpText}>
                      <p>💳 All card information is secure and encrypted</p>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="nameOnCard">Name on Card *</label>
                      <Field
                        type="text"
                        name="nameOnCard"
                        id="nameOnCard"
                        className={`${styles.name} ${errors.nameOnCard && touched.nameOnCard ? styles.error : ""}`}
                        placeholder="Enter full name as shown on card"
                        maxLength="50"
                      />
                      <ErrorMessage name="nameOnCard" component="div" className={styles.errorMessage} />
                      <small className={styles.helpText}>Enter your name exactly as it appears on your card</small>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="cardNumber">Card Number *</label>
                      <Field name="cardNumber">
                        {({ field }) => (
                          <input
                            {...field}
                            type="text"
                            id="cardNumber"
                            className={`${styles.number} ${errors.cardNumber && touched.cardNumber ? styles.error : ""}`}
                            placeholder="1234567890123456"
                            maxLength="16"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value) && value.length <= 16) {
                                setFieldValue("cardNumber", value);
                              }
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="cardNumber" component="div" className={styles.errorMessage} />
                      <small className={styles.helpText}>Enter your 16-digit card number (numbers only)</small>
                      {values.cardNumber && values.cardNumber.length > 0 && values.cardNumber.length < 16 && (
                        <small className={styles.helpText}>📝 {16 - values.cardNumber.length} more digits needed</small>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="location">Delivery Location *</label>
                      <Field
                        type="text"
                        name="location"
                        id="location"
                        className={`${styles.location} ${errors.location && touched.location ? styles.error : ""}`}
                        placeholder="Enter your delivery address (e.g., 123 Main St, Cairo)"
                        maxLength="100"
                      />
                      <ErrorMessage name="location" component="div" className={styles.errorMessage} />
                      <small className={styles.helpText}>Enter your delivery address (city, street, etc.)</small>
                    </div>

                    <div className={styles.end}>
                      <div className={styles.formGroup}>
                        <label htmlFor="expiryDate">Expiry Date *</label>
                        <Field name="expiryDate">
                          {({ field }) => (
                            <input
                              {...field}
                              type="text"
                              id="expiryDate"
                              className={`${styles.date} ${errors.expiryDate && touched.expiryDate ? styles.error : ""}`}
                              placeholder="MM/YY"
                              maxLength="5"
                              value={formatExpiryDate(field.value)}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 5) {
                                  setFieldValue("expiryDate", formatExpiryDate(value));
                                }
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="expiryDate" component="div" className={styles.errorMessage} />
                        <small className={styles.helpText}>MM/YY format</small>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="cvv">CVV Code *</label>
                        <Field
                          type="text"
                          name="cvv"
                          id="cvv"
                          className={`${styles.code} ${errors.cvv && touched.cvv ? styles.error : ""}`}
                          placeholder="123"
                          maxLength="4"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 4) {
                              setFieldValue("cvv", value);
                            }
                          }}
                        />
                        <ErrorMessage name="cvv" component="div" className={styles.errorMessage} />
                        <small className={styles.helpText}>3-4 digits on back of card</small>
                      </div>
                    </div>

                    <div className={styles.formSummary}>
                      <p>
                        <strong>Order Summary:</strong>
                      </p>
                      <p>Items: {manyProducts ? products.length : 1}</p>
                      <p>
                        Total: <strong>${totalPrice.toFixed(2)}</strong>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className={`${styles.submit} ${isSubmitting || isLoading ? styles.loading : ""}`}
                      disabled={isSubmitting || isLoading || showSuccessMessage}
                    >
                      {isSubmitting || isLoading ? (
                        <>
                          <span className={styles.spinner}></span>
                          Processing Payment...
                        </>
                      ) : showSuccessMessage ? (
                        "✅ Payment Completed"
                      ) : (
                        `💳 Pay $${totalPrice.toFixed(2)} Now`
                      )}
                    </button>

                    <div className={styles.securityInfo}>
                      <p>🔒 Your payment information is secure and encrypted</p>
                      <p>📞 Need help? Contact customer support</p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Checkout;
