import { PropsWithChildren } from "react";

export const Header = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <h1 className={`my-6 text-center text-2xl ${className}`}>{children}</h1>
);
