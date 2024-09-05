import { LucideCheck, LucideX } from "lucide-react";
import { MouseEventHandler } from "react";
import { Button } from "../ui/button";

interface Props {
  destructive?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const ApproveButton = ({ destructive, onClick }: Props) => {
  return (
    <Button
      className="h-[15px] px-2 py-4"
      variant={destructive ? "destructive" : "default"}
      onClick={onClick}
    >
      {destructive ? (
        <LucideX className="h-[15px] w-[15px]" />
      ) : (
        <LucideCheck className="h-[15px] w-[15px]" />
      )}
    </Button>
  );
};
