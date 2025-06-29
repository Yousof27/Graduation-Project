import bg from "../../assets/market hero bg.png";
import img from "../../assets/doctors hero img.svg";
import Hero from "../../components/common/hero/Hero";
import heroStyles from "../../components/common/hero/hero.module.css";
import CardsContainer from "../../components/common/cards container/CardsContainer";
import { useDoctors } from "../../redux/doctors/doctorsApis";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Doctors() {
  // Fetching doctors and categories data by react query
  const doctorsQuery = useDoctors();
  const role = useSelector((state) => state.auth?.user?.role);

  // Doctors hero section content
  const heroContent = (
    <>
      <div className={heroStyles.left}>
        <h1>Introduce You To Our Experts</h1>
        <p>Trusted Experts in Eye Health & Vision Care, Providing Advanced Treatments for a Clearer Future.</p>
      </div>
      <div className={heroStyles.right}>
        <img src={img} alt="hero" loading="lazy" />
      </div>
    </>
  );
  const info = {
    isPending: doctorsQuery.isPending,
    error: doctorsQuery.error,
    categories: [
      { label: "All", value: "all" },
      ...[...new Set(doctorsQuery.data?.map((doc) => doc.specialty))].map((specialty) => ({
        label: specialty,
        value: specialty,
      })),
    ],
    defaultCategory: "all", // You can change this if you want a specific default
    cards: doctorsQuery.data,
    type: "doctors",
  };

  if (["doctor", "admin"].includes(role)) return <Navigate to="/unauthorized" />;

  return (
    <>
      <Hero bg={bg}>{heroContent}</Hero>
      <CardsContainer info={info} />
    </>
  );
}

export default Doctors;
