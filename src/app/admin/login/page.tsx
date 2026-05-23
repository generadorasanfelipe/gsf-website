import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — Admin GSF",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-navy-900">Panel interno</h1>
      <p className="mt-2 text-sm text-navy-600">
        Acceso restringido al equipo de cumplimiento. Introduce tu correo
        institucional y te enviaremos un enlace de acceso de un solo uso.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
