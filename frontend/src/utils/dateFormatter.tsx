import { format } from "date-fns";

export function formatDate(date: string) {
  const parsedDate = date ? new Date(date) : null;

  return parsedDate ? format(parsedDate, "dd. MM. yyyy") : "Neplatné datum";
}

export default formatDate;
