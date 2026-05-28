import { AuthScreen } from "@/modules/auth";
import { loginAction } from "./actions";
import { registerAction } from "../register/actions";

export const metadata = { title: "Entrar — Atomic Goals" };

export default function LoginPage() {
  return (
    <AuthScreen
      mode="login"
      loginAction={loginAction}
      registerAction={registerAction}
    />
  );
}
