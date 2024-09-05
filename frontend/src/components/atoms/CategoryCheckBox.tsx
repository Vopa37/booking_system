import { useMemo } from "react";
import { CategoryCheckboxProps } from "../../types/createEvent";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export const CategoryCheckBox = ({
  category,
  onCheckedChange,
  checkedCategories,
  categories,
}: CategoryCheckboxProps) => {
  const children = useMemo(
    () => categories.filter((c) => c.parent_category_id === category.id),
    [categories, category],
  );

  return (
    <div key={category.id}>
      <div className="mb-4 flex">
        <Checkbox
          checked={checkedCategories.includes(category.id)}
          onCheckedChange={onCheckedChange(category.id)}
        />
        <Label className="ml-2 font-normal">{category.name}</Label>
      </div>
      <div className="pl-2">
        {children.map((child) => (
          <CategoryCheckBox
            category={child}
            checkedCategories={checkedCategories}
            categories={categories}
            onCheckedChange={onCheckedChange}
            key={child.id}
          />
        ))}
      </div>
    </div>
  );
};
