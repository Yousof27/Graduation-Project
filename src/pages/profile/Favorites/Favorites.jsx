import styles from "./Favorites.module.css";
import { useSelector } from "react-redux";
import { useUserSavedPosts, useSavePost, useRemoveSavedPost } from "../../../redux/posts/postsApis";
import { successMessage } from "../../../redux/toasts";
import EducationalCard from "../../../components/educationalCard/EducationalCard";

const Favorites = () => {
  const user = useSelector((state) => state?.auth?.user);
  const { data: favoriteContent = [], isLoading, isError } = useUserSavedPosts(user?.id);
  const { mutate: savePost } = useSavePost(user?.id);
  const { mutate: removePost } = useRemoveSavedPost(user?.id);

  // userPosts is needed for the EducationalCard to know which posts are saved
  // In this context, it's the same as favoriteContent
  const userPosts = favoriteContent;

  return (
    <div className={styles.favoritesContainer}>
      <div className={styles.sectionCard}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Favorite Educational Content</h3>
            <p className={styles.subtitle}>Articles and videos saved for later</p>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {isLoading && <p>Loading favorites...</p>}
          {isError && <p>Failed to load favorites.</p>}
          {!isLoading && favoriteContent.length === 0 && <p>No favorites found.</p>}
          {favoriteContent.map((item) => (
            <div key={item.id} className={styles.contentItem}>
              <EducationalCard
                card={item}
                role={user?.role}
                savePost={savePost}
                removePost={removePost}
                userPosts={userPosts}
                successMessage={successMessage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
