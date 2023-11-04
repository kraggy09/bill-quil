import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import Barcode from "react-barcode";
const DashBoardPage = () => {
  return (
    <div className="  max-w-[85vw] min-h-full">
      <div className="max-w-full flex flex-wrap">
        {Array(3)
          .fill("")
          .map((index) => {
            return (
              <span className="mx-3" key={index}>
                <Barcode value={108} height={30} fontSize={12} />
              </span>
            );
          })}
      </div>

      <Link to={"/newbill"}>
        <button className="rounded-full absolute bottom-10 right-8 font-bold hover:bg-green-700 p-5 bg-green-500">
          <AiOutlinePlus className="text-2xl text-white font-extrabold" />
        </button>
      </Link>
    </div>
  );
};

export default DashBoardPage;
