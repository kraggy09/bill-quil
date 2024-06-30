import { Link } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import InventoryRequest from "../components/InventoryRequest";

const DashBoardPage = () => {
  return (
    <div className="pl-24  flex min-w-[100vw]">
      <ToastContainer autoClose={2000} />
      <main className="min-w-[60%]">
        <article className="min-h-[60vh]"></article>
        <InventoryRequest />
      </main>

      <Link to={"/newbill"}>
        <button className="rounded-lg text-3xl  text-white absolute bottom-10 right-8 font-bold hover:bg-green-700 px-4 py-3 bg-green-500">
          +
        </button>
      </Link>
    </div>
  );
};

export default DashBoardPage;
