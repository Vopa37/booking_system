import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { decodeToken } from "react-jwt";
import { Link, useNavigate } from "react-router-dom";
import { User } from "utils/prisma";
import { axios } from "../utils";
import { authAtom } from "../utils/auth";
import { errorToast, successToast } from "../utils/toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FormValues {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutateAsync } = useMutation((data: FormValues) =>
    axios.post("/auth/login", data),
  );

  const [, setAuth] = useAtom(authAtom);

  const navigate = useNavigate();

  const onSumbit = useCallback(
    async (data: FormValues) => {
      try {
        const response = await mutateAsync(data);
        if (response.status === 200) {
          const user = decodeToken<Omit<User, "id"> & { sub: number }>(
            response.data.accessToken,
          );
          if (user) {
            setAuth({
              id: user.sub,
              role: user.role,
              token: response.data.accessToken,
              username: response.data.username,
            });
            navigate("/");
            successToast("Úspěšně přihlášeno");
          }
        } else {
          errorToast("Chybné přihlašovací údaje");
        }
      } catch (e) {
        errorToast("Chybné přihlašovací údaje");
      }
    },
    [mutateAsync, navigate, setAuth],
  );

  return (
    <form
      className="m-auto w-1/2 bg-white p-6"
      onSubmit={handleSubmit(onSumbit)}
    >
      <Label htmlFor="username">Uživatelské jméno</Label>
      <Input id="username" {...register("username", { required: true })} />
      {errors.username && errors.username.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="password">Heslo</Label>
      <Input
        id="password"
        type="password"
        {...register("password", { required: true })}
      />
      {errors.password && errors.password.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Link to="/register" className="mt-2 block">
        Nemáte účet?
      </Link>
      <Button className="mt-2 text-white" type="submit">
        Přihlásit se
      </Button>
    </form>
  );
};
