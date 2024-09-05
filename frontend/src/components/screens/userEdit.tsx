import { useMutation, useQuery } from "@tanstack/react-query";
import UserForm from "components/forms/userForm";
import { Header } from "components/ui/header";
import { Loader } from "components/ui/loader";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosWithAuth } from "utils";
import { User, UserRole } from "utils/prisma";
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

export const EditUser = () => {
  useAssertRole(UserRole.ADMIN);
  const axios = useAxiosWithAuth();

  const { id } = useParams();

  const { data: user } = useQuery({
    queryFn: () => axios.get<User>(`/user/${id}`),
    queryKey: [`userEdit/${id}`],
  });

  const navigate = useNavigate();
  const { mutateAsync } = useMutation((data: FormValues) =>
    axios.patch(`/user/${id}`, data),
  );

  const onSumbit = useCallback(
    async (data: FormValues) => {
      try {
        const response = await mutateAsync(data);

        if (response.status === 201) {
          successToast("Uživatel úspěšně upraven");
          navigate("/administration/users");
        } else {
          errorToast("Chyba při úpravě uživatele");
        }
      } catch (error) {
        errorToast("Chyba při úpravě uživatele");
      }
    },
    [mutateAsync, navigate],
  );

  return (
    <div>
      <Header>Úprava uživatele</Header>
      {user?.data ? (
        <UserForm onSubmit={onSumbit} data={user.data} />
      ) : (
        <Loader />
      )}
    </div>
  );
};
