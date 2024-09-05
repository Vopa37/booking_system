import { CategoriesData } from "../types/createEvent";

const getChildren = (
  categories: CategoriesData[],
  categoryId: number,
): CategoriesData[] => {
  const children = categories.filter(
    (c) => c.parent_category_id === categoryId,
  );

  const grandChildren = [];

  for (const child of children) {
    grandChildren.push(...getChildren(categories, child.id));
  }

  return [...children, ...grandChildren];
};

const getParentPath = (
  categories: CategoriesData[],
  categoryId: number,
): number[] => {
  let parentPath = [];
  let currentParent = categories.find((c) => c.id === categoryId)
    ?.parent_category_id;
  while (currentParent) {
    parentPath.push(currentParent);
    // eslint-disable-next-line no-loop-func
    currentParent = categories.find((c) => c.id === currentParent)
      ?.parent_category_id;
  }

  return parentPath;
};

export const getCategorySelectionLogic =
  (
    getValues: () => number[],
    setValue: (categories: number[]) => void,
    logic: "CREATE" | "FILTER",
    categories?: CategoriesData[],
  ) =>
  (categoryId: number) =>
  (checked: boolean) => {
    if (categories) {
      const currentCategories = getValues() || [];
      if (logic === "CREATE") {
        if (checked) {
          const parentPath = getParentPath(categories, categoryId);

          const conjoinedCategories = [
            ...currentCategories,
            categoryId,
            ...parentPath,
          ];
          setValue(Array.from(new Set(conjoinedCategories)));
        } else {
          const children = getChildren(categories, categoryId).map((c) => c.id);
          const filteredCategories = currentCategories.filter(
            (c) => c !== categoryId && !children.includes(c),
          );
          setValue(Array.from(new Set(filteredCategories)));
        }
      } else {
        if (checked) {
          const children = getChildren(categories, categoryId).map((c) => c.id);

          setValue(
            Array.from(
              new Set([...currentCategories, categoryId, ...children]),
            ),
          );
        } else {
          const parentPath = getParentPath(categories, categoryId);

          const filteredCategories = currentCategories.filter(
            (c) => c !== categoryId && !parentPath.includes(c),
          );

          setValue(Array.from(new Set(filteredCategories)));
        }
      }
    }
  };
