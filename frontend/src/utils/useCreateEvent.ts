import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CategoriesData, FormValues, VenuesData } from "../types/createEvent";
import { authAtom } from "./auth";
import { useAxiosWithAuth } from "./axios";
import { getCategorySelectionLogic } from "./categorySelectionLogic";
import { errorToast, successToast } from "./toast";

export const useCreateEvent = (data: any, id?: number) => {
  let defaultValues = data
    ? { admissions: data?.admission || [], ...data }
    : { event_start: new Date(), event_end: new Date() };
  const {
    setValue,
    watch,
    handleSubmit,
    register,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "admissions",
  });

  const onDateChange = useCallback(
    (fieldName: any, value: Date | undefined) => {
      // Nastavení hodnoty pomocí setValue
      setValue(fieldName, value);

      clearErrors("event_start");
      clearErrors("event_end");

      // Získání hodnot event_start a event_end
      const eventStart = watch("event_start");
      const eventEnd = watch("event_end");

      // Funkce pro kontrolu, zda datum je validní
      const isDateValid = (start: Date, end: Date) => {
        return start <= end;
      };

      // Funkce pro nastavení chyby pro dané pole
      const setErrorForField = (field: any, errorMessage: string) => {
        setError(field, {
          type: "manual",
          message: errorMessage,
        });
      };

      // Kontrola, zda event_start není po event_end
      if (
        fieldName === "event_start" &&
        eventEnd &&
        !isDateValid(value as Date, eventEnd as Date)
      ) {
        setErrorForField(
          "event_start",
          "Začátek události nemůže být po jejím konci.",
        );
      }

      // Kontrola, zda event_end není před event_start
      if (
        fieldName === "event_end" &&
        eventStart &&
        !isDateValid(eventStart as Date, value as Date)
      ) {
        setErrorForField(
          "event_end",
          "Konec události nemůže být před jejím začátkem.",
        );
      }
    },
    [setValue, clearErrors, watch, setError],
  );

  const axios = useAxiosWithAuth();
  const { data: venues } = useQuery({
    queryFn: () => axios.get<VenuesData[]>("/venue/approved"),
    queryKey: ["venues"],
  });
  const { data: categories } = useQuery({
    queryFn: () =>
      axios.post<CategoriesData[]>("/category/confirmed", { confirmed: true }),
    queryKey: ["categories"],
  });

  const { mutateAsync: createAsync } = useMutation((data: any) =>
    axios.post("/event", data),
  );

  const { mutateAsync: editAsync } = useMutation((data: any) =>
    axios.patch("/event/" + id, data),
  );

  const [auth] = useAtom(authAtom);
  const navigate = useNavigate();
  const onSumbit = useCallback(
    async (data: FormValues, isEdit: boolean) => {
      const formData = new FormData();

      if (typeof data.event_start === "string") {
        formData.append(
          "event_start",
          new Date(data.event_start).toISOString(),
        );
      } else {
        formData.append("event_start", data.event_start?.toISOString() || "");
      }

      if (typeof data.event_end === "string") {
        formData.append("event_end", new Date(data.event_end).toISOString());
      } else {
        formData.append("event_end", data.event_end?.toISOString() || "");
      }

      formData.append("name", data.name);
      formData.append("venue_id", data.venue_id);
      formData.append("capacity", String(data.capacity));
      formData.append("created_by_id", String(auth?.id));
      data.admissions.forEach((admission, index) => {
        formData.append(`admissions[${index}][price]`, String(admission.price));
        formData.append(`admissions[${index}][currency]`, admission.currency);
        formData.append(`admissions[${index}][type]`, admission.type);
      });
      data.categories?.forEach((categoryId, index) => {
        formData.append(`categories[${index}]`, String(categoryId));
      });

      if (
        data.image !== null &&
        data.image !== undefined &&
        typeof data.image === "object"
      ) {
        formData.append("image", data.image, data.image.name);
      }
      if (isEdit) {
        try {
          const response = await editAsync(formData);
          if (response.status === 200) {
            navigate("/");
            successToast("Událost úspěšně upravena");
          }
        } catch (e) {
          errorToast("Chyba při upravování události");
        }
      } else {
        try {
          const response = await createAsync(formData);
          if (response.status === 201) {
            navigate("/");
            successToast("Událost úspěšně vytvořena");
          }
        } catch (e) {
          errorToast("Chyba při vytváření události");
        }
      }
    },
    [createAsync, editAsync, navigate, auth?.id],
  );

  const wrappedGetCategoriesValues = useCallback(
    () => getValues("categories"),
    [getValues],
  );
  const wrappedSetCategoriesValue = useCallback(
    (categories: number[]) => setValue("categories", categories),
    [setValue],
  );

  const onCategoryCheckedChange = useMemo(
    () =>
      getCategorySelectionLogic(
        wrappedGetCategoriesValues,
        wrappedSetCategoriesValue,
        "CREATE",
        categories?.data,
      ),
    [categories?.data, wrappedGetCategoriesValues, wrappedSetCategoriesValue],
  );

  return {
    handleSubmit,
    onSumbit,
    register,
    onDateChange,
    watch,
    setValue,
    venues,
    categories,
    onCategoryCheckedChange,
    fields,
    remove,
    append,
    errors,
  };
};
