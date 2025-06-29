import bg from "../../assets/market hero bg.png";
import img from "../../assets/market hero img.svg";
import Hero from "../../components/common/hero/Hero";
import heroStyles from "../../components/common/hero/hero.module.css";
import CardsContainer from "../../components/common/cards container/CardsContainer";
import { useProducts } from "../../redux/products/productsApis";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function Market() {
  const productsQuery = useProducts();
  const role = useSelector((state) => state.auth?.user?.role);

  // Market hero section content
  const heroContent = (
    <>
      <div className={heroStyles.left}>
        <h1>Your Trusted Pharmacy for Complete Eye Care</h1>
        <p>High-Quality Medications & Expert Guidance to Support Your Vision Health.</p>
      </div>
      <div className={heroStyles.right}>
        <img src={img} alt="hero" loading="lazy" />
      </div>
    </>
  );

  // Info object to be passed to CardsContainer
  const info = {
    isPending: productsQuery.isPending,
    error: productsQuery.error,
    categories: [
      { label: "All", value: "all" },
      { label: "Glasses", value: "glasses" },
      { label: "Implant", value: "implant" },
      { label: "Injection", value: "injection" },
      { label: "Pill", value: "pill" },
      { label: "Drops", value: "drops" },
    ],
    defaultCategory: "all",
    cards: productsQuery.data ? shuffleArray(productsQuery.data) : [],
    type: "market",
  };

  if (role === "admin") return <Navigate to="/unauthorized" />;

  return (
    <>
      <Hero bg={bg}>{heroContent}</Hero>
      <CardsContainer info={info} />
    </>
  );
}

export default Market;
