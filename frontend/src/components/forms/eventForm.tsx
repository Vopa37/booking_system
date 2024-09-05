import { CategoryList } from "components/atoms/CategoryList";
import SubmitButton from "components/atoms/SubmitButton";
import { Button } from "components/ui/button";
import { DateInput } from "components/ui/date-input";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Admission } from "types/createEvent";
import { useCreateEvent } from "utils/useCreateEvent";
import { Loader } from "../ui/loader";

const CurrencyEnum = {
  CZK: "CZK",
  USD: "USD",
  EUR: "EUR",
  PLN: "PLN",
  GBP: "GBP",
  JPY: "JPY",
  AUD: "AUD",
};

const EventForm = ({ isEdit, data }: { isEdit: boolean; data: any }) => {
  const {
    handleSubmit,
    onSumbit,
    register,
    watch,
    onDateChange,
    venues,
    setValue,
    onCategoryCheckedChange,
    categories,
    fields,
    remove,
    append,
    errors,
  } = useCreateEvent(data, data?.id);

  return (
    <form
      className="m-auto w-1/2 bg-white p-6"
      onSubmit={handleSubmit((data) => {
        onSumbit(data, isEdit);
      })}
    >
      <div>
        <Label htmlFor="name">Název</Label>
        <Input id="name" {...register("name", { required: true })} />
        <Label htmlFor="event_start">Začátek</Label>
        <DateInput
          onChange={(value) => onDateChange("event_start", value)}
          value={watch("event_start")}
        />
        {errors.event_start && errors.event_start.type === "manual" && (
          <p className="text-red-500">{errors.event_start.message}</p>
        )}
        <Label htmlFor="event_end">Konec</Label>
        <DateInput
          onChange={(value) => onDateChange("event_end", value)}
          value={watch("event_end")}
        />
        {errors.event_end && errors.event_end.type === "manual" && (
          <p className="text-red-500">{errors.event_end.message}</p>
        )}
        <Label htmlFor="capacity">Kapacita</Label>
        <Input id="capacity" {...register("capacity")} />
        <Label htmlFor="venue_id">Místo</Label>
        <Select
          onValueChange={(value) => {
            setValue("venue_id", value);
          }}
          value={String(watch("venue_id"))}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Vyberte místo" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {venues?.data.map((venue) => (
              <SelectItem key={venue.id} value={String(venue.id)}>
                {venue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label htmlFor="categories">Kategorie</Label>
        {categories?.data ? (
          <CategoryList
            categories={categories.data}
            checkedCategories={watch("categories") ?? []}
            onCheckedChange={onCategoryCheckedChange}
          />
        ) : (
          <Loader />
        )}
        <Label htmlFor="image">Obrázek</Label>
        <Input
          type="file"
          id="image"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setValue("image", file);
          }}
        />
        {fields.length !== 0 && (
          <>
            <Label htmlFor="admissions">Vstupné</Label>
            <div className="w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ">
              {fields.map((admission, index) => (
                <>
                  <div className="mb-4 flex justify-between" key={index}>
                    <Label htmlFor="admissions">Vstupné {index + 1}</Label>
                    <Button
                      type="button"
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => remove(index)}
                    >
                      Odstranit vstupné
                    </Button>
                  </div>
                  <div
                    className="mb-8 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm "
                    key={admission.id || index}
                  >
                    <Label htmlFor={`admissions[${index}].price`}>Cena</Label>
                    <Input
                      {...register(`admissions.${index}.price` as const)}
                      defaultValue={admission.price}
                    />

                    <Label htmlFor={`admissions[${index}].currency`}>
                      Měna
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        setValue(`admissions.${index}.currency`, value);
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Vyberte měnu" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CurrencyEnum).map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Label htmlFor={`admissions[${index}].type`}>Typ</Label>
                    <Input
                      {...register(`admissions.${index}.type` as const)}
                      defaultValue={admission.type}
                    />
                  </div>
                </>
              ))}

              <Button
                type="button"
                className="text-white"
                onClick={() =>
                  append({ price: 0, currency: "", type: "" } as Admission)
                }
              >
                Přidat další vstupné
              </Button>
            </div>
          </>
        )}
        {fields.length === 0 && (
          <Button
            type="button"
            className="mb-4 mt-4 text-white"
            onClick={() =>
              append({ price: 0, currency: "", type: "" } as Admission)
            }
          >
            Přidat vstupné
          </Button>
        )}
      </div>
      <SubmitButton>{data ? "Upravit událost" : "Přidat událost"}</SubmitButton>
    </form>
  );
};

export default EventForm;
