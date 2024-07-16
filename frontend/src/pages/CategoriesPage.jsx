import { useState } from "react";
import CategoryPortal from "../components/CategoryPortal";
import { useSelector } from "react-redux";

const CategoriesPage = () => {
  const [portalVisible, setPortalVisible] = useState(false);

  const { categories } = useSelector((store) => store.categories);
  console.log(categories);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Update selected category state
    setPortalVisible(true); // Show the portal
  };

  return (
    <main className="pl-24 relative min-w-full flex flex-col gap-y-6">
      <CategoryPortal
        visible={portalVisible}
        setVisible={setPortalVisible}
        initialName={selectedCategory ? selectedCategory.name : ""}
        initialWholesale={selectedCategory ? selectedCategory.wholeSale : ""}
        initialSuperWholesale={
          selectedCategory ? selectedCategory.superWholeSale : ""
        }
      />
      <h1 className="text-xl font-bold">List of Categories</h1>
      <div className="grid grid-cols-4 max-w-[80%] gap-8 items-center justify-around">
        {categories.map((cat, i) => (
          <div
            key={cat.name}
            className="bg-white flex flex-col gap-y-6 items-center overflow-hidden shadow-lg shadow-gray-400 rounded-lg cursor-pointer"
            onClick={() => handleCategoryClick(cat)}
          >
            <h2 className="capitalize text-center bg-green-500 min-w-full text-white font-semibold py-2">
              {cat.name}
            </h2>
            <p>Whole Sale: {cat.wholesale}</p>
            <p className="mb-3">Super Whole Sale: {cat.superWholeSale}</p>
          </div>
        ))}
      </div>
      <button
        className="absolute bottom-16 right-16 text-lg bg-green-300 px-3 py-1 rounded-lg"
        onClick={() => setPortalVisible(true)}
      >
        + New Category
      </button>
    </main>
  );
};

export default CategoriesPage;
