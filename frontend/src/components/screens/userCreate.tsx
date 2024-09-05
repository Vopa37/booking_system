import { useMutation } from "@tanstack/react-query";
import UserForm from "components/forms/userForm";
import { Header } from "components/ui/header";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosWithAuth } from "utils";
import { UserRole } from "utils/prisma";
import { errorToast, successToast } from "utils/toast";
import { useAssertRole } from "utils/useAssertRole";

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  birthday: Date | undefined;
  username: string;
  password: string;
  role: string;
}

export const CreateUser = () => {
  useAssertRole(UserRole.ADMIN);
  const axios = useAxiosWithAuth();

  const navigate = useNavigate();
  const { mutateAsync } = useMutation((data: FormValues) =>
    axios.post("/user", data),
  );

  const onSumbit = useCallback(
    async (data: FormValues) => {
      try {
        const response = await mutateAsync(data);

        if (response.status === 201) {
          successToast("Uživatel úspěšně vytvořen");
          navigate("/administration/users");
        } else {
          errorToast("Chyba při vytváření uživatele");
        }
      } catch (error) {
        errorToast("Chyba při vytváření uživatele");
      }
    },
    [mutateAsync, navigate],
  );

  return (
    <div>
      <Header>Nový uživatele</Header>
      <UserForm onSubmit={onSumbit} />
    </div>
  );
};
