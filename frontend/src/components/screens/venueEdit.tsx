import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import VenueForm from "components/forms/venueForm";
import { Header } from "components/ui/header";
import { Loader } from "components/ui/loader";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosWithAuth } from "utils";
import { UserRole, Venue } from "utils/prisma";
import { successToast } from "utils/toast";
import { CreateVenueType } from "utils/types";
import { useAssertRole } from "utils/useAssertRole";

export const EditVenue = () => {
  useAssertRole(UserRole.AUTH_USER);
  const axios = useAxiosWithAuth();

  const { mutateAsync } = useMutation((data: FormData) =>
    axios.patch(`/venue/${id}`, data),
  );

  const { id } = useParams();

  const { data: venue } = useQuery({
    queryFn: () => axios.get<Venue>(`/venue/${id}`),
    queryKey: [`venueEdit/${id}`],
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const onSumbit = useCallback(
    async (data: CreateVenueType, image: File) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("street", data.street);
      formData.append("postal_code", data.postal_code);
      formData.append("country", data.country);
      formData.append("description", data.description);

      if (image) {
        formData.append("image", image);
      }

      const response = await mutateAsync(formData);
      if (response.status === 401) {
        navigate("/login");
      }
      queryClient.invalidateQueries({ queryKey: [`venueEdit/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`venues`] });

      successToast("Místo úspěšně upraveno");

      navigate("/venues");
    },
    [mutateAsync, navigate, queryClient, id],
  );

  return (
    <div>
      <Header>Úprava místa</Header>
      {venue?.data ? (
        <VenueForm onSubmit={onSumbit} data={venue.data} />
      ) : (
        <Loader />
      )}
    </div>
  );
};
