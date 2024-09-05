import { MouseEventHandler, PropsWithChildren } from "react";

export const EditButton = ({
  children,
  className,
  onClick,
}: PropsWithChildren<{ onClick: MouseEventHandler; className?: string }>) => {
  return (
    <button
      onClick={onClick}
      className={`${className} rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-700`}
    >
      {children}
    </button>
  );
};
