import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { axios } from "../utils";
import { errorToast, successToast } from "../utils/toast";
import { Button } from "./ui/button";
import { DateInput } from "./ui/date-input";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  birthday: Date | undefined;
  username: string;
  password: string;
}

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutateAsync } = useMutation((data: FormValues) =>
    axios.post("/auth/signup", data),
  );

  const navigate = useNavigate();

  const onSumbit = useCallback(
    async (data: FormValues) => {
      try {
        const response = await mutateAsync(data);
        if (response.status === 201) {
          navigate("/login");
          successToast("Registrace proběhla úspěšně");
        } else {
          errorToast("Chyba při registraci");
        }
      } catch (e) {
        errorToast("Chyba při registraci");
      }
    },
    [mutateAsync, navigate],
  );

  const onDateChange = useCallback(
    (value: Date | undefined) => {
      clearErrors("birthday");
      if (value && value > new Date()) {
        setError("birthday", {
          type: "valid",
          message: "Datum narození nemůže být v budoucnosti",
        });
      }
      setValue("birthday", value);
    },
    [setValue, setError, clearErrors],
  );

  return (
    <form
      className="m-auto w-1/2 bg-white p-6"
      onSubmit={handleSubmit(onSumbit)}
    >
      <Label htmlFor="firstname">Jméno</Label>
      <Input id="firstname" {...register("firstname")} />
      <Label htmlFor="lastname">Příjmení</Label>
      <Input id="lastname" {...register("lastname")} />
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...register("email")} />
      <Label htmlFor="birthday">Datum narození</Label>
      <DateInput onChange={onDateChange} value={watch("birthday")} />
      {errors.birthday && errors.birthday.type === "valid" && (
        <p className="text-red-500">{errors.birthday.message}</p>
      )}
      <Label htmlFor="username">Uživatelské jméno</Label>
      <Input id="username" {...register("username")} />
      <Label htmlFor="password">Heslo</Label>
      <Input id="password" type="password" {...register("password")} />
      <Link to="/login" className="mt-2 block">
        Už máte účet?
      </Link>
      <Button className="mt-2 text-white" type="submit">
        Registrace
      </Button>
    </form>
  );
};
