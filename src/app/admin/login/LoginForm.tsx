"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export default function LoginForm() {
  const params = useSearchParams();
  const nextPath = params.get("next") ?? "/admin/complaints";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === "submitting" || status.kind === "sent") return;
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next: nextPath }),
      });
      // Intentionally return the same response shape whether the email is
      // allowlisted or not — server returns { ok: true } in both cases to
      // avoid leaking which emails are admins. Real failures (network,
      // 5xx) get a generic message.
      if (!res.ok && res.status !== 200) {
        const body = await res.json().catch(() => ({}));
        setStatus({
          kind: "error",
          message: body?.error ?? "No se pudo procesar la solicitud.",
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "Error de red. Vuelve a intentarlo.",
      });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="rounded-2xl border border-accent-500/30 bg-accent-50 p-6">
        <h2 className="text-base font-semibold text-navy-900">
          Revisa tu correo
        </h2>
        <p className="mt-2 text-sm text-navy-600 leading-relaxed">
          Si <strong>{email}</strong> está autorizado, recibirás un enlace de
          acceso en los próximos minutos. El enlace caduca en 1 hora y solo
          puede usarse una vez.
        </p>
        <p className="mt-3 text-xs text-navy-500">
          ¿No llegó? Revisa la carpeta de spam. Si tu cuenta no está
          autorizada no se enviará ningún correo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-navy-700">Correo</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.kind === "submitting"}
          placeholder="nombre@gsf.com.do"
          className="mt-1 block w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
        />
      </label>
      <button
        type="submit"
        disabled={status.kind === "submitting" || !email}
        className="w-full rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50 transition-colors"
      >
        {status.kind === "submitting" ? "Enviando…" : "Enviar enlace de acceso"}
      </button>
      {status.kind === "error" && (
        <p className="text-sm text-red-600">{status.message}</p>
      )}
    </form>
  );
}
