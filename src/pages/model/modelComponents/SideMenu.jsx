import styles from "./styles/SideMenu.module.css";
import DoctorCard from "../../../components/doctor/doctor card/DoctorCard";
import EducationalCard from "../../../components/EducationalCard/EducationalCard";
import ProductCard from "../../../components/products/product card/ProductCard"; // Import ProductCard
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function SideMenu({ isOpen, onClose, title, items, userRole, savePost, removePost, userPosts, successMessage }) {
  const navigate = useNavigate();

  const showMoreLink = {
    "Suggested Medications": "/market",
    "Educational Content": "/educationalContent",
    "Contact Doctor": "/doctors",
  };

  return (
    <div id="sideMenu" className={`${styles.sideMenuContainer} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.sideMenuHeader}>
        <h2 className={styles.sideMenuTitle}>{title}</h2>
        <button className={styles.sideMenuClose} onClick={onClose}>
          ×
        </button>
      </div>

      <div id="sideMenuContent" className={styles.sideMenuScroll}>
        {items.map((item) => {
          if (title === "Contact Doctor") {
            // Map item data to match DoctorCard's expected props
            const doctorData = {
              id: item.id,
              profileImage: item.image,
              fullname: item.name,
              specialty: item.specialty,
              clinicLocation: item.location,
              ratings: item.rating,
              availableDays: item.availability.split(", "), // Assuming availability is a comma-separated string
              bio: item.bio,
              socialLinks: {
                facebook: item.social?.facebook,
                twitter: item.social?.twitter,
                linkedin: item.social?.linkedin,
              },
            };
            return <DoctorCard key={item.id} data={doctorData} />;
          } else if (title === "Suggested Medications") {
            // Map item data to match ProductCard's expected props
            return (
              <ProductCard
                key={item.id}
                data={{
                  id: item.id,
                  name: item.name,
                  desc: item.desc,
                  sales: item.sales,
                  type: item.type,
                  price: item.price,
                  url: item.url,
                }}
                onProductSelect={() => navigate(`/market/${item.id}`)} // Navigate to ProductInfo
              />
            );
          } else if (title === "Educational Content") {
            // Map item data to match EducationalCard's expected props
            return (
              <EducationalCard
                key={item.id}
                card={{
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  category: item.category,
                  type: item.type,
                  icon: item.icon,
                  readTime: item.readTime,
                  author: item.author,
                  content: item.content,
                }}
                role={userRole} // Assuming userId is passed if available
                savePost={savePost}
                removePost={removePost}
                userPosts={userPosts}
                successMessage={successMessage}
                isActive={false} // Default to collapsed state in SideMenu
                onCardClick={() => navigate(`/educational-content/${item.id}`)} // Navigate to detailed view
              />
            );
          } else {
            return (
              <div key={item.id} className={styles.sideMenuCard}>
                <img src={item.image} alt={item.title} loading="lazy" className={styles.sideMenuImage} />
                <h3 className={styles.sideMenuHeading}>{item.title}</h3>
                <p className={styles.sideMenuText}>{item.description}</p>
              </div>
            );
          }
        })}
      </div>

      <button id="viewMoreBtn" onClick={() => window.open(showMoreLink[title], "_blank", "noopener,noreferrer")} className={styles.sideMenuViewmore}>
        View More
      </button>
    </div>
  );
}
