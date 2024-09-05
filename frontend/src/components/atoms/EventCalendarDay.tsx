import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { cn } from "../../utils";
import { EventCalendarDayType } from "../screens/eventCalendarScreen";

interface Props {
  day: EventCalendarDayType;
}

interface EventDetailProps {
  event: EventCalendarDayType["events"][number];
}

const EventDetail = ({ event }: EventDetailProps) => (
  <Link
    to={`/event/${event.id}`}
    className={cn(
      "mt-2 block w-[100%] rounded bg-primary p-4",
      event.className,
    )}
  >
    {event.name}
  </Link>
);

export const EventCalendarDay = ({ day }: Props) => {
  return (
    <div>
      <div className="text-xl">
        Události pro den {dayjs(day.date).format("DD. MM. YYYY")}:
      </div>
      <div className="w-full flex-col">
        {day.events.length
          ? day.events.map((event) => <EventDetail event={event} />)
          : "Pro tento den nemáte žádné události."}
      </div>
    </div>
  );
};
