import { useQuery } from "@tanstack/react-query";
import { LucideStar } from "lucide-react";
import { useAxiosWithAuth } from "../../utils";
import { Header } from "../ui/header";
import { Loader } from "../ui/loader";

interface Props {
  eventId: number;
}

interface ReviewsReponse {
  rating: number;
  text_review: string;
  user: {
    username: string;
  };
}

export const ReviewList = ({ eventId }: Props) => {
  const axios = useAxiosWithAuth();

  const { data } = useQuery({
    queryKey: [`reviews/${eventId}`],
    queryFn: () => axios.get<ReviewsReponse[]>(`/event/${eventId}/reviews`),
  });

  return (
    <div>
      <Header className="font-bold uppercase">Hodnocení</Header>
      <div className="m-auto mt-4 w-4/5 bg-white p-6">
        {data?.data ? (
          data.data.map((review) => (
            <div className="rounded border border-background px-4 py-2">
              <div className="flex">
                <span className="mr-4 font-bold">{review.user.username}</span>
                <div className="flex items-center">
                  {Array.from(
                    { length: review.rating },
                    (_, index) => index,
                  ).map((i) => (
                    <div key={i} className="mr-1">
                      <LucideStar height={20} />
                    </div>
                  ))}
                </div>
              </div>
              <div>{review.text_review}</div>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
