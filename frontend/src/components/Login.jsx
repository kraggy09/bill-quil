import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../constant";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import { Toaster, toast } from "react-hot-toast";
axios.defaults.withCredentials = true;
const Login = () => {
  const ref = useRef();
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const checkLoggedIn = async () => {
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        toast.success("Please re-login");
        return;
      }
      let res = await axios.post(apiUrl + "/verifyAuth", { token: token });

      if (res.data.user) {
        dispatch(
          setUser({
            username: res.data.user.username,
            isAdmin: res.data.user.isAdmin,
            pin: res.data?.user?.pin,
            id: res.data.user._id,
          })
        );

        toast.success("Login Successful");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.error) {
        toast.success("Please relogin ," + error.response.data.error);
      }
      localStorage.removeItem("token");
    }
  };
  useEffect(() => {
    checkLoggedIn();
    ref.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(apiUrl + "/login", { username, password });
      console.log(res.data);
      let token = res.data.token;
      dispatch(
        setUser({
          username,
          isAdmin: res.data.user.isAdmin,
          pin: res.data?.user?.pin,
          id: res.data.user._id,
        })
      );
      localStorage.setItem("token", token);

      setLoading(false);
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.msg || "Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-w-[100vw] min-h-[100vh] bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="md:min-w-[45vw] lg:min-w-[35vw] xl:min-w-[30vw] min-w-[70vw] px-6 py-8 gap-y-6 flex flex-col shadow-xl shadow-gray-400 bg-white rounded-lg"
      >
        <div>
          <h1 className="text-2xl mb-2 font-bold">Login</h1>
          <p className="text-sm text-gray-400">
            Enter your credentials to login
          </p>
        </div>
        <div className="flex flex-col mb-2">
          <label
            className="text-sm text-gray-600 font-semibold mb-2"
            htmlFor="username"
          >
            Enter your Username
          </label>
          <input
            ref={ref}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-500"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            type="text"
            id="username"
            placeholder="Username"
            autoComplete="username"
            aria-label="Username"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label
            className="text-sm text-gray-600 font-semibold mb-2"
            htmlFor="password"
          >
            Enter your Password
          </label>
          <input
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-500"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Login
        </button>
      </form>
      {loading && <Loading />}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Login;
