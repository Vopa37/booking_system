import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useState } from "react";
import { useAxiosWithAuth } from "utils";
import { Category, UserRole } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import { successToast } from "../../utils/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Header } from "../ui/header";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";

interface CreateCategoryDto {
  name: string;
  parent_category_id?: number;
}

type GetChildCategories = (id: number) => () => void;

interface NewCategoryProps {
  refetchCategories(): void;
  parentId?: number;
  isLoading: boolean;
}

const NewCategory = ({
  refetchCategories,
  parentId,
  isLoading,
}: NewCategoryProps) => {
  const [name, setName] = useState("");

  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const axios = useAxiosWithAuth();

  const { mutateAsync } = useMutation<unknown, unknown, CreateCategoryDto>(
    (data) => axios.post("/category", data),
  );

  const addNewCategory = useCallback(async () => {
    if (!name) return;
    await mutateAsync({ name, parent_category_id: parentId });
    await refetchCategories();
    setName("");
    successToast("Kategorie úspěšně vytvořena");
  }, [mutateAsync, name, parentId, refetchCategories]);

  return (
    <div className="flex gap-2">
      <Input value={name} onChange={onNameChange} />
      <Button
        className="text-white"
        onClick={addNewCategory}
        disabled={isLoading}
      >
        {isLoading ? <Loader color="white" height={20} width={20} /> : "Přidat"}
      </Button>
    </div>
  );
};

const renderCategory =
  (
    childrenList: Record<number, Category[]>,
    getChildCategories: GetChildCategories,
    isLoading: boolean,
  ) =>
  (category: Category) => (
    <Accordion
      type="multiple"
      className="w-full pl-2"
      onClick={getChildCategories(category.id)}
      key={category.id}
    >
      <AccordionItem value={String(category.id)}>
        <AccordionTrigger className="w-full">{category.name}</AccordionTrigger>
        <AccordionContent>
          <NewCategory
            refetchCategories={getChildCategories(category.id)}
            parentId={category.id}
            isLoading={isLoading}
          />
          {childrenList[category.id]?.map(
            renderCategory(childrenList, getChildCategories, isLoading),
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

export const Categories = () => {
  useAssertRole(UserRole.AUTH_USER);
  const [childCategories, setChildCategories] = useState<
    Record<number, Category[]>
  >({});

  const axios = useAxiosWithAuth();

  const {
    data: roots,
    refetch: refetchCategories,
    isRefetching,
  } = useQuery({
    queryFn: () => axios.get<Category[]>("/category/roots"),
    queryKey: ["categoryRoots"],
  });

  const getChildCategories = useCallback(
    (id: number) => async () => {
      const { data: children } = await axios.get<Category[]>(
        `/category/descendants/${id}`,
      );

      setChildCategories((old) => ({ ...old, [id]: children }));
    },
    [axios],
  );

  return (
    <div>
      <Header>Nová kategorie</Header>
      <div className="m-auto w-1/2 bg-white p-6">
        <NewCategory
          refetchCategories={refetchCategories}
          isLoading={isRefetching}
        />
        {roots?.data ? (
          roots.data?.map(
            renderCategory(childCategories, getChildCategories, isRefetching),
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
