import { Triangle } from "react-loader-spinner";
import { cn } from "../../utils";

interface Props {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

export const Loader = ({ className, color, height, width }: Props) => (
  <Triangle
    height={height ?? 40}
    width={width ?? 40}
    color={color ?? "rgba(25, 138, 30, 0.5)"}
    wrapperClass={cn("flex justify-center", className)}
  />
);
