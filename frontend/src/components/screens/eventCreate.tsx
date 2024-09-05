import { Header } from "components/ui/header";
import { UserRole } from "utils/prisma";
import { useAssertRole } from "utils/useAssertRole";
import EventForm from "../forms/eventForm";

export const CreateEvent = () => {
  useAssertRole(UserRole.AUTH_USER);

  return (
    <>
      <Header>Nová událost</Header>

      <EventForm isEdit={false} data={undefined} />
    </>
  );
};
