import { useQuery } from "@tanstack/react-query";
import PrimaryButton from "components/atoms/PrimaryButton";
import { Checkbox } from "components/ui/checkbox";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn, useAxiosWithAuth } from "utils";
import { authAtom } from "utils/auth";
import formatDate from "utils/dateFormatter";
import { CategoriesData } from "../../types/createEvent";
import { getCategorySelectionLogic } from "../../utils/categorySelectionLogic";
import { CategoryList } from "../atoms/CategoryList";
import { Legend } from "../atoms/Legend";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";

interface EventData {
  name: string;
  event_start: string;
  event_end: string;
  image?: string;
  capacity: number;
  id: number;
  is_confirmed: boolean;
  created_by_id: number;
}

interface requestData {
  categories: number[];
  createdBy?: number;
}

export const Events = () => {
  const [filterCategories, setFilterCategories] = useState<number[]>([]);
  const [managedEvents, setManagedEvents] = useState<Boolean>(false);
  const [showFutureEvents, setShowFutureEvents] = useState(true);
  const [showActiveEvents, setShowActiveEvents] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);

  const [auth] = useAtom(authAtom);
  const axios = useAxiosWithAuth();
  const { data: events, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: () => {
      const requestData: requestData = {
        categories: filterCategories,
      };

      if (managedEvents) {
        requestData.createdBy = auth?.id;
      }

      return axios.post<EventData[]>("/event/get-by-categories", requestData);
    },
  });

  useEffect(() => {
    refetch();
  }, [filterCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: categories } = useQuery({
    queryFn: () =>
      axios.post<CategoriesData[]>("/category/confirmed", { confirmed: true }),
    queryKey: ["categories"],
  });

  const getFilterCategories = useCallback(
    () => filterCategories,
    [filterCategories],
  );
  const wrappedSetFilterCategories = useCallback(
    (categories: number[]) => setFilterCategories(categories),
    [],
  );

  const onCheckedChange = useMemo(
    () =>
      getCategorySelectionLogic(
        getFilterCategories,
        wrappedSetFilterCategories,
        "FILTER",
        categories?.data,
      ),
    [categories?.data, getFilterCategories, wrappedSetFilterCategories],
  );
  useEffect(() => {
    refetch();
  }, [managedEvents]);

  const onManageEvents = useCallback(() => {
    setManagedEvents(!managedEvents);
  }, [managedEvents]);

  const onShowFutureEventsChange = useCallback((checked: boolean) => {
    setShowFutureEvents(checked);
  }, []);

  const onShowActiveEventsChange = useCallback((checked: boolean) => {
    setShowActiveEvents(checked);
  }, []);

  const onShowPastEventsChange = useCallback((checked: boolean) => {
    setShowPastEvents(checked);
  }, []);

  const futureEvents = useMemo(
    () => events?.data.filter((event) => dayjs().isBefore(event.event_start)),
    [events?.data],
  );
  const activeEvents = useMemo(
    () =>
      events?.data.filter(
        (event) =>
          dayjs().isAfter(event.event_start) &&
          dayjs().isBefore(event.event_end),
      ),
    [events?.data],
  );
  const pastEvents = useMemo(
    () => events?.data.filter((event) => dayjs().isAfter(event.event_end)),
    [events?.data],
  );

  const renderEvent = useCallback(
    (type: "future" | "active" | "past") => (item: EventData) => (
      <div
        key={item.id}
        className={cn(
          "flex flex-col overflow-hidden rounded-lg shadow-md",
          item.is_confirmed
            ? type === "future"
              ? "bg-[#80B918]"
              : type === "active"
              ? "bg-[#0089C6]"
              : "bg-[#DDDF00]"
            : "bg-[gray]",
        )}
      >
        <Link to={`/event/${item.id}`}>
          {item.image ? (
            <img className="h-40 w-full object-cover" src={item.image} alt="" />
          ) : (
            <div className="h-40 w-full"></div>
          )}
          <div className="flex flex-1 flex-col p-4">
            <p className="mb-2 text-xl font-bold">{item.name}</p>
            <p className="text-gray-600">
              {formatDate(item.event_start)} - {formatDate(item.event_end)}
            </p>
          </div>
        </Link>
      </div>
    ),
    [],
  );

  return (
    <div className="container relative mx-auto my-8">
      <Header>Akce a události</Header>
      <Accordion type="multiple" className="mb-4 rounded bg-white">
        <AccordionItem value="filter">
          <AccordionTrigger className="px-4">
            Filtrovat podle kategorií
          </AccordionTrigger>
          <AccordionContent>
            {categories?.data ? (
              <CategoryList
                categories={categories?.data}
                checkedCategories={filterCategories}
                borderless
                onCheckedChange={onCheckedChange}
              />
            ) : (
              <Loader />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex">
          <div>
            <div className="mb-2 mr-4 flex items-center space-x-2">
              <Checkbox
                id="futureEvents"
                checked={showFutureEvents}
                onCheckedChange={onShowFutureEventsChange}
              />
              <label
                htmlFor="futureEvents"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Zobrazit nadcházející události
              </label>
            </div>
            <div className="mb-2 mr-4 flex items-center space-x-2">
              <Checkbox
                id="activeEvents"
                checked={showActiveEvents}
                onCheckedChange={onShowActiveEventsChange}
              />
              <label
                htmlFor="activeEvents"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Zobrazit probíhající události
              </label>
            </div>
            <div className="mr-4 flex items-center space-x-2">
              <Checkbox
                id="pastEvents"
                checked={showPastEvents}
                onCheckedChange={onShowPastEventsChange}
              />
              <label
                htmlFor="pastEvents"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Zobrazit proběhlé události
              </label>
            </div>
          </div>
          <div>
            <Legend label="Nadcházející události" color="bg-[#80B918]" />
            <Legend label="Probíhající události" color="bg-[#0089C6]" />
            <Legend label="Proběhlé události" color="bg-[#DDDF00]" />
            <Legend label="Nepotvrzené události" color="bg-[gray]" />
          </div>
        </div>
        <div>
          {auth && (
            <div className="flex">
              <div className="mr-4 flex items-center space-x-2">
                <Checkbox id="terms" onCheckedChange={() => onManageEvents()} />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Zobrazit spravované události
                </label>
              </div>
              <div>
                <PrimaryButton href="event/create">
                  Přidat událost
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!events?.data && <Loader />}
        {showFutureEvents && futureEvents?.map(renderEvent("future"))}
        {showActiveEvents && activeEvents?.map(renderEvent("active"))}
        {showPastEvents && pastEvents?.map(renderEvent("past"))}
      </div>
    </div>
  );
};
