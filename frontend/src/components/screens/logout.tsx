import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAtom } from "../../utils/auth";

export const Logout = () => {
  const [, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(undefined);
    navigate("/");
  }, [navigate, setAuth]);

  return null;
};
