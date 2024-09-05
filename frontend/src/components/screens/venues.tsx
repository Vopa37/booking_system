import { useQuery } from "@tanstack/react-query";
import PrimaryButton from "components/atoms/PrimaryButton";
import { VenueListItem } from "components/screens/venue";
import { useParams } from "react-router-dom";
import { useAxiosWithAuth } from "utils";
import { UserRole, Venue } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";

export const Venues = () => {
  useAssertRole(UserRole.AUTH_USER);
  const axios = useAxiosWithAuth();

  const { data: venues } = useQuery({
    queryFn: () => axios.get<Venue[]>("/venue"),
    queryKey: ["venues"],
  });
  return (
    <div>
      <Header>MÍSTA</Header>

      <div className="m-auto w-1/2 p-6">
        <PrimaryButton className="float-right mb-4" href="/venues/create">
          Nové místo
        </PrimaryButton>
        {venues ? (
          venues.data.map((venue, index) => (
            <VenueListItem venue={venue} key={index} />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export const VenueDetail = () => {
  useAssertRole(UserRole.AUTH_USER);
  const axios = useAxiosWithAuth();
  const { id } = useParams();
  const { data: venue } = useQuery({
    queryFn: () => axios.get<Venue>("/venue/" + id),
    queryKey: ["venue"],
  });

  return (
    <div>
      {venue ? (
        <>
          <Header className="font-bold uppercase">{venue?.data.name}</Header>
          <div className="m-auto w-4/5 bg-white p-6">
            {/* @ts-ignore href -1 is typed as string */}
            <PrimaryButton className="mb-8" href={-1}>
              Zpět
            </PrimaryButton>
            {venue.data.image && (
              <img
                src={venue.data.image}
                alt={venue.data.image}
                className="max-h-96 w-full object-cover"
              />
            )}
            <p className="my-4 w-4/5 pl-4">{venue.data.description}</p>
            <ul className="list-disc pl-8 font-bold">
              <li className="mb-4">{venue.data.street}</li>
              <li>
                {venue.data.city}, {venue.data.postal_code}
              </li>
            </ul>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
