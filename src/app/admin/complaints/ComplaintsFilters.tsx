"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FilterState = {
  status: string;
  type: string;
  class: string;
  from: string;
  to: string;
  q: string;
};

const selectCls =
  "rounded-lg border border-navy-300 bg-white px-3 py-2 text-sm text-navy-800 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30";

export default function ComplaintsFilters({
  initial,
}: {
  initial: FilterState;
}) {
  const router = useRouter();
  const [f, setF] = useState<FilterState>(initial);

  function apply() {
    const params = new URLSearchParams();
    // status is driven by the summary chips, not this form, but preserve it.
    if (f.status) params.set("status", f.status);
    if (f.type) params.set("type", f.type);
    if (f.class) params.set("class", f.class);
    if (f.from) params.set("from", f.from);
    if (f.to) params.set("to", f.to);
    if (f.q.trim()) params.set("q", f.q.trim());
    const qs = params.toString();
    router.push(qs ? `/admin/complaints?${qs}` : "/admin/complaints");
  }

  function clearAll() {
    setF({ status: "", type: "", class: "", from: "", to: "", q: "" });
    router.push("/admin/complaints");
  }

  const set = (patch: Partial<FilterState>) =>
    setF((prev) => ({ ...prev, ...patch }));

  return (
    <form
      className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-navy-200 bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
          Buscar
        </span>
        <input
          type="search"
          value={f.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Referencia o asunto"
          className={`${selectCls} w-52`}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
          Clasificación
        </span>
        <select
          value={f.class}
          onChange={(e) => set({ class: e.target.value })}
          className={selectCls}
        >
          <option value="">Todas</option>
          <option value="internal">Interno</option>
          <option value="external">Externo</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
          Tipo
        </span>
        <select
          value={f.type}
          onChange={(e) => set({ type: e.target.value })}
          className={selectCls}
        >
          <option value="">Todos</option>
          <option value="complaint">Queja</option>
          <option value="grievance">Reclamo</option>
          <option value="report">Denuncia</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
          Desde
        </span>
        <input
          type="date"
          value={f.from}
          onChange={(e) => set({ from: e.target.value })}
          className={selectCls}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
          Hasta
        </span>
        <input
          type="date"
          value={f.to}
          onChange={(e) => set({ to: e.target.value })}
          className={selectCls}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-navy-300 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
