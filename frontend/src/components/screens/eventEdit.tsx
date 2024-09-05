import { useQuery } from "@tanstack/react-query";
import { Header } from "components/ui/header";
import { Loader } from "components/ui/loader";
import { useParams } from "react-router-dom";
import { useAxiosWithAuth } from "utils/axios";
import { UserRole } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import EventForm from "../forms/eventForm";

export const EditEvent = () => {
  useAssertRole(UserRole.AUTH_USER);

  const axios = useAxiosWithAuth();

  const { id } = useParams();

  const { data: event } = useQuery({
    queryFn: () => axios.get<Event>("/event/" + id),
    queryKey: ["event", id],
  });

  return (
    <>
      <Header>Úprava události</Header>
      {event?.data ? <EventForm isEdit={true} data={event.data} /> : <Loader />}
    </>
  );
};
