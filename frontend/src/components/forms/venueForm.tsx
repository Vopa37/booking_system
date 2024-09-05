import SubmitButton from "components/atoms/SubmitButton";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateVenueType } from "utils/types";

const VenueForm = ({ data, onSubmit }: { data?: any; onSubmit: any }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateVenueType>({ defaultValues: data });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <form
      className="m-auto w-1/2 bg-white p-6"
      onSubmit={handleSubmit((formData) => {
        onSubmit(formData, selectedImage);
      })}
    >
      <Label htmlFor="name">Název</Label>
      <Input id="name" {...register("name", { required: true })} />
      {errors.name && errors.name.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="city">Město</Label>
      <Input id="city" {...register("city", { required: true })} />
      {errors.city && errors.city.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="street">Ulice</Label>
      <Input id="street" {...register("street", { required: true })} />
      {errors.street && errors.street.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="postal_code">PSČ</Label>
      <Input
        id="postal_code"
        {...register("postal_code", { required: true })}
      />
      {errors.postal_code && errors.postal_code.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="country">Země</Label>
      <Input id="country" {...register("country", { required: true })} />
      {errors.country && errors.country.type === "required" && (
        <p className="text-red-500">Toto pole je povinné</p>
      )}
      <Label htmlFor="description">Popis</Label>
      <Textarea
        id="description"
        {...register("description")}
        className="bg-white"
      />
      <Label htmlFor="image">Obrázek</Label>
      <Input
        id="image"
        type="file"
        {...register("image")}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setSelectedImage(file);
        }}
      />
      {data ? (
        <SubmitButton>Upravit místo</SubmitButton>
      ) : (
        <SubmitButton>Přidat místo</SubmitButton>
      )}
    </form>
  );
};

export default VenueForm;
