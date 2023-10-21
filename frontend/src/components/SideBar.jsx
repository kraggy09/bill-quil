import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BiSolidReport } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { useEffect } from "react";
import { BiSolidUser } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa";
import { ImClock } from "react-icons/im";
import {
  MdSpaceDashboard,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import getDate from "../../../backend/src/config/getDate";

const SideBar = () => {
  const [time, setTime] = useState("");
  const [hidden, setHidden] = useState(false);

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

  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className={`${
        hidden ? "max-w-[80px]" : "max-w-[250px]"
      } min-h-[100vh] shadow-xl shadow-gray-400`}
    >
      {!hidden ? (
        <>
          <p className="text-xl font-bold px-8 py-3 bg-green-500 text-white p-2">
            Date:{getDate()}
          </p>
          <h1 className="text-xl text-center font-bold p-5">
            Sultan Communication & General Stores
          </h1>
          <div id="navigation" className="w-full gap-y-6 grid-cols-1 grid">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "bg-green-500 text-white" : ""
              }
            >
              <span
                onClick={() => setHidden(true)}
                className="text-2xl flex items-center py-1 hover:bg-gray-300 hover:text-black justify-center"
              >
                <MdSpaceDashboard className="hover:text-white" />
                <p className="px-2">Dashboard</p>
              </span>
            </NavLink>

            <NavLink
              to="/daily-report"
              className={({ isActive }) =>
                isActive ? "bg-green-500 text-white" : ""
              }
            >
              <span
                onClick={() => setHidden(true)}
                className="text-2xl flex items-center py-1 hover:bg-gray-300 hover:text-black justify-center"
              >
                <BiSolidReport className="hover:text-white" />
                <p className="px-2">Daily Report</p>
              </span>
            </NavLink>

            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "bg-green-500 text-white" : ""
              }
            >
              <span
                onClick={() => setHidden(true)}
                className="text-2xl flex items-center py-1 hover:bg-gray-300 hover:text-black justify-center"
              >
                <GrTransaction />
                <p className="px-2">Transactions</p>
              </span>
            </NavLink>

            <NavLink
              to="/customers"
              className={({ isActive }) =>
                isActive ? "bg-green-500 text-white" : ""
              }
            >
              <span
                onClick={() => setHidden(true)}
                className="text-2xl flex items-center py-1 hover:bg-gray-300 hover:text-black justify-center"
              >
                <BiSolidUser className="hover:text-white" />
                <p className="px-2">Customers</p>
              </span>
            </NavLink>

            <NavLink
              to="/bills"
              className={({ isActive }) =>
                isActive ? "bg-green-500 text-white" : ""
              }
            >
              <span
                onClick={() => setHidden(true)}
                className="text-2xl flex items-center py-1 hover:bg-gray-300 hover:text-black justify-center"
              >
                <FaMoneyBill className="hover:text-white" />
                <p className="px-2">Bills</p>
              </span>
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "bg-green-500 text-white" : ""
              }
            >
              <span
                onClick={() => setHidden(true)}
                className="text-2xl flex items-center py-1 hover:bg-gray-300 hover:text-black justify-center"
              >
                <MdOutlineProductionQuantityLimits className="hover:text-white" />
                <p className="px-2">Products</p>
              </span>
            </NavLink>

            <span className="absolute flex items-center justify-center bg-green-500 text-white rounded-xl px-6 py-2 text-xl font-bold bottom-10 left-8">
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
          <NavLink
            to="/"
            onClick={() => setHidden(false)}
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
            activeClassName="bg-green-500 text-white"
          >
            <MdSpaceDashboard />
          </NavLink>
          <NavLink
            to="/daily-report"
            onClick={() => setHidden(true)}
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
            activeClassName="bg-green-500 text-white"
          >
            <BiSolidReport />
          </NavLink>
          <NavLink
            to="/transactions"
            onClick={() => setHidden(true)}
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
            activeClassName="bg-green-500 text-white"
          >
            <GrTransaction />
          </NavLink>
          <NavLink
            to="/customers"
            onClick={() => setHidden(true)}
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
            activeClassName="bg-green-500 text-white"
          >
            <BiSolidUser />
          </NavLink>
          <NavLink
            to="/bills"
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
            onClick={() => setHidden(true)}
            activeClassName="bg-green-500 text-white"
          >
            <FaMoneyBill />
          </NavLink>
          <NavLink
            to="/products"
            className="mx-auto rounded-full hover:bg-green-600 hover:text-white px-2 py-2 my-5"
            onClick={() => setHidden(true)}
            activeClassName="bg-green-500 text-white"
          >
            <MdOutlineProductionQuantityLimits />
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default SideBar;
