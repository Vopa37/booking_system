import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAxiosWithAuth } from "../../utils";
import { successToast } from "../../utils/toast";
import SubmitButton from "../atoms/SubmitButton";
import { Header } from "../ui/header";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface ReviewFormValues {
  starsCount: number;
  textReview: string;
}

interface Props {
  eventId: number;
}

export const ReviewForm = ({ eventId }: Props) => {
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<ReviewFormValues>();

  const axios = useAxiosWithAuth();

  const queryClient = useQueryClient();

  const onSuccess = useCallback(() => {
    reset();
    successToast("Hodnocení přidáno");
    queryClient.invalidateQueries([`reviews/${eventId}`]);
  }, [eventId, queryClient, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: (formData: ReviewFormValues) =>
      axios.post(`/event/${eventId}/review`, {
        rating: formData.starsCount,
        text_review: formData.textReview,
      }),
    onSuccess,
  });

  const onSubmit = useCallback(
    (formData: ReviewFormValues) => {
      mutateAsync(formData);
    },
    [mutateAsync],
  );

  const onStarsChange = useCallback(
    (value: string) => {
      setValue("starsCount", Number.parseInt(value));
    },
    [setValue],
  );

  return (
    <div className="ml-4 w-[50%]">
      <Header className="font-bold uppercase">Přidat hodnocení</Header>
      <div className="m-auto mt-4 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label>Hodnocení</Label>
          <Select
            {...register("starsCount", { required: true })}
            onValueChange={onStarsChange}
            value={String(watch("starsCount"))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Zvolte hodnocení" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
          <Label>Komentář</Label>
          <Textarea {...register("textReview")}></Textarea>
          <SubmitButton>Přidat</SubmitButton>
        </form>
      </div>
    </div>
  );
};
