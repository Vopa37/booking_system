import { LucideCheck, LucideInfo, LucideX } from "lucide-react";
import { toast } from "react-hot-toast";

export const successToast = (text: string) =>
  toast(text, { icon: <LucideCheck color="green" /> });

export const errorToast = (text: string) =>
  toast(text, { icon: <LucideX color="red" /> });

export const infoToast = (text: string, options?: { id?: string }) => {
  toast(text, { icon: <LucideInfo color="blue" />, ...options });
};
