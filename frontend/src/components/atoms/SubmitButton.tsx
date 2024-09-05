import { PropsWithChildren } from "react";

const SubmitButton = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <button
      type="submit"
      className={`${className} mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-green-700`}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
