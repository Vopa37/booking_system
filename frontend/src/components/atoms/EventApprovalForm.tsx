import { useMutation } from "@tanstack/react-query";
import { MouseEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { VenuesData } from "../../types/createEvent";
import { useAxiosWithAuth } from "../../utils";
import { successToast } from "../../utils/toast";
import { ApproveButton } from "./ApproveButton";

interface Props {
  event: VenuesData;
  refetchEvents(): void;
}

export const EventApprovalForm = ({ refetchEvents, event }: Props) => {
  const axios = useAxiosWithAuth();

  const onApproveSuccess = useCallback(() => {
    successToast("Událost úspěšně potvrzena");
    refetchEvents();
  }, [refetchEvents]);

  const onDisapproveSuccess = useCallback(() => {
    successToast("Událost úspěšně zamítnuta");
    refetchEvents();
  }, [refetchEvents]);

  const { mutateAsync: onApprove } = useMutation(
    () => axios.patch(`/event/${event.id}/confirm`),
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
    () => axios.delete(`/event/${event.id}`),
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
    navigate(`/event/${event.id}`);
  }, [event.id, navigate]);

  return (
    <div
      onClick={navigateToDetail}
      className="mb-2 flex cursor-pointer justify-between border-b-[1px] pb-2"
    >
      <div className="my-auto">{event.name}</div>
      <div className="flex gap-2">
        <ApproveButton onClick={approveHandler} />
        <ApproveButton destructive onClick={disapproveHandler} />
      </div>
    </div>
  );
};
