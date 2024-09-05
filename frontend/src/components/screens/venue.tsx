import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { cn, useAxiosWithAuth } from "utils";
import AuthResolver from "utils/AuthResolver";
import { UserRole, Venue } from "utils/prisma";
import { successToast } from "utils/toast";
import { useAssertRole } from "utils/useAssertRole";
import { DeleteButton } from "../atoms/DeleteButton";
import { EditButton } from "../atoms/EditButton";

export const VenueListItem = ({ venue }: { venue: Venue }) => {
  useAssertRole(UserRole.AUTH_USER);
  const navigate = useNavigate();
  const axios = useAxiosWithAuth();
  const queryClient = useQueryClient();

  return (
    <div
      className={cn(
        "clear-both my-4 flex justify-between rounded p-4 hover:cursor-pointer",
        venue.is_confirmed ? "bg-white" : "bg-[gray]",
      )}
      onClick={() => {
        navigate("/venues/" + venue.id);
      }}
    >
      <p className="flex flex-col justify-center ">{venue.name}</p>
      <div className="flex gap-4">
        <AuthResolver
          roles={[UserRole.ADMIN, UserRole.MODERATOR]}
          createdById={venue.created_by_id}
        >
          <EditButton
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/venues/${venue.id}/edit`);
            }}
            className="self-end"
          >
            Upravit
          </EditButton>
        </AuthResolver>
        <AuthResolver
          roles={[UserRole.ADMIN, UserRole.MODERATOR]}
          createdById={venue.created_by_id}
        >
          <DeleteButton
            onClick={async (e) => {
              e.stopPropagation();
              await axios.delete(`/venue/${venue.id}`);
              queryClient.invalidateQueries({ queryKey: [`venues`] });
              //todo on success
              successToast("Místo úspěšně smazáno");
            }}
            className="bg-red-500"
          >
            Smazat
          </DeleteButton>
        </AuthResolver>
      </div>
    </div>
  );
};
