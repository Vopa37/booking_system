import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Category } from "utils/prisma";
import { useAxiosWithAuth } from "../../utils";
import { successToast } from "../../utils/toast";
import { ApproveButton } from "./ApproveButton";

interface Props {
  category: Category;
  categories: Category[];
  refetchCategories(): void;
}

export const CategoryApprovalForm = ({
  category,
  categories,
  refetchCategories,
}: Props) => {
  const children = useMemo(
    () => categories.filter((c) => c.parent_category_id === category.id),
    [categories, category.id],
  );

  const axios = useAxiosWithAuth();

  const onApproveSuccess = useCallback(() => {
    successToast("Kategorie úspěšně potvrzena");
    refetchCategories();
  }, [refetchCategories]);

  const onDisapproveSuccess = useCallback(() => {
    successToast("Kategorie úspěšně zamítnuta");
    refetchCategories();
  }, [refetchCategories]);

  const { mutateAsync: onApprove } = useMutation(
    () => axios.patch(`/category/approve/${category.id}`),
    { onSuccess: onApproveSuccess },
  );
  const approveHandler = useCallback(() => {
    onApprove();
  }, [onApprove]);

  const { mutateAsync: onDisapprove } = useMutation(
    () => axios.delete(`/category/${category.id}`),
    { onSuccess: onDisapproveSuccess },
  );
  const disapproveHandler = useCallback(() => {
    onDisapprove();
  }, [onDisapprove]);

  return (
    <div>
      <div className="mb-2 flex justify-between border-b-[1px] pb-2">
        <div className="my-auto">{category.name}</div>
        <div className="flex gap-2">
          <ApproveButton onClick={approveHandler} />
          <ApproveButton destructive onClick={disapproveHandler} />
        </div>
      </div>
      <div className="pl-4">
        {children.map((child) => (
          <CategoryApprovalForm
            category={child}
            categories={categories}
            refetchCategories={refetchCategories}
            key={child.id}
          />
        ))}
      </div>
    </div>
  );
};
