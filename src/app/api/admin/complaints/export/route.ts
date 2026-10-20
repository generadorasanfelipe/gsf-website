import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/requireAdmin";
import {
  listAllComplaints,
  COMPLAINT_STATUSES,
  COMPLAINT_TYPES,
  REPORTER_CLASSES,
  type ComplaintFilters,
  type ComplaintStatus,
  type ComplaintType,
  type ReporterClass,
} from "@/lib/admin/complaints";
import {
  STATUS_LABEL,
  TYPE_LABEL,
  CLASS_LABEL,
  formatDR,
} from "@/lib/admin/labels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function one(v: string | null): string | undefined {
  return v && v.trim() ? v.trim() : undefined;
}

function parseFilters(params: URLSearchParams): ComplaintFilters {
  const status = one(params.get("status"));
  const type = one(params.get("type"));
  const cls = one(params.get("class"));
  return {
    status: COMPLAINT_STATUSES.includes(status as ComplaintStatus)
      ? (status as ComplaintStatus)
      : undefined,
    type: COMPLAINT_TYPES.includes(type as ComplaintType)
      ? (type as ComplaintType)
      : undefined,
    reporterClass: REPORTER_CLASSES.includes(cls as ReporterClass)
      ? (cls as ReporterClass)
      : undefined,
    from: one(params.get("from")),
    to: one(params.get("to")),
    q: one(params.get("q")),
  };
}

/** RFC 4180 field: wrap in quotes and double any embedded quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

const HEADERS = [
  "Referencia",
  "Clasificación",
  "Tipo",
  "Anónimo",
  "Nombre",
  "Email",
  "Teléfono",
  "Asunto",
  "Descripción",
  "Estado",
  "Idioma",
  "Recibido",
  "Actualizado",
];

export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const filters = parseFilters(req.nextUrl.searchParams);
  const rows = await listAllComplaints(filters);

  const lines = [HEADERS.map(csvField).join(",")];
  for (const c of rows) {
    lines.push(
      [
        c.reference_id,
        CLASS_LABEL[c.reporter_class],
        TYPE_LABEL[c.type],
        c.anonymous ? "Sí" : "No",
        c.anonymous ? "" : (c.name ?? ""),
        c.anonymous ? "" : (c.email ?? ""),
        c.anonymous ? "" : (c.phone ?? ""),
        c.subject,
        c.description,
        STATUS_LABEL[c.status],
        c.locale === "es" ? "Español" : "Inglés",
        formatDR(c.created_at),
        formatDR(c.updated_at),
      ]
        .map((v) => csvField(String(v)))
        .join(","),
    );
  }

  // Prepend a UTF-8 BOM so Excel reads the accents correctly.
  const csv = "﻿" + lines.join("\r\n") + "\r\n";
  const stamp = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/-/g, "");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quejas-gsf-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
