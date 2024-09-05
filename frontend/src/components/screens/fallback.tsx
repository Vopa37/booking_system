import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Fallback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
