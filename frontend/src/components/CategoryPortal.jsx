import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../constant";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchCategories } from "../store/categorySlice";

const CategoryPortal = ({
  visible,
  setVisible,
  initialName,
  initialWholesale,
  initialSuperWholesale,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(initialName || "");
  const [wholesale, setWholesale] = useState(initialWholesale || "");
  const [superWholeSale, setSuperWholesale] = useState(
    initialSuperWholesale || ""
  );
  console.log(wholesale, superWholeSale);

  useEffect(() => {
    setName(initialName || "");
    setWholesale(initialWholesale || "");
    setSuperWholesale(initialSuperWholesale || "");
  }, [initialName, initialWholesale, initialSuperWholesale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.post(apiUrl + "/newCategory", {
      name,
      wholesale: Number(wholesale),
      superWholeSale: Number(superWholeSale),
    });
    if (res.data.success) {
      toast.success(res.data.msg);
    } else {
      toast.error(res.data.msg);
    }
    dispatch(fetchCategories());

    console.log(res.data);
    setName("");
    setWholesale("");
    setSuperWholesale("");
    setVisible(false);
  };

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col items-start gap-y-6 overflow-hidden rounded-lg min-w-[40vw]"
      >
        <h1 className="min-w-full text-center bg-green-500 text-xl font-semibold text-white py-2">
          Enter the category details
        </h1>
        <div className="text-lg font-semibold pl-6 mt-6">
          <label htmlFor="name">Enter the category name</label>
          <input
            className="border-b-2 outline-none ml-6 focus:border-green-500 pl-3"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="text-lg font-semibold pl-6 mt-6">
          <label htmlFor="wp">Enter the category wholesale</label>
          <input
            className="border-b-2 outline-none ml-6 focus:border-green-500 pl-3"
            type="text"
            id="wp"
            value={wholesale}
            onChange={(e) => setWholesale(e.target.value)}
          />
        </div>
        <div className="text-lg font-semibold pl-6 mt-6">
          <label htmlFor="swp">Enter the category super wholesale</label>
          <input
            className="border-b-2 outline-none ml-6 focus:border-green-500 pl-3"
            type="text"
            id="swp"
            value={superWholeSale}
            onChange={(e) => setSuperWholesale(e.target.value)}
          />
        </div>
        <div className="grid my-5 grid-cols-2 min-w-full gap-x-16">
          <button
            type="button"
            className="rounded-md ml-6 bg-red-200 py-1 font-semibold text-red-800"
            onClick={() => {
              setName("");
              setWholesale("");
              setSuperWholesale("");
              setVisible(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md ml-6 bg-green-200 py-1 font-semibold mr-6 text-green-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>,
    document.getElementById("portal")
  );
};

export default CategoryPortal;
