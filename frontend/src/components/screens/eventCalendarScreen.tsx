import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAssertRole } from "utils/useAssertRole";
import { useAxiosWithAuth } from "../../utils";
import { Event, UserRole } from "../../utils/prisma";
import { EventCalendar } from "../atoms/EventCalendar";
import { EventCalendarDay } from "../atoms/EventCalendarDay";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";
import dayjs from "dayjs";

export interface EventCalendarDayType {
  date: Date;
  events: (Event & { className: string })[];
}

const today = dayjs();

export const EventCalendarScreen = () => {
  useAssertRole(UserRole.AUTH_USER);
  const axios = useAxiosWithAuth();
  const [yearMonth, setYearMonth] = useState({year: today.year(), month: today.month() + 1})
  const { data, refetch } = useQuery(["eventCalendar"], () =>
    axios.get<Event[]>(`/event/${yearMonth.year}/${yearMonth.month}`),
  );
  const [activeDay, setActiveDay] = useState<EventCalendarDayType>({
    date: new Date(),
    events: [],
  });

  const parsedEvents = useMemo(
    () =>
      data?.data.map((event) => ({
        ...event,
        event_end: new Date(event.event_end),
        event_start: new Date(event.event_start),
      })),
    [data?.data],
  );

  const onMonthChange = useCallback((date: Date) => {
    const dayjsDate = dayjs(date);
    setYearMonth({year: dayjsDate.year(), month: dayjsDate.month() + 1});
  }, []);

  useEffect(() => {
    refetch()
  }, [yearMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Header>KALENDÁŘ UDÁLOSTÍ</Header>
      <div className="m-auto flex w-3/4 gap-2">
        <div className="w-1/2 bg-white p-6">
          {parsedEvents ? (
            <EventCalendar events={parsedEvents} setActiveDay={setActiveDay} onMonthChange={onMonthChange} />
          ) : (
            <Loader />
          )}
        </div>
        <div className="w-1/2 bg-white p-6">
          <EventCalendarDay day={activeDay} />
        </div>
      </div>
    </div>
  );
};
