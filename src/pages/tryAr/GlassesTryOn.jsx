import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import styles from "./GlassesTryOn.module.css";
import GlassArView from "./GlassArView";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { useSelector } from "react-redux";
import { useAllGlasses } from "../../redux/products/productsApis";

const GlassesTryOn = () => {
  const glassesQuery = useAllGlasses();
  const user = useSelector((state) => state.auth?.user);

  const [glasses, setGlasses] = useState([]);
  const [selectedModelName, setSelectedModelName] = useState(null);

  const preSelectedId = useParams("id");

  useEffect(() => {
    setGlasses(glassesQuery?.data);

    // Auto-select by id from URL
    if (preSelectedId.id) {
      const selected = glassesQuery.data?.find((g) => g.id === preSelectedId.id);
      if (selected) {
        setSelectedModelName(selected.name);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [glassesQuery.data, preSelectedId]);

  const handleGlassesSelect = (glass) => {
    setSelectedModelName(glass.name);
  };

  const [edge, setEdge] = useState(window.innerWidth < 768 ? window.innerWidth - 30 : 500);

  useEffect(() => {
    const handleResize = () => {
      setEdge(window.innerWidth < 768 ? window.innerWidth - 30 : 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const props = {
    modelname: selectedModelName,
    canvaswidth: edge,
    canvasheight: edge,
  };

  if (user?.role === "admin") return <Navigate to="/unauthorized" />;

  return (
    <div className={styles["glasses-try-on-container"]}>
      <div className={styles.container}>
        <div className={styles.AR_model}>
          <div className={styles["glasses-try-on-header"]}>
            <h3>Hi {user?.username}</h3>
          </div>
          <div className={styles.model}>
            <ErrorBoundary>
              {selectedModelName ? <GlassArView {...props} /> : <div className={styles["loading-state"]}>Please select glasses to try on</div>}
            </ErrorBoundary>
          </div>
        </div>
        <div className={styles["glasses-selection"]}>
          {glassesQuery?.isLoading ? (
            <div className={styles["loading-state"]}>Loading glasses...</div>
          ) : glassesQuery?.error ? (
            <div className={styles["error-state"]}>Error: {glassesQuery.error.message}</div>
          ) : (
            <div className={styles["glasses-grid"]}>
              {glasses?.map((glass) => (
                <div
                  key={glass.id}
                  className={`${styles["glasses-item"]} ${selectedModelName === glass.name ? styles.selected : ""}`}
                  onClick={() => handleGlassesSelect(glass)}
                >
                  <div className={styles["glasses-image"]}>
                    <img src={glass.url} alt={glass.name} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlassesTryOn;
