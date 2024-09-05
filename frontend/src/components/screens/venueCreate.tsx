import { useMutation, useQueryClient } from "@tanstack/react-query";
import VenueForm from "components/forms/venueForm";
import { Header } from "components/ui/header";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosWithAuth } from "utils";
import { UserRole } from "utils/prisma";
import { CreateVenueType } from "utils/types";
import { useAssertRole } from "utils/useAssertRole";
import { errorToast, successToast } from "../../utils/toast";

export const CreateVenue = () => {
  useAssertRole(UserRole.AUTH_USER);
  const axios = useAxiosWithAuth();

  const { mutateAsync } = useMutation((data: FormData) =>
    axios.post("/venue", data),
  );

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

      try {
        const response = await mutateAsync(formData);
        await queryClient.invalidateQueries({ queryKey: ["venues"] });
        if (response.status === 201) {
          navigate("/venues");
          successToast("Místo úspěšně vytvořeno");
        }
      } catch (e) {
        errorToast("Chyba při vytváření místa");
      }
    },
    [mutateAsync, navigate, queryClient],
  );

  return (
    <div>
      <Header>Nové místo</Header>
      <VenueForm onSubmit={onSumbit} />
    </div>
  );
};
