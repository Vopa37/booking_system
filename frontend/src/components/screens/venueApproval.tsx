import { useQuery } from "@tanstack/react-query";
import { UserRole } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import { VenuesData } from "../../types/createEvent";
import { useAxiosWithAuth } from "../../utils";
import { VenueApprovalForm } from "../atoms/VenueApprovalForm";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";

export const VenueApproval = () => {
  useAssertRole(UserRole.MODERATOR);
  const axios = useAxiosWithAuth();
  const { data: venues, refetch } = useQuery({
    queryFn: () => axios.get<VenuesData[]>("/venue/unapproved"),
  });

  return (
    <div>
      <Header>SCHVALOVÁNÍ MÍST</Header>
      <div className="m-auto w-1/2 bg-white p-6">
        {venues ? (
          venues?.data.map((venue) => (
            <VenueApprovalForm
              venue={venue}
              refetchVenues={refetch}
              key={venue.id}
            />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
