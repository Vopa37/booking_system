import { LoginForm } from "../login-form";
import { Header } from "../ui/header";

export const Login = () => {
  return (
    <div className="flex flex-col justify-center align-middle">
      <Header>PŘIHLÁŠENÍ</Header>
      <LoginForm />
    </div>
  );
};
