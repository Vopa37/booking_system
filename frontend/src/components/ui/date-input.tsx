import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateInputProps {
  value: Date | undefined;
  onChange(value: Date | undefined): void;
}

const currentYear = new Date().getFullYear();

const fromDate = new Date();
fromDate.setFullYear(currentYear - 100);

const toDate = new Date();
toDate.setFullYear(currentYear + 5);

export const DateInput = ({ value, onChange }: DateInputProps) => {
  const [open, setOpen] = useState(false);

  const onSelect = useCallback(
    (date: Date | undefined) => {
      onChange(date);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover open={open}>
      <PopoverTrigger className="block w-full" onClick={() => setOpen(true)}>
        <Input
          className="w-full"
          value={value ? dayjs(value).format("DD. MM. YYYY") : undefined}
        />
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          className="bg-[#fff]"
          mode="single"
          selected={value}
          onSelect={onSelect}
          fromDate={fromDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  );
};
