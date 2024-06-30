export function sortArray(arr, compareFunction) {
  return arr.slice().sort(compareFunction);
}

export const getDate = () => {
  const date = new Date();
  const currentDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return currentDate;
};

export const calculateDate = (date) => {
  let str =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return str;
};
export const calculateTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const str =
    (hours > 9 ? hours : "0" + hours) +
    ":" +
    (minutes > 9 ? minutes : "0" + minutes) +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds);
  return str;
};
// Sample category array with price information
const categories = [
  {
    name: "footwear",
    prices: {
      wholeSale: 2,
      superWholeSale: 36,
    },
  },
];

export const getPriceTag = (product) => {
  const productCategory = product.category;

  const categoryInfo = categories.find((cat) => cat.name === productCategory);

  if (categoryInfo) {
    const { wholeSale, superWholeSale } = categoryInfo.prices;
    if (product.piece >= superWholeSale) {
      return "superwholesale";
    } else if (product.piece < superWholeSale && product.piece >= wholeSale) {
      return "wholesale";
    }
    return { wholeSale, superWholeSale };
  } else {
    console.error(`Category "${productCategory}" not found.`);
    return null; // or handle it in a way appropriate for your application
  }
};

export const calculateMeasuring = (total) => {
  if (total < 1) {
    return total * 1000 + "g";
  } else {
    return total + "kg";
  }
};

export const fetchPin = async (pin, setShow, user, setPinShow) => {
  try {
    console.log(pin);
    console.log(user);
    let newPin = pin[0] + pin[1] + pin[2] + pin[3];
    if (user.pin === newPin) {
      setShow(true);
      setPinShow(false);
    } else {
      setShow(false);
      alert("Wrong Pin");
    }
  } catch (error) {
    console.error("Error fetching PIN:", error);
  }
};

export default getDate;
