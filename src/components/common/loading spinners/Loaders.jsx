import styles from "./loaders.module.css";

export function LoaderPage() {
  return (
    <h1 className={styles.isLoading}>
      <span className={`${styles.spinner} ${styles.pageLoader}`}></span>
    </h1>
  );
}

export function LoaderBtn({ color }) {
  return <span className={styles.btnLoader} style={{ borderColor: color || "#fff", borderTopColor: "transparent" }}></span>;
}
