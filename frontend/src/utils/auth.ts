import { atomWithStorage } from "jotai/utils";
import { UserRole } from "utils/prisma";

interface AuthAtom {
  id: number;
  role: UserRole;
  username: string;
  token: string;
}

export const authAtom = atomWithStorage<AuthAtom | undefined>(
  "auth",
  localStorage.getItem("auth") && localStorage.getItem("auth") !== "undefined"
    ? JSON.parse(localStorage.getItem("auth")!)
    : undefined,
);
