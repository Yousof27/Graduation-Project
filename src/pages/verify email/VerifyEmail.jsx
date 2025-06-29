import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    axios
      .get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className={styles.container}>
      {status === "loading" && <p className={styles.message}>Verifying your email...</p>}
      {status === "success" && (
        <div className={styles.success}>
          ✅ Email verified! You can now <a href="/login">login</a>.
        </div>
      )}
      {status === "error" && <div className={styles.error}>❌ Invalid or expired token. Please request a new verification email.</div>}
    </div>
  );
};

export default VerifyEmail;
