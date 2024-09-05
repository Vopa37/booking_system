import { CategoriesData } from "../../types/createEvent";
import { cn } from "../../utils";
import { CategoryCheckBox } from "./CategoryCheckBox";

interface Props {
  categories: CategoriesData[];
  checkedCategories: number[];
  borderless?: boolean;
  onCheckedChange(id: number): (checked: boolean) => void;
}

export const CategoryList = ({
  categories,
  checkedCategories,
  borderless,
  onCheckedChange,
}: Props) => {
  return (
    <div
      className={cn(
        "w-full items-center justify-between rounded-md px-3 py-2 text-sm",
        !borderless && "border border-input bg-white",
      )}
    >
      {categories
        .filter(
          (category) =>
            !category.parent_category_id ||
            !categories.find((c) => c.id === category.parent_category_id),
        )
        .map((item) => (
          <CategoryCheckBox
            category={item}
            onCheckedChange={onCheckedChange}
            checkedCategories={checkedCategories}
            categories={categories}
            key={item.id}
          />
        ))}
    </div>
  );
};
