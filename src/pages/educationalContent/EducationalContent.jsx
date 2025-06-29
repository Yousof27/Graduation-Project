import { useState, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaEye, FaShieldAlt, FaExclamationTriangle, FaHeart, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import styles from "./educationalContent.module.css";
import { useAllPosts, useRemoveSavedPost, useSavePost, useUserSavedPosts } from "../../redux/posts/postsApis";
import { useSelector } from "react-redux";
import { successMessage } from "../../redux/toasts"; // Ensure this import is present
import EducationalCard from "../../components/educationalCard/EducationalCard";

// Validation schema for search and filters
const searchFilterSchema = Yup.object().shape({
  searchQuery: Yup.string().max(100, "Search query too long"),
  category: Yup.string(),
  type: Yup.string(),
  author: Yup.string(),
});

const EducationalContent = () => {
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { mutate: savePost } = useSavePost(user?.id);
  const { mutate: removePost } = useRemoveSavedPost(user?.id);
  const { data: userPosts } = useUserSavedPosts(user?.id);

  // Fetch data using the API function
  const { data: posts = [], isLoading, error } = useAllPosts();

  // Compute unique filter options
  const uniqueCategories = useMemo(() => [...new Set(posts.map((post) => post.category))], [posts]);
  const uniqueTypes = useMemo(() => [...new Set(posts.map((post) => post.type))], [posts]);
  const uniqueAuthors = useMemo(() => [...new Set(posts.map((post) => post.author))], [posts]);
  if(user?.role==="doctor")  return <Navigate to="/unauthorized" />;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <div className={styles.headerIconWrapper}>
                <FaEye className={styles.headerIcon} />
              </div>
              <h1 className={styles.headerTitle}>Loading...</h1>
              <p className={styles.headerSubtitle}>Fetching educational content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <div className={styles.headerIconWrapper}>
                <FaExclamationTriangle className={styles.headerIcon} />
              </div>
              <h1 className={styles.headerTitle}>Error Loading Content</h1>
              <p className={styles.headerSubtitle}>Unable to fetch educational content. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <main className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.headerIconWrapper}>
              <FaEye className={styles.headerIcon} />
            </div>
            <h1 className={styles.headerTitle}>Eye Health Education Center</h1>
            <p className={styles.headerSubtitle}>Comprehensive resources for maintaining healthy vision and preventing eye diseases</p>
            <div className={styles.headerFeatures}>
              <div className={styles.feature}>
                <FaShieldAlt className={styles.featureIcon} />
                <span>Evidence-Based</span>
              </div>
              <div className={styles.feature}>
                <FaEye className={styles.featureIcon} />
                <span>Expert Approved</span>
              </div>
              <div className={styles.feature}>
                <FaHeart className={styles.featureIcon} />
                <span>Wellness Focused</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Search and Filter Section */}
      <div className={styles.searchFilterSection}>
        <Formik initialValues={{ searchQuery: "", category: "", type: "", author: "" }} validationSchema={searchFilterSchema} onSubmit={() => {}}>
          {({ values, setFieldValue, resetForm }) => {
            const filteredPosts = posts.filter((post) => {
              const searchLower = values.searchQuery.toLowerCase();
              const matchesSearch =
                post.title.toLowerCase().includes(searchLower) ||
                post.description.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower) ||
                post.category.toLowerCase().includes(searchLower) ||
                post.author.toLowerCase().includes(searchLower);

              const matchesCategory = !values.category || post.category === values.category;
              const matchesType = !values.type || post.type === values.type;
              const matchesAuthor = !values.author || post.author === values.author;

              return matchesSearch && matchesCategory && matchesType && matchesAuthor;
            });

            const activeFiltersCount = [values.category, values.type, values.author].filter(Boolean).length;

            return (
              <Form className={styles.form}>
                <div className={styles.formAboveContent}>
                  {/* Search Input */}
                  <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <Field name="searchQuery" type="text" placeholder="Search articles, topics, authors..." className={styles.searchInput} />
                    {values.searchQuery && (
                      <button type="button" onClick={() => setFieldValue("searchQuery", "")} className={styles.clearSearchButton}>
                        <FaTimes />
                      </button>
                    )}
                  </div>

                  {/* Filter Toggle */}
                  <button type="button" onClick={() => setShowFilters(!showFilters)} className={styles.filterToggle}>
                    <FaFilter />
                    Filters
                    {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}
                  </button>

                  {/* Filter Dropdowns */}
                  {showFilters && (
                    <div className={styles.filterDropdowns}>
                      <Field as="select" name="category" className={styles.filterSelect}>
                        <option value="">All Categories</option>
                        {uniqueCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Field>
                      <Field as="select" name="type" className={styles.filterSelect}>
                        <option value="">All Types</option>
                        {uniqueTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </Field>
                      <Field as="select" name="author" className={styles.filterSelect}>
                        <option value="">All Authors</option>
                        {uniqueAuthors.map((auth) => (
                          <option key={auth} value={auth}>
                            {auth}
                          </option>
                        ))}
                      </Field>
                    </div>
                  )}

                  {/* Active Filters */}
                  <div className={styles.activeFilters}>
                    {values.searchQuery && (
                      <span className={styles.filterChip}>
                        Search: "{values.searchQuery}"
                        <button onClick={() => setFieldValue("searchQuery", "")}>
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    {values.category && (
                      <span className={styles.filterChip}>
                        Category: {values.category}
                        <button onClick={() => setFieldValue("category", "")}>
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    {values.type && (
                      <span className={styles.filterChip}>
                        Type: {values.type}
                        <button onClick={() => setFieldValue("type", "")}>
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    {values.author && (
                      <span className={styles.filterChip}>
                        Author: {values.author}
                        <button onClick={() => setFieldValue("author", "")}>
                          <FaTimes />
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Results Header */}
                  <div className={styles.resultsHeader}>
                    <span className={styles.resultsCount}>
                      {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                    </span>
                    {(values.searchQuery || values.category || values.type || values.author) && (
                      <button type="button" onClick={resetForm} className={styles.clearAllButton}>
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Cards */}
                {filteredPosts.length === 0 ? (
                  <div className={styles.noResults}>
                    <FaSearch className={styles.noResultsIcon} />
                    <h3>No articles found</h3>
                    <p>Try adjusting your search terms or filters to find what you're looking for.</p>
                    <button onClick={resetForm}>Clear all filters</button>
                  </div>
                ) : (
                  <div className={styles.cardGrid}>
                    {filteredPosts.map((card) => (
                      <EducationalCard
                        key={card.id}
                        card={card}
                        role={user?.role}
                        savePost={savePost}
                        removePost={removePost}
                        userPosts={userPosts}
                        successMessage={successMessage} // Passed as prop
                      />
                    ))}
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerIconWrapper}>
              <FaEye className={styles.footerIcon} />
            </div>
            <h3 className={styles.footerTitle}>Take Care of Your Vision</h3>
            <p className={styles.footerText}>
              Remember to schedule regular eye exams and consult with eye care professionals for personalized advice. Early detection and prevention
              are key to maintaining healthy vision throughout your life.
            </p>
            <div className={styles.disclaimer}>
              <p className={styles.disclaimerText}>
                <strong className={styles.disclaimerStrong}>Disclaimer:</strong> This content is for educational purposes only. Always consult with
                qualified healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;
