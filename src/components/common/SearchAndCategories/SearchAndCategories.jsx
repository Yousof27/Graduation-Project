import { TbSearch } from "react-icons/tb";
import styles from "./SearchAndCategories.module.css";

function SearchAndCategories({ categories, searchData, setSearchData }) {
  const handleSearchChange = (e) => {
    setSearchData((p) => ({ ...p, searchTerm: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setSearchData((p) => ({ ...p, selectedCategory: e.target.value }));
  };

  return (
    <>
      <div className={styles.search}>
        <div>
          <TbSearch className={styles.icon} />
        </div>
        <input id="search" type="text" name="search" placeholder="Search..." value={searchData.searchTerm} onChange={handleSearchChange} />
      </div>

      <div className={styles.categories}>
        {categories?.map((category, index) => (
          <label key={index} htmlFor={category.value} className={`${styles.category} ${searchData.selectedCategory === category.value ? styles.selected : ""}`}>
            <input
              id={category.value}
              type="radio"
              name="category"
              value={category.value}
              checked={searchData.selectedCategory === category.value}
              onChange={handleCategoryChange}
            />

            {category.label}
          </label>
        ))}
      </div>
    </>
  );
}

export default SearchAndCategories;
