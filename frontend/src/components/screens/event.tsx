import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteButton } from "components/atoms/DeleteButton";
import { EditButton } from "components/atoms/EditButton";
import { Button } from "components/ui/button";
import { Header } from "components/ui/header";
import { Loader } from "components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { LucideCheck } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authAtom } from "utils/auth";
import AuthResolver from "utils/AuthResolver";
import { useAxiosWithAuth } from "utils/axios";
import formatDate from "utils/dateFormatter";
import { UserRole } from "utils/prisma";
import { errorToast, infoToast, successToast } from "utils/toast";
import { ReviewList } from "../atoms/ReviewList";
import { ReviewForm } from "../forms/reviewForm";

interface FormValues {
  admission: string;
}

interface Admission {
  id: number;
  price: number;
  currency: string;
  type: string;
}
interface Event {
  id: number;
  name: string;
  event_start: string;
  event_end: string;
  image: string;
  capacity: number;
  venue_id: number;
  admission: Admission[];
  created_by_id: number;
  occupancy: number;
  is_registered: boolean;
  is_paid: Boolean;
}
interface Venue {
  name: string;
  venue_id: number;
}
interface User {
  user: {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    birthday: Date;
  };
  admission: Admission;
  is_paid: Boolean;
}

export const Event = () => {
  const { id } = useParams();
  const axios = useAxiosWithAuth();
  const [auth] = useAtom(authAtom);
  const { register, handleSubmit } = useForm<FormValues>();
  const [showAdmissions, setShowAdmissions] = useState<number>(0);
  const [selectedAdmission, setSelectedAdmission] = useState<number | null>(
    null,
  );
  const [showUsers, setShowUsers] = useState<Boolean>(false);
  const { data: event, refetch } = useQuery({
    queryFn: () => axios.get<Event>("/event/" + id),
    queryKey: ["event", id],
  });

  const { data: users, refetch: refetchUsers } = useQuery({
    queryFn: () => axios.get<User[]>("/event/" + id + "/users"),
    queryKey: ["users"],
  });

  const { data: venue } = useQuery({
    enabled: event?.data.venue_id !== undefined,
    queryFn: () => axios.get<Venue>("/venue/" + event?.data.venue_id),
    queryKey: ["venue", event?.data.venue_id],
  });

  const queryClient = useQueryClient();

  const handleAdmission = async (data: FormValues) => {
    if (!auth) {
      navigate("/login");
      infoToast("Pro nákup vstupného se přihlašte");
    } else {
      try {
        await axios.post(`event/${id}/register`, data);
        successToast("Vstupné úspěšně koupeno");
        setShowAdmissions(0);
        refetch();
        refetchUsers();
      } catch (error) {
        errorToast("Vstupné se nepodařilo koupit");
      }
    }
  };

  const handleRegister = async () => {
    if (!auth) {
      navigate("/login");
      infoToast("Pro registraci na událost se přihlašte");
    } else {
      try {
        await axios.post(`event/${id}/register`, { admission: null });
        successToast("Registrace na událost byla úspěšná");
        refetch();
        refetchUsers();
      } catch (error) {
        errorToast("Registrace se nepovedla");
      }
    }
    queryClient.invalidateQueries({
      queryKey: [`event`],
    });
    queryClient.invalidateQueries({
      queryKey: [`users`],
    });
  };

  const handleUnregister = async () => {
    try {
      await axios.delete(`event/${id}/unregister`);
      successToast("Odregistrace události bylo úspěšné");
      refetchUsers();
    } catch (error) {
      errorToast("Odregistrace se nepovedla");
    }
    queryClient.invalidateQueries({
      queryKey: [`event`],
    });
    queryClient.invalidateQueries({
      queryKey: [`users`],
    });
  };

  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const isPastEvent = useMemo(
    () => dayjs().isAfter(event?.data.event_end),
    [event?.data.event_end],
  );

  const handleUsers = useCallback(() => {
    setShowUsers(!showUsers);
    refetchUsers();
  }, [refetchUsers, showUsers]);

  const handlePaid = useCallback(
    async (user_id: number) => {
      try {
        await axios.put(`event/${id}/${user_id}/paid`);
        successToast("Úhrada vstupného úspěšně potvrzena");
        refetchUsers();
        refetch();
      } catch (error) {
        errorToast("Úhrada vstupného se nepodařilo potvrdit");
      }
    },
    [axios, id, refetch],
  );

  return (
    <div>
      {event ? (
        <div className="pb-8">
          <div className="m-auto flex w-4/5">
            <div className="w-full">
              <Header className="font-bold uppercase">
                {event?.data.name}
              </Header>
              <div className="bg-white p-6">
                <div className="flex justify-between">
                  <Button
                    className="mb-8 bg-primary text-white"
                    onClick={goBack}
                  >
                    Zpět
                  </Button>
                  <div className="flex gap-4">
                    <AuthResolver
                      roles={[UserRole.ADMIN, UserRole.MODERATOR]}
                      createdById={event.data.created_by_id}
                    >
                      <EditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/${event.data.id}/edit`);
                        }}
                        className="self-end"
                      >
                        Upravit
                      </EditButton>
                    </AuthResolver>
                    <AuthResolver
                      roles={[UserRole.ADMIN, UserRole.MODERATOR]}
                      createdById={event.data.created_by_id}
                    >
                      <DeleteButton
                        onClick={async (e) => {
                          e.stopPropagation();
                          await axios.delete(`/event/${event.data.id}`);
                          queryClient.invalidateQueries({
                            queryKey: [`event`],
                          });

                          successToast("Akce úspěšně smazána");
                          navigate(`/`);
                        }}
                        className="bg-red-500"
                      >
                        Smazat
                      </DeleteButton>
                    </AuthResolver>
                  </div>
                </div>

                {event.data.image && (
                  <div className="text-center">
                    <img
                      src={event.data.image}
                      className="inline-block max-h-96 object-cover"
                      alt="Obrázek události"
                    />
                  </div>
                )}
                <div className="mt-4 ">
                  <p className="mr-2 inline-block font-bold">Místo konání:</p>
                  <Link
                    to={"/venues/" + event.data.venue_id}
                    className="inline-block hover:underline"
                  >
                    {venue?.data.name}
                  </Link>
                  <div>
                    <p className="mr-2 inline-block font-bold">
                      Začátek události:
                    </p>
                    <p className="mr-2 inline-block">
                      {formatDate(event.data.event_start)}
                    </p>
                  </div>
                  <div>
                    <p className="mr-2 inline-block font-bold">
                      Konec události:{" "}
                    </p>
                    <p className="mr-2 inline-block ">
                      {formatDate(event.data.event_end)}
                    </p>
                  </div>
                  <div>
                    <p className="mr-2 inline-block font-bold">Kapacita: </p>
                    <p className="mr-2 inline-block ">
                      {event.data.capacity} lidí
                    </p>
                  </div>
                  <div
                    className={`${
                      event.data.capacity - event.data.occupancy <= 0
                        ? "text-red-500"
                        : "text-black"
                    }`}
                  >
                    <p className="mr-2 inline-block font-bold">Obsazenost: </p>
                    <p className="mr-2 inline-block ">
                      {event.data.occupancy} / {event.data.capacity}
                    </p>
                  </div>
                  {!dayjs().isAfter(event.data.event_end) &&
                    (event.data.admission.length !== 0 ? (
                      showAdmissions !== 0 ? (
                        <>
                          <p className="mr-2 font-bold">Vstupné: </p>
                          <form onSubmit={handleSubmit(handleAdmission)}>
                            {event.data.admission.map((item: Admission) => (
                              <div
                                key={item.id}
                                className="mt-2 border-b border-gray-300"
                              >
                                <div>
                                  <input
                                    type="radio"
                                    {...register("admission")}
                                    value={item.id}
                                    onChange={() =>
                                      setSelectedAdmission(item.id)
                                    }
                                    checked={selectedAdmission === item.id}
                                    className="accent-primary"
                                  />
                                  <p className="ml-2 inline-block font-bold">
                                    {item.type}
                                  </p>
                                </div>
                                <p className="ml-8 inline-block font-bold">
                                  Cena:{" "}
                                </p>
                                <p className="ml-2 inline-block ">
                                  {item.price}
                                </p>
                                <p className="inline-block ">{item.currency}</p>
                              </div>
                            ))}
                            <Button
                              type="submit"
                              className="mb-8 mt-8 bg-primary text-white"
                              disabled={selectedAdmission === null}
                            >
                              Koupit vstupné
                            </Button>
                          </form>
                        </>
                      ) : !event.data.is_registered ? (
                        <Button
                          onClick={() => setShowAdmissions(1)}
                          className="mt-4 bg-primary text-white"
                        >
                          Ukázat vstupné
                        </Button>
                      ) : (
                        <div className="mt-4">
                          <LucideCheck className="mr-1 inline-block h-[20px] w-[20px] bg-primary" />
                          <p className="inline-block">
                            Vstupné již máte vybráno
                          </p>
                          <div>
                            {event.data.is_registered && (
                              <Button
                                onClick={() => handleUnregister()}
                                className="mt-4 bg-primary text-white"
                              >
                                Odregistrovat se
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    ) : !event.data.is_registered ? (
                      event.data.capacity - event.data.occupancy > 0 && (
                        <Button
                          onClick={() => handleRegister()}
                          className="mt-4 bg-primary text-white"
                        >
                          Zaregistrovat se
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleUnregister()}
                        className="mt-4 bg-primary text-white"
                      >
                        Odregistrovat se
                      </Button>
                    ))}
                  {event.data.created_by_id === auth?.id && (
                    <div>
                      <Button
                        onClick={() => handleUsers()}
                        className="mt-4 bg-primary text-white"
                      >
                        Správa přihlášených uživatelů
                      </Button>
                    </div>
                  )}
                  {showUsers &&
                    (users?.data.length !== 0 ? (
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Uživatelské jméno</TableHead>
                            <TableHead>Jméno</TableHead>
                            <TableHead>Příjmení</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Typ vstupného</TableHead>
                            <TableHead>Stav platby</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users?.data.map((user, index) => (
                            <TableRow key={index}>
                              <TableCell>{user.user.username}</TableCell>
                              <TableCell>{user.user.firstname}</TableCell>
                              <TableCell>{user.user.lastname}</TableCell>
                              <TableCell>{user.user.email}</TableCell>
                              <TableCell>
                                {user.admission?.type ?? "Zdarma"}
                              </TableCell>
                              {user.is_paid ? (
                                <TableCell className="text-green-600">
                                  Zaplaceno
                                </TableCell>
                              ) : (
                                <TableCell className="text-red-600">
                                  Nezaplaceno
                                </TableCell>
                              )}

                              {!user.is_paid && (
                                <TableCell>
                                  <Button
                                    className="text-white"
                                    onClick={() => handlePaid(user.user.id)}
                                  >
                                    Potvrdit
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="mt-4">Na událost není nikdo přihlášen</p>
                    ))}
                </div>
              </div>
            </div>
            {event.data.is_registered && isPastEvent && (
              <ReviewForm eventId={event.data.id} />
            )}
          </div>
          {isPastEvent && <ReviewList eventId={event.data.id} />}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};
