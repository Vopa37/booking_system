import { MouseEventHandler, PropsWithChildren } from "react";

export const DeleteButton = ({
  children,
  className,
  onClick,
}: PropsWithChildren<{ onClick: MouseEventHandler; className?: string }>) => {
  return (
    <button
      onClick={onClick}
      className={`${className} rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700`}
    >
      {children}
    </button>
  );
};
