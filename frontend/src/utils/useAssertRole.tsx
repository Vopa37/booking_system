import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { authAtom } from "./auth";
import { UserRole } from "./prisma";
import { infoToast } from "./toast";

export const useAssertRole = (role: UserRole) => {
  const [auth] = useAtom(authAtom);
  const navigate = useNavigate();

  if (
    !auth ||
    (auth.role === UserRole.MODERATOR && role === UserRole.ADMIN) ||
    (auth.role === UserRole.AUTH_USER &&
      (role === UserRole.MODERATOR || role === UserRole.ADMIN))
  ) {
    infoToast("Pro vstup na tuto stránku nemáte dostatečné oprávnění", {
      id: "noAuthorization",
    });
    navigate("/");
  }
};
