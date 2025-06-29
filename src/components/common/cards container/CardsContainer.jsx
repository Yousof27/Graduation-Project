import styles from "./cardsContainer.module.css";
import SearchAndCategories from "../SearchAndCategories/SearchAndCategories";
import DoctorCard from "../../doctor/doctor card/DoctorCard";
import ProductCard from "../../products/product card/ProductCard";
import { useEffect, useState } from "react";
import { LoaderPage } from "../loading spinners/Loaders";

function CardsContainer({ info }) {
  const { isPending, error, categories, defaultCategory, cards, type, onProductSelect } = info;
  const [searchData, setSearchData] = useState({ searchTerm: "", selectedCategory: defaultCategory });
  const [filteredCards, setFilteredCards] = useState(cards || []);

  // Filter cards based on search term and selected category
  useEffect(() => {
    let filtered = cards || [];

    // Apply search term filter
    if (searchData.searchTerm) {
      const searchTermLower = searchData.searchTerm.toLowerCase();
      if (type === "market") {
        filtered = filtered.filter(
          (card) =>
            card.name?.toLowerCase().includes(searchTermLower) ||
            card.brand?.toLowerCase().includes(searchTermLower) ||
            card.diseaseType?.toLowerCase().includes(searchTermLower) ||
            card.category?.toLowerCase().includes(searchTermLower) ||
            card.type?.toLowerCase().includes(searchTermLower)
        );
      } else if (type === "doctors") {
        filtered = filtered.filter(
          (card) =>
            card.fullname?.toLowerCase().includes(searchTermLower) ||
            card.specialty?.toLowerCase().includes(searchTermLower)
        );
      }
    }

    // Apply category filter
    if (searchData.selectedCategory && searchData.selectedCategory !== "all") {
      if (type === "market") {
        filtered = filtered.filter((card) => card.type?.toLowerCase() === searchData.selectedCategory.toLowerCase());
      } else if (type === "doctors") {
        filtered = filtered.filter((card) => card.specialty?.toLowerCase() === searchData.selectedCategory.toLowerCase());
      }
    }

    setFilteredCards(filtered);
  }, [searchData, cards, type, defaultCategory]);

  // Reset search data when defaultCategory changes
  useEffect(() => {
    setSearchData({ searchTerm: "", selectedCategory: defaultCategory });
  }, [defaultCategory]);

  return (
    <section className={styles.market_con}>
      <div className={`container ${styles.container}`}>
        {cards?.length !== 0 && <SearchAndCategories categories={categories} searchData={searchData} setSearchData={setSearchData} />}
        <div className={styles.cards}>
          <div className={`${styles.container}`}>
            {isPending ? (
              <LoaderPage />
            ) : error ? (
              <h1 className="error">An error has occurred: {error.message}</h1>
            ) : filteredCards.length === 0 ? (
              <h1 className="isEmpty">No results found</h1>
            ) : type === "market" ? (
              filteredCards.map((p) => p.maxQuantity > 0 && <ProductCard data={p} key={p.id} onProductSelect={onProductSelect} />)
            ) : (
              filteredCards.map((p) => <DoctorCard data={p} key={p.id} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardsContainer;