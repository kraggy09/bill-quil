import { BiSolidReport } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { BiSolidUser } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa";
import { ImClock } from "react-icons/im";
import { Link } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [time, setTime] = useState("");
  const [hidden, setHidden] = useState(true);
  const updateTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    setTime(
      `${hour > 12 ? "0" + (hour % 12) : hour < 12 ? "0" + hour : hour}:${
        min < 10 ? "0" + min : min
      }:${sec < 10 ? "0" + sec : sec} ${hour > 12 ? "PM" : "AM"}`
    );
  };

  // console.log(time);
  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div
      className={`${hidden ? "max-w-[80px]" : "max-w-[250px]"}   
min-h-[100vh] shadow-xl shadow-gray-400
  
  `}
    >
      {!hidden ? (
        <>
          {" "}
          <p className="text-xl font-bold px-8 py-3 bg-green-500 text-white p-2">
            Date:20-10-2023
          </p>
          <h1 className="text-xl text-center font-bold p-5">
            Sultan Communcation & General Stores
          </h1>
          <div id="navigation" className=" w-full grid-cols-1 grid">
            <span
              onClick={() => {
                setHidden(!hidden);
              }}
              className="flex hover:bg-green-500 hover:text-white items-center text-xl px-10 py-2 hover:cursor-pointer rounded-lg font-bold my-2 "
            >
              <MdSpaceDashboard className="hover:text-white" />

              <p className="px-2">DashBoard</p>
            </span>

            <span className="flex hover:bg-green-500 hover:text-white items-center text-xl px-10 py-2 hover:cursor-pointer rounded-lg font-bold my-2 ">
              <BiSolidReport className="hover:text-white" />

              <p className="px-2">Daily Report</p>
            </span>

            <span className="flex hover:bg-green-500 hover:text-white items-center text-xl px-10 py-2 hover:cursor-pointer rounded-lg font-bold my-2 ">
              <GrTransaction />

              <p className="px-2">Transactions</p>
            </span>

            <span className="flex hover:bg-green-500 hover:text-white items-center text-xl px-10 py-2 hover:cursor-pointer rounded-lg font-bold my-2 ">
              <BiSolidUser className="hover:text-white" />

              <p className="px-2">Customers</p>
            </span>
            <span className="flex hover:bg-green-500 hover:text-white items-center text-xl px-10 py-2 hover:cursor-pointer rounded-lg font-bold my-2 ">
              <FaMoneyBill className="hover:text-white" />

              <p className="px-2">Bills</p>
            </span>
            <span className="flex hover:bg-green-500 hover:text-white items-center text-xl px-10 py-2 hover:cursor-pointer rounded-lg font-bold my-2 ">
              <MdOutlineProductionQuantityLimits className="hover:text-white" />

              <p className="px-2">Products</p>
            </span>
            <span className="absolute flex items-center justify-center bg-green-500 text-white rounded-xl px-6 py-2  text-xl font-bold bottom-10 left-8">
              <ImClock className="mr-2" />
              {time}
            </span>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 text-4xl">
          <span className="text-sm mx-auto my-3 bg-green-600 px-2 rounded-xl py-1 text-white font-bold">
            {time.substring(0, 5) + " " + time.substring(9)}
          </span>
          <span
            onClick={() => {
              setHidden(!hidden);
            }}
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
          >
            <MdSpaceDashboard />
          </span>
          <span className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5">
            {<BiSolidReport />}
          </span>
          <span className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5">
            {<GrTransaction />}
          </span>
          <span className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5">
            {<BiSolidUser />}
          </span>
          <span className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5">
            {<FaMoneyBill />}
          </span>
          <span className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5">
            {<MdOutlineProductionQuantityLimits />}
          </span>
        </div>
      )}
    </div>
  );
};

export default SideBar;
