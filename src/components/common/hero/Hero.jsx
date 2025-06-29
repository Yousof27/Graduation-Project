import styles from "./hero.module.css";

function Hero({ bg, children }) {
  return (
    <main className={styles.hero} style={{ backgroundImage: `url(${bg})` }}>
      <div className={`container ${styles.container}`}>{children}</div>
    </main>
  );
}

export default Hero;
