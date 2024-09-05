import { useMutation } from "@tanstack/react-query";
import { MouseEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { VenuesData } from "../../types/createEvent";
import { useAxiosWithAuth } from "../../utils";
import { successToast } from "../../utils/toast";
import { ApproveButton } from "./ApproveButton";

interface Props {
  venue: VenuesData;
  refetchVenues(): void;
}

export const VenueApprovalForm = ({ venue, refetchVenues }: Props) => {
  const axios = useAxiosWithAuth();

  const onApproveSuccess = useCallback(() => {
    successToast("Místo úspěšně potvrzeno");
    refetchVenues();
  }, [refetchVenues]);

  const onDisapproveSuccess = useCallback(() => {
    successToast("Místo úspěšně zamítnuto");
    refetchVenues();
  }, [refetchVenues]);

  const { mutateAsync: onApprove } = useMutation(
    () => axios.patch(`/venue/${venue.id}/confirm`),
    { onSuccess: onApproveSuccess },
  );
  const approveHandler = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onApprove();
    },
    [onApprove],
  );

  const { mutateAsync: onDisapprove } = useMutation(
    () => axios.delete(`/venue/${venue.id}`),
    { onSuccess: onDisapproveSuccess },
  );
  const disapproveHandler = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onDisapprove();
    },
    [onDisapprove],
  );

  const navigate = useNavigate();
  const navigateToDetail = useCallback(() => {
    navigate(`/venues/${venue.id}`);
  }, [navigate, venue.id]);

  return (
    <div
      onClick={navigateToDetail}
      className="mb-2 flex cursor-pointer justify-between border-b-[1px] pb-2"
    >
      <div className="my-auto">{venue.name}</div>
      <div className="flex gap-2">
        <ApproveButton onClick={approveHandler} />
        <ApproveButton destructive onClick={disapproveHandler} />
      </div>
    </div>
  );
};
