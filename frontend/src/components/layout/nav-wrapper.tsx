import { useAtom } from "jotai";
import { LucideLogIn, LucideLogOut } from "lucide-react";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { UserRole } from "utils/prisma";
import { authAtom } from "../../utils/auth";
import { successToast } from "../../utils/toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface NavItem {
  label: ReactNode;
  href: string;
  children?: Omit<NavItem, "children">[];
}

const getNavItems = (role?: UserRole): NavItem[] => {
  const commonItems: NavItem[] = [{ label: "DOMŮ", href: "/" }];

  const authUserItems: NavItem[] =
    role !== undefined
      ? [
          { label: "MÍSTA", href: "/venues" },
          { label: "KATEGORIE", href: "/categories" },
          { label: "KALENDÁŘ UDÁLOSTÍ", href: "/event-calendar" },
        ]
      : [];

  const moderatorItems: NavItem[] =
    role === UserRole.MODERATOR || role === UserRole.ADMIN
      ? [
          {
            label: "SPRÁVA",
            href: "",
            children: [
              { label: "UDÁLOSTI - SCHVALOVÁNÍ", href: "/approve/events" },
              { label: "MÍSTA - SCHVALOVÁNÍ", href: "/approve/venues" },
              { label: "KATEGORIE - SCHVALOVÁNÍ", href: "/approve/categories" },
              ...(role === UserRole.ADMIN
                ? [
                    {
                      label: "UŽIVATELÉ - SPRÁVA",
                      href: "/administration/users",
                    },
                  ]
                : []),
            ],
          },
        ]
      : [];

  const authItem: NavItem =
    role !== undefined
      ? {
          label: (
            <LucideLogOut onClick={() => successToast("Úspěšně odhlášeno")} />
          ),
          href: "/logout",
        }
      : { label: <LucideLogIn />, href: "/login" };

  return [...commonItems, ...authUserItems, ...moderatorItems, authItem];
};

const renderItem = (item: NavItem) => (
  <div key={item.href}>
    <Link
      to={item.href}
      key={item.href}
      style={{ textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
    >
      {item.label}
    </Link>
  </div>
);

export const NavWrapper = ({ children }: PropsWithChildren) => {
  const [auth] = useAtom(authAtom);

  const navItems = useMemo(() => getNavItems(auth?.role), [auth?.role]);

  return (
    <div className="bg-background">
      <div className="flex justify-between bg-primary p-4 text-white">
        <div className="flex">
          <Link to="/">AKCE A UDÁLOSTI</Link>
          {auth?.username && (
            <div className="ml-4">
              <b>Uživatel:</b> {auth?.username} <b>Role:</b> {auth?.role}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          {navItems.map((item) =>
            item.children ? (
              <Popover key={item.href}>
                <PopoverTrigger>{item.label}</PopoverTrigger>
                <PopoverContent>{item.children.map(renderItem)}</PopoverContent>
              </Popover>
            ) : (
              renderItem(item)
            ),
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
