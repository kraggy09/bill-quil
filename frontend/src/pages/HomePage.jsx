import CustomerPage from "../pages/CustomerPage";
import { AiOutlinePlus } from "react-icons/ai";
const HomePage = () => {
  return (
    <>
      <CustomerPage />
      <button className="rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 p-5 bg-green-500">
        <AiOutlinePlus className="text-2xl text-white font-extrabold" />
      </button>
    </>
  );
};

export default HomePage;
