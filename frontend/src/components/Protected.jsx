import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({ Component }) => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user.username) {
      navigate("/");
    }
    if (!user.username) {
      navigate("/login");
    }
  }, [user]);

  return user.username ? <Component /> : null;
};

export default Protected;
