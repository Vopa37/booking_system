import { cn } from "../../utils";

interface Props {
  label: string;
  color: string;
}

export const Legend = ({ label, color }: Props) => {
  return (
    <div className="mb-1 flex items-center gap-2">
      <div className={cn("h-[15px] w-[15px] border border-black", color)} />
      <label className="text-sm font-medium">{label}</label>
    </div>
  );
};
