import SubmitButton from "components/atoms/SubmitButton";
import { DateInput } from "components/ui/date-input";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Textarea } from "components/ui/textarea";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { UserRole } from "utils/prisma";
import { CreateUserType } from "utils/types";

const UserForm = ({ data, onSubmit }: { data?: any; onSubmit: any }) => {
  const {
    setValue,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<CreateUserType>({ defaultValues: data });

  const onDateChange = useCallback(
    (value: Date | undefined) => {
      setValue("birthday", value);
    },
    [setValue],
  );

  return (
    <form
      className="m-auto w-1/2 bg-white p-6"
      onSubmit={handleSubmit((formData) => {
        onSubmit(formData);
      })}
    >
      <Label htmlFor="firstname">Jméno</Label>
      <Input id="firstname" {...register("firstname", { required: true })} />
      {errors.firstname && errors.firstname.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="lastname">Příjmení</Label>
      <Input id="lastname" {...register("lastname", { required: true })} />
      {errors.lastname && errors.lastname.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...register("email", { required: true })} />
      {errors.email && errors.email.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="username">Uživatelské jméno</Label>
      <Input id="username" {...register("username", { required: true })} />
      {data ? (
        <></>
      ) : (
        <>
          <Label htmlFor="password">Heslo</Label>
          <Input id="password" type="password" {...register("password")} />
        </>
      )}
      {errors.username && errors.username.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label>Datum narození</Label>
      <DateInput onChange={onDateChange} value={watch("birthday")} />
      <Label htmlFor="role">Role</Label>
      <Select
        onValueChange={(value) => {
          setValue(`role`, value);
        }}
      >
        <SelectTrigger className="bg-white">
          {data ? (
            <SelectValue placeholder={data.role} />
          ) : (
            <SelectValue placeholder="Vyberte roli" />
          )}
        </SelectTrigger>

        <SelectContent>
          {Object.values(UserRole).map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {data ? (
        <SubmitButton>Upravit uživatele</SubmitButton>
      ) : (
        <SubmitButton>Přidat uživatele</SubmitButton>
      )}
    </form>
  );
};

export default UserForm;
