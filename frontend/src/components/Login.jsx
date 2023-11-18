import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../constant";
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./Loading";

axios.defaults.withCredentials;

const Login = () => {
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // console.log({ username, password });
    try {
      const res = await axios.post(apiUrl + "/login", { username, password });
      console.log(res.data);
      dispatch(setUser({ username, isAdmin: res.data.user.isAdmin }));
      setLoading(false);
      toast.success("Login Successfull");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error;
    }
  };
  return (
    <div className="flex items-center  justify-center min-w-[100vw] min-h-[100vh]">
      <div className="min-w-[50vw]  min-h-[50vh] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className=" min-w-[20vw] py-6  shadow-xl shadow-gray-500 rounded-xl px-10 min-h-[45vh] items-center justify-center "
        >
          <h1 className="text-3xl font-bold  text-center">Login </h1>{" "}
          <span className="flex items-center justify-center my-12">
            <FaUser size={25} className="" />

            <input
              type="text"
              value={username}
              className="border-black text-3xl pl-3 ml-6 border-b-4 outline-none focus:border-green-500 "
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
            />
          </span>
          <span className="flex items-center justify-center my-12">
            <FaKey size={25} />

            <input
              type="password"
              value={password}
              className="border-black text-3xl pl-3 ml-6 border-b-4 outline-none focus:border-green-500 "
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />
          </span>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-xl text-2xl"
          >
            Login
          </button>
        </form>
      </div>
      {loading && <Loading />}
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default Login;
