import { useQuery } from "@tanstack/react-query";
import { UserRole } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import { VenuesData } from "../../types/createEvent";
import { useAxiosWithAuth } from "../../utils";
import { EventApprovalForm } from "../atoms/EventApprovalForm";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";

export const EventApproval = () => {
  useAssertRole(UserRole.MODERATOR);
  const axios = useAxiosWithAuth();
  const { data: events, refetch } = useQuery({
    queryFn: () => axios.get<VenuesData[]>("/event/unapproved"),
  });

  return (
    <div>
      <Header>SCHVALOVÁNÍ UDÁLOSTÍ</Header>
      <div className="m-auto w-1/2 bg-white p-6">
        {events ? (
          events?.data.map((event) => (
            <EventApprovalForm event={event} refetchEvents={refetch} />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
