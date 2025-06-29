import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import logo from "../../assets/logo.svg";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { loginApi } from "../../redux/auth/authApis";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../redux/auth/authSlice";
import { LoaderBtn } from "../../components/common/loading spinners/Loaders";

function Login() {
  const navigate = useNavigate();
  const { error, loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  
  const onSubmit = async (values) => {
    try {
      const user = { email: values.email, password: values.password };
      const response = await dispatch(loginApi(user)).unwrap();

      switch (response.user.role) {
        case "client": navigate("/profile"); break;
        case "doctor": navigate("/doctorProfile"); break;
        case "admin": navigate("/adminProfile"); break;
        default: navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goRegisterHandler = () => {
    dispatch(clearError());
    navigate("/sign_up");
  };

  if (isAuthenticated) return <Navigate to="/market" />;

  return (
    <div className={styles.login}>
      <div className={`container ${styles.container}`}>
        <Link to="/">
          <img src={logo} alt="logo" loading="lazy" className={styles.logo} />
        </Link>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          <Form className={styles.form}>
            <h2>Welcome Back</h2>

            {error && <p className={styles.error}>{error}</p>}

            <div>
              <label htmlFor="email">Email</label>
              <Field 
                type="email" 
                name="email" 
                id="email" 
                placeholder="Enter Your Email" 
                autoComplete="email" 
              />
              <ErrorMessage name="email" component="p" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field 
                type="password" 
                name="password" 
                id="password" 
                placeholder="Enter Your Password" 
                autoComplete="current-password" 
              />
              <ErrorMessage name="password" component="p" />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ 
                fontSize: '14px', 
                color: '#005dd6',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? <LoaderBtn /> : "Login"}
            </button>

            <p>By continuing, you agree to Eye Care Conditions of Use and Privacy Notice.</p>
            
            <div className={styles.divider}>OR</div>
            
            <p>Don't Have Account Yet?</p>

            <button onClick={goRegisterHandler} type="button">
              Create New Account
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;