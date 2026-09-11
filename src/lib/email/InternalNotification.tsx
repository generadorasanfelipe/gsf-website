import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  referenceId: string;
  reporterClass: "internal" | "external";
  type: "complaint" | "grievance" | "report";
  anonymous: boolean;
  name?: string;
  email?: string;
  phone?: string;
  subject: string;
  description: string;
  locale: "es" | "en";
};

const TYPE_LABEL: Record<Props["type"], string> = {
  complaint: "Queja",
  grievance: "Reclamo",
  report: "Denuncia",
};

const CLASS_LABEL: Record<Props["reporterClass"], string> = {
  internal: "INTERNO — Empleado GSF",
  external: "EXTERNO — Comunidad / Proveedor / Tercero",
};

const CLASS_DEPT: Record<Props["reporterClass"], string> = {
  internal: "Cumplimiento",
  external: "Relaciones",
};

export default function InternalNotification({
  referenceId,
  reporterClass,
  type,
  anonymous,
  name,
  email,
  phone,
  subject,
  description,
  locale,
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{`${TYPE_LABEL[type]} ${referenceId} — ${subject}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Generadora San Felipe</Heading>
          <Text style={subheading}>Canal de Quejas y Denuncias — notificación interna</Text>

          <Section style={refSection}>
            <Text style={refLabel}>Código de referencia</Text>
            <Text style={refValue}>{referenceId}</Text>
          </Section>

          <Section style={classSection}>
            <Text style={classLabelStyle}>Clasificación</Text>
            <Text style={classValue}>{CLASS_LABEL[reporterClass]}</Text>
            <Text style={classDept}>
              Departamento responsable: <strong>{CLASS_DEPT[reporterClass]}</strong>
            </Text>
          </Section>

          <Section>
            <Text style={fieldLabel}>Tipo</Text>
            <Text style={fieldValue}>{TYPE_LABEL[type]}</Text>

            <Text style={fieldLabel}>Idioma del reportante</Text>
            <Text style={fieldValue}>{locale === "es" ? "Español" : "Inglés"}</Text>

            {anonymous ? (
              <Text style={anonymousNote}>
                ⚠ Reporte enviado de forma anónima. No hay datos de contacto del reportante.
              </Text>
            ) : (
              <>
                <Text style={fieldLabel}>Nombre</Text>
                <Text style={fieldValue}>{name}</Text>

                <Text style={fieldLabel}>Email</Text>
                <Text style={fieldValue}>
                  <Link href={`mailto:${email}`} style={link}>
                    {email}
                  </Link>
                </Text>

                {phone && (
                  <>
                    <Text style={fieldLabel}>Teléfono</Text>
                    <Text style={fieldValue}>
                      <Link href={`tel:${phone}`} style={link}>
                        {phone}
                      </Link>
                    </Text>
                  </>
                )}
              </>
            )}

            <Hr style={hr} />

            <Text style={fieldLabel}>Asunto</Text>
            <Text style={fieldValueLarge}>{subject}</Text>

            <Text style={fieldLabel}>Descripción</Text>
            <Text style={descriptionText}>{description}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Este reporte fue registrado en el sistema y debe responderse según los
            procedimientos de gestión de quejas. El acuse al reportante (si aplica) se
            envió en paralelo.
            {!anonymous && email && (
              <>
                {" "}
                Si responde directamente a este correo, su respuesta irá a{" "}
                <strong>{email}</strong>.
              </>
            )}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "32px 0",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 32px",
  maxWidth: "600px",
  borderRadius: "12px",
};
const h1 = {
  color: "#003865",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 4px",
};
const subheading = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 24px",
};
const refSection = {
  backgroundColor: "#e6eef5",
  padding: "16px 20px",
  borderRadius: "8px",
  margin: "0 0 24px",
};
const refLabel = {
  color: "#3778ab",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 4px",
};
const refValue = {
  color: "#003865",
  fontSize: "18px",
  fontWeight: "700",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  margin: "0",
};
const classSection = {
  backgroundColor: "#e6f7ec",
  border: "1px solid #96deb1",
  padding: "16px 20px",
  borderRadius: "8px",
  margin: "0 0 24px",
};
const classLabelStyle = {
  color: "#007a2d",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 4px",
};
const classValue = {
  color: "#004a1b",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0 0 6px",
};
const classDept = {
  color: "#374151",
  fontSize: "13px",
  margin: "0",
};
const fieldLabel = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "16px 0 4px",
};
const fieldValue = {
  color: "#111827",
  fontSize: "14px",
  margin: "0",
};
const fieldValueLarge = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
};
const descriptionText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};
const anonymousNote = {
  color: "#92400e",
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  padding: "12px 16px",
  borderRadius: "6px",
  fontSize: "13px",
  margin: "16px 0",
};
const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};
const link = {
  color: "#3778ab",
  textDecoration: "underline",
};
const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0",
};
