import { useQuery } from "@tanstack/react-query";
import { Category, UserRole } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import { useAxiosWithAuth } from "../../utils";
import { CategoryApprovalForm } from "../atoms/CategoryApprovalForm";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";

export const CategoryApproval = () => {
  useAssertRole(UserRole.MODERATOR);
  const axios = useAxiosWithAuth();

  const { data, refetch } = useQuery([""], {
    queryFn: () =>
      axios.post<Category[]>("/category/confirmed", { confirmed: false }),
    refetchOnReconnect: true,
  });

  return (
    <div>
      <Header>SCHVALOVÁNÍ KATEGORIÍ</Header>
      <div className="m-auto w-1/2 bg-white p-6">
        {data ? (
          data.data
            .filter(
              (category) =>
                !category.parent_category_id ||
                !data.data.find((c) => c.id === category.parent_category_id),
            )
            .map((category) => (
              <CategoryApprovalForm
                category={category}
                categories={data.data}
                refetchCategories={refetch}
                key={category.id}
              />
            ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
