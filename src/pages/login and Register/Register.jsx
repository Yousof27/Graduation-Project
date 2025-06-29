import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import logo from "../../assets/logo.svg";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signUpApi } from "../../redux/auth/authApis";
import { clearError } from "../../redux/auth/authSlice";
import { LoaderBtn } from "../../components/common/loading spinners/Loaders";

function Register() {
  const navigate = useNavigate();
  const { error, loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Weak Password").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Re-enter the password"),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Invalid phone number")
      .required("Phone is required"),
    age: Yup.number().min(13, "Must be at least 13 years old").max(120, "Invalid age").required("Age is required"),
    gender: Yup.string().oneOf(["male", "female", "other"], "Invalid gender").required("Gender is required"),
  });

  const onSubmit = async (values) => {
    try {
      const user = {
        username: values.username,
        email: values.email,
        password: values.password,
        phoneNumber: values.phone,
        age: values.age,
        gender: values.gender,
      };

      await dispatch(signUpApi(user)).unwrap();
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const goLoginHandler = () => {
    dispatch(clearError());
    navigate("/login");
  };

  if (isAuthenticated) return <Navigate to="/market" />;

  return (
    <div className={styles.login}>
      <div className={`container ${styles.container}`}>
        <Link to="/">
          <img src={logo} alt="logo" loading="lazy" className={styles.logo} />
        </Link>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, setFieldValue }) => (
            <Form className={styles.form}>
              <h2>Create Account</h2>

              {error && <p className={styles.error}>{error}</p>}

              <div>
                <label htmlFor="username">Fullname</label>
                <Field type="text" name="username" id="username" placeholder="Enter Username" autoComplete="username" />
                <ErrorMessage name="username" component="p" />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" id="email" placeholder="Enter Email" autoComplete="email" />
                <ErrorMessage name="email" component="p" />
              </div>

              <div>
                <label htmlFor="phone">Phone Number</label>
                <Field type="tel" name="phone" id="phone" placeholder="Enter Phone Number" autoComplete="tel" />
                <ErrorMessage name="phone" component="p" />
              </div>

              <div className={styles["form-row"]}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="age">Age</label>
                  <Field style={{ marginLeft: 15 }} type="number" name="age" id="age" placeholder="Age" min="13" max="120" />

                  <ErrorMessage name="age" component="p" />
                </div>

                <div style={{ flex: 1 }}>
                  <label>Gender</label>
                  <div className={styles["radio-group"]}>
                    <div className={styles["radio-item"]}>
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={values.gender === "male"}
                        onChange={() => setFieldValue("gender", "male")}
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className={styles["radio-item"]}>
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={values.gender === "female"}
                        onChange={() => setFieldValue("gender", "female")}
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                    <div className={styles["radio-item"]}>
                      <input
                        type="radio"
                        id="other"
                        name="gender"
                        value="other"
                        checked={values.gender === "other"}
                        onChange={() => setFieldValue("gender", "other")}
                      />
                      <label htmlFor="other">Other</label>
                    </div>
                  </div>
                  <ErrorMessage name="gender" component="p" />
                </div>
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <Field type="password" name="password" id="password" placeholder="Enter Password" autoComplete="new-password" />
                <ErrorMessage name="password" component="p" />
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" autoComplete="new-password" />
                <ErrorMessage name="confirmPassword" component="p" />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? <LoaderBtn /> : "Create Account"}
              </button>

              <p>By continuing, you agree to Eye Care Conditions of Use and Privacy Notice.</p>

              <div className={styles.divider}>OR</div>

              <p>Already Have Account?</p>

              <button onClick={goLoginHandler} type="button">
                Login to Your Account
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
