import { useAtom } from "jotai";
import { PropsWithChildren } from "react";
import { authAtom } from "utils/auth";
import { UserRole } from "utils/prisma";

const AuthResolver = ({
  children,
  roles,
  createdById,
}: PropsWithChildren<{ roles: UserRole[]; createdById: number }>) => {
  const [auth] = useAtom(authAtom);
  if ((auth?.role && roles.includes(auth?.role)) || createdById === auth?.id) {
    return <div>{children}</div>;
  }
  return <></>;
};
export default AuthResolver;
