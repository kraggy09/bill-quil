import { useSelector } from "react-redux";

const usePriceTag = (billType) => {
  const { categories } = useSelector((store) => store.categories);

  const getPriceTag = (product, val) => {
    const productCategory = product.category;
    const categoryInfo = categories.find((cat) => cat.name === productCategory);
    console.log("bill type", billType, val);

    if (billType === "superWholesale") {
      return { type: "superWholesale", price: product.superWholesalePrice };
    } else if (billType === "wholesale" && val < categoryInfo.superWholeSale) {
      return { type: "wholesale", price: product.wholesalePrice };
    }
    if (categoryInfo) {
      const { wholesale, superWholeSale } = categoryInfo;
      if (val) {
        if (val >= superWholeSale) {
          return { type: "superWholesale", price: product.superWholesalePrice };
        } else if (val < superWholeSale && val >= wholesale) {
          return { type: "wholesale", price: product.wholesalePrice };
        } else {
          return { type: "retail", price: product.retailPrice };
        }
      } else {
        if (product.piece >= superWholeSale) {
          ``;
          return { type: "superWholesale", price: product.superWholesalePrice };
        } else if (
          product.piece < superWholeSale &&
          product.piece >= wholesale
        ) {
          return { type: "wholesale", price: product.wholesalePrice };
        } else {
          return { type: "retail", price: product.retailPrice };
        }
      }
    } else {
      return { type: "retail", price: product.retailPrice };
    }
  };

  return { getPriceTag };
};

export default usePriceTag;
