import * as a from "axios";
import { useAtom } from "jotai";
import { authAtom } from "./auth";

export const axios = a.default.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/",
});

export const useAxiosWithAuth = () => {
  const [auth] = useAtom(authAtom);
  return a.default.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/",
    headers: auth ? { Authorization: `Bearer ${auth?.token}` } : undefined,
  });
};
