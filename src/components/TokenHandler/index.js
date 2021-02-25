import React from "react";
import { useLocation, useParams } from "react-router-dom";

export const TokenHandler = () => {
  const location = useLocation();
  const token = location.search.substring(7, location.search.length);
  localStorage.setItem("token", token);
  console.log(location);
  console.log(token);
  const params = useParams();
  console.log(params);
  // console.log("authhthth");
  return <div></div>;
};
