import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

const PrimaryButton = ({
  children,
  className,
  href,
}: PropsWithChildren<{ href: string; className?: string }>) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(href);
      }}
      className={`${className} rounded bg-primary px-4 py-2 text-white hover:bg-green-700`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
