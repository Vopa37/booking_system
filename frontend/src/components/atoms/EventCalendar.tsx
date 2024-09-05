import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {DayClickEventHandler, Matcher, MonthChangeEventHandler} from "react-day-picker";
import { Event } from "../../utils/prisma";
import { EventCalendarDayType } from "../screens/eventCalendarScreen";
import { Calendar } from "../ui/calendar";

const currentYear = new Date().getFullYear();

const fromDate = new Date();
fromDate.setFullYear(currentYear - 100);

const toDate = new Date();
toDate.setFullYear(currentYear + 5);

const getEventMatcher =
  (event: Event): Matcher =>
  (day: Date) =>
    day >= event.event_start && day <= event.event_end;

const findEventsForDate = (events: Event[], date: Date) =>
  events.filter(
    (event) => date >= event.event_start && date <= event.event_end,
  );

interface Props {
  events: Event[];
  setActiveDay: Dispatch<SetStateAction<EventCalendarDayType>>;
  onMonthChange: MonthChangeEventHandler;
}

const EVENT_COLORS = [
  "bg-[#55A630]",
  "bg-[#FFFF3F]",
  "bg-[#80B918]",
  "bg-[#DDDF00]",
  "bg-[#0089C6]",
  "bg-[#BFD200]",
];

export const EventCalendar = ({ events, setActiveDay, onMonthChange }: Props) => {
  const modifiers = useMemo(
    () =>
      events.reduce<Record<number, Matcher>>((acc, obj) => {
        acc[obj.id] = getEventMatcher(obj);

        return acc;
      }, {}),
    [events],
  );

  const modifierClassNames = useMemo(
    () =>
      events.reduce<Record<number, string>>((acc, obj, index) => {
        acc[obj.id] = EVENT_COLORS[index % EVENT_COLORS.length];

        return acc;
      }, {}),
    [events],
  );

  useEffect(() => {
    setActiveDay((oldActiveDay) => ({
      events: findEventsForDate(events, oldActiveDay.date).map((event) => ({
        ...event,
        className: modifierClassNames[event.id],
      })),
      date: oldActiveDay.date,
    }));
  }, [events, modifierClassNames, setActiveDay]);

  const onDayClick: DayClickEventHandler = useCallback(
    (day) => {
      setActiveDay({
        events: findEventsForDate(events, day).map((event) => ({
          ...event,
          className: modifierClassNames[event.id],
        })),
        date: day,
      });
    },
    [events, modifierClassNames, setActiveDay],
  );

  return (
    <div className="flex justify-center">
      <Calendar
        fromDate={fromDate}
        toDate={toDate}
        captionLayout="dropdown-buttons"
        onDayClick={onDayClick}
        modifiers={modifiers}
        modifiersClassNames={modifierClassNames}
        onMonthChange={onMonthChange}
      />
    </div>
  );
};
