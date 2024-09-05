import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteButton } from "components/atoms/DeleteButton";
import { EditButton } from "components/atoms/EditButton";
import PrimaryButton from "components/atoms/PrimaryButton";
import { Loader } from "components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useNavigate } from "react-router-dom";
import { useAxiosWithAuth } from "utils";
import formatDate from "utils/dateFormatter";
import { User, UserRole } from "utils/prisma";
import { successToast } from "utils/toast";
import { useAssertRole } from "utils/useAssertRole";
import { Header } from "../ui/header";

export const UsersAdministration = () => {
  useAssertRole(UserRole.ADMIN);
  const axios = useAxiosWithAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: users } = useQuery({
    queryFn: () => axios.get<User[]>("/user"),
    queryKey: ["users"],
  });

  return (
    <>
      <Header>Správa uživatelů</Header>
      <div className="flex items-center justify-center">
        <div className="w-9/12 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ">
          {users ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Uživatelské jméno</TableHead>
                  <TableHead>Jméno</TableHead>
                  <TableHead>Příjmení</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Datum narození</TableHead>
                  <TableHead>Role</TableHead>

                  <TableHead>
                    <PrimaryButton href="/user/create">
                      Nový uživatel
                    </PrimaryButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.data.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.birthday)}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <EditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${user.id}/edit`);
                        }}
                        className="mr-4 self-end"
                      >
                        Upravit
                      </EditButton>
                      <DeleteButton
                        onClick={async (e) => {
                          e.stopPropagation();
                          await axios.delete(`/user/${user.id}`);
                          queryClient.invalidateQueries({
                            queryKey: ["users"],
                          });
                          successToast("Uživatel úspěšně smazán");
                        }}
                      >
                        Smazat
                      </DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
};
