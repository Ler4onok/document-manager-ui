import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

export const TokenHandler = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const token = location.search.substring(7, location.search.length);
    localStorage.setItem("token", token);
  }, []);

  history.push("/");

  return <div></div>;
};
