"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNoteAction, type ActionState } from "../actions";
import { MAX_NOTE_LENGTH } from "@/lib/admin/notes";

const initial: ActionState = { ok: false };

export default function NoteForm({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(addNoteAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the textarea after a successful save.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-4">
      <input type="hidden" name="id" value={id} />
      <label
        htmlFor="note-body"
        className="text-[11px] font-semibold uppercase tracking-wide text-navy-500"
      >
        Agregar nota interna
      </label>
      <textarea
        id="note-body"
        name="body"
        rows={3}
        maxLength={MAX_NOTE_LENGTH}
        placeholder="Visible solo para el equipo autorizado…"
        className="mt-2 w-full rounded-lg border border-navy-300 bg-white px-3 py-2 text-sm text-navy-800 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
      />
      <div className="mt-2 flex items-center justify-between">
        {state.message ? (
          <span
            className={`text-xs ${state.ok ? "text-accent-700" : "text-red-600"}`}
            role="status"
          >
            {state.message}
          </span>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar nota"}
        </button>
      </div>
    </form>
  );
}
