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
      // Navigate to the login page
      navigate("/login");
    }
    // Note: No need for an else block here, as the navigate("/login") call will stop the execution if the user is not authenticated.
  }, [user]);

  // Render the protected component only if the user is authenticated
  return user.username ? <Component /> : null;
};

export default Protected;
