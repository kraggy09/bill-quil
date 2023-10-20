import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

const DashBoardPage = () => {
  return (
    <div className=" min-w-fit min-h-full">
      DashBoardPage
      <Link to={"/newbill"}>
        <button className="rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 p-5 bg-green-500">
          <AiOutlinePlus className="text-2xl text-white font-extrabold" />
        </button>
      </Link>
    </div>
  );
};

export default DashBoardPage;
