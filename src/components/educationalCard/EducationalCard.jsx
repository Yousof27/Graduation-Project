import { useState, useEffect } from "react";
import { FaBook, FaPlay, FaExclamationTriangle, FaImage, FaHeart, FaEye, FaChevronRight, FaClock, FaUser, FaRegHeart, FaLink } from "react-icons/fa";
import styles from "./educationalCard.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EducationalCard = ({ card, role, savePost, removePost, userPosts, successMessage, children }) => {
  const [activeCard, setActiveCard] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const postsIds = userPosts?.map((p) => p.id) || [];
    setFavorites(postsIds);
  }, [userPosts]);

  const handleCardClick = () => {
    setActiveCard(!activeCard);
  };

  const handleFavoriteClick = () => {
    setFavorites((prevFavorites) => (prevFavorites.includes(card.id) ? prevFavorites.filter((id) => id !== card.id) : [...prevFavorites, card.id]));
    if (typeof removePost === "function" && favorites.includes(card.id)) {
      removePost(card.id);
    }
    if (typeof savePost === "function" && !favorites.includes(card.id)) {
      savePost(card.id);
    }
  };

  const isFavorite = () => favorites.includes(card.id);

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <FaPlay className={styles.starIcon} />;
      case "image-article":
        return <FaImage className={styles.starIcon} />;
      default:
        return <FaBook className={styles.starIcon} />;
    }
  };

  const getCardIcon = (iconName) => {
    const iconMap = {
      FaBook: <FaBook className={styles.cardIcon} />,
      FaPlay: <FaPlay className={styles.cardIcon} />,
      FaExclamationTriangle: <FaExclamationTriangle className={styles.cardIcon} />,
      FaImage: <FaImage className={styles.cardIcon} />,
      FaHeart: <FaHeart className={styles.cardIcon} />,
      FaEye: <FaEye className={styles.cardIcon} />,
    };
    return iconMap[iconName] || <FaBook className={styles.cardIcon} />;
  };

  const goLogin = () => {
    toast.info("Please Login First");
    navigate("/login");
  };

  const getCardHeaderColor = (post) => {
    const colorMap = {
      "General Care": "cardHeader_blue",
      "Disease Prevention": "cardHeader_red",
      "Diabetes & Eyes": "cardHeader_purple",
      "Age-Related Conditions": "cardHeader_green",
      "Modern Eye Care": "cardHeader_indigo",
      "Lifestyle & Nutrition": "cardHeader_orange",
    };
    return colorMap[post.category] || "cardHeader_blue";
  };

  return (
    <div className={`${styles.card} ${activeCard ? styles.cardActive : ""}`} onClick={handleCardClick}>
      <div className={styles.cardInner}>
        {/* Card Header */}
        <div className={`${styles.cardHeader} ${styles[getCardHeaderColor(card)]}`}>
          <div className={styles.cardHeaderOverlay}></div>
          <div className={styles.cardHeaderOverlayCircle}></div>
          <div className={styles.cardHeaderContent}>
            <div className={styles.cardHeaderTop}>
              <div className={styles.cardIconWrapper}>{getCardIcon(card.icon)}</div>
              <div className={styles.cardHeaderActions}>
                <button
                  type="button"
                  className={styles.favoriteButton}
                  title="Copy post link"
                  onClick={(e) => {
                    e.stopPropagation();
                    const postUrl = `${window.location.origin}/educational-content/${card.id}`;
                    navigator.clipboard.writeText(postUrl);
                    if (typeof successMessage === "function") {
                      successMessage("Copied to clipboard");
                    }
                  }}
                >
                  <FaLink className={styles.favoriteIcon} />
                </button>
                {!["admin", "doctor"].includes(role) && (
                  <button
                    type="button"
                    className={styles.favoriteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      role === "client" ? handleFavoriteClick() : goLogin();
                    }}
                    title={isFavorite() ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite() ? <FaHeart className={styles.favoriteIconFilled} /> : <FaRegHeart className={styles.favoriteIcon} />}
                  </button>
                )}
                <div className={styles.cardType}>
                  {getTypeIcon(card.type)}
                  <span className={styles.cardTypeText}>{card.type}</span>
                </div>
              </div>
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDescription}>{card.description}</p>
          </div>
        </div>

        {/* Card Content */}
        <div className={styles.cardContent}>
          <div className={styles.cardMeta}>
            <span className={styles.cardCategory}>{card.category}</span>
            <div className={styles.cardDetails}>
              <div className={styles.cardDetail}>
                <FaClock className={styles.starIcon} />
                <span>{card.readTime}</span>
              </div>
              <div className={styles.cardDetail}>
                <FaUser className={styles.starIcon} />
                <span>{card.author}</span>
              </div>
            </div>
          </div>

          {/* Expandable Content */}
          <div className={`${styles.expandableContent} ${activeCard ? styles.expandableContentOpen : ""}`}>
            <div className={styles.expandableContentInner}>
              {card.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h4 key={index} className={styles.contentHeading}>
                      {paragraph.replace(/\*\*/g, "")}
                    </h4>
                  );
                } else if (paragraph.startsWith("â€¢ ")) {
                  return (
                    <li key={index} className={styles.contentListItem}>
                      {paragraph.substring(2)}
                    </li>
                  );
                } else if (paragraph.match(/^\d+\./)) {
                  return (
                    <div key={index} className={styles.contentNumberedItem}>
                      <strong className={styles.contentNumberedLabel}>{paragraph.split(":")[0]}:</strong>
                      {paragraph.split(":").slice(1).join(":")}
                    </div>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className={styles.contentParagraph}>
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Card Footer */}
          <div className={styles.cardFooter}>
            <button className={styles.readMoreButton}>
              <span>{activeCard ? "Show Less" : "Read More"}</span>
              <FaChevronRight className={`${styles.readMoreIcon} ${activeCard ? styles.readMoreIconRotated : ""}`} />
            </button>
            {!["admin", "doctor"].includes(role) && (
              <div className={styles.favoriteStatus}>
                {isFavorite() && (
                  <span className={styles.favoriteStatusText}>
                    <FaHeart className={styles.favoriteStatusIcon} />
                    Saved
                  </span>
                )}
              </div>
            )}
            {role === "admin" && children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalCard;
