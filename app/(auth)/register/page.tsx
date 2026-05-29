import { AuthScreen } from "@/modules/auth";
import { loginAction } from "../login/actions";
import { registerAction } from "./actions";

export const metadata = { title: "Crear cuenta — Atomic Goals" };

export default function RegisterPage() {
  return (
    <AuthScreen
      mode="register"
      loginAction={loginAction}
      registerAction={registerAction}
    />
  );
}
