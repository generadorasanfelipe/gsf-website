"use client";

import { useActionState } from "react";
import {
  STATUS_TRANSITIONS,
  type ComplaintStatus,
} from "@/lib/admin/complaints";
import { STATUS_LABEL } from "@/lib/admin/labels";
import { updateStatusAction, type ActionState } from "../actions";

const initial: ActionState = { ok: false };

export default function StatusControl({
  id,
  current,
}: {
  id: string;
  current: ComplaintStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateStatusAction,
    initial,
  );
  const options = STATUS_TRANSITIONS[current];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
          Estado del reporte
        </h3>
        <span className="text-sm font-semibold text-navy-900">
          {STATUS_LABEL[current]}
        </span>
      </div>

      {options.length > 0 ? (
        <form action={formAction} className="mt-3">
          <input type="hidden" name="id" value={id} />
          <p className="text-xs text-navy-500">Cambiar a:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((next) => (
              <button
                key={next}
                type="submit"
                name="status"
                value={next}
                disabled={pending}
                className="rounded-lg border border-navy-300 px-3 py-1.5 text-sm font-medium text-navy-700 transition-colors hover:border-navy-500 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {STATUS_LABEL[next]}
              </button>
            ))}
          </div>
        </form>
      ) : (
        <p className="mt-3 text-xs text-navy-500">
          No hay transiciones disponibles desde este estado.
        </p>
      )}

      {state.message && (
        <p
          className={`mt-3 text-xs ${
            state.ok ? "text-accent-700" : "text-red-600"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
