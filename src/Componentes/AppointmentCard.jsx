"use client";

import { getStateTokens } from "@/lib/designTokens";
import { StatusBadge } from "@/Componentes/StatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function getDurationMinutes(start, end) {
  if (!start || !end) return 60;
  return Math.round((end - start) / 60000);
}

function formatHora(date) {
  if (!date) return "";
  try {
    return format(date, "HH:mm", { locale: es });
  } catch {
    return "";
  }
}

// ── Card para bloqueos ──────────────────────────────────────────────────────
function BloqueoCard({ event }) {
  return (
    <div
      className="flex h-full w-full items-center gap-1.5 px-1.5 py-1"
      style={{
        borderLeft: "3px solid rgba(107,114,128,0.8)",
        background:
          "repeating-linear-gradient(45deg,rgba(156,163,175,0.08) 0px,rgba(156,163,175,0.08) 4px,transparent 4px,transparent 10px)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 flex-shrink-0 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <span className="truncate text-[11px] font-semibold text-slate-600">
        {event.title || "Bloqueado"}
      </span>
    </div>
  );
}

// ── Card para selección temporal ────────────────────────────────────────────
function SeleccionCard({ event }) {
  return (
    <div
      className="flex h-full w-full items-center gap-1 px-1.5 py-1"
      style={{ borderLeft: "3px solid #6E56CF" }}
    >
      <span className="truncate text-[11px] font-semibold text-violet-700">
        {event.title || "Nueva reserva"}
      </span>
    </div>
  );
}

// ── Card principal ──────────────────────────────────────────────────────────
export function AppointmentCard({ event, currentView }) {
  if (event?.tipo === "bloqueo") return <BloqueoCard event={event} />;
  if (event?.tipo === "seleccion") return <SeleccionCard event={event} />;

  const reserva = event?.resource ?? {};
  const estado = reserva?.estadoReserva ?? "reservada";
  const pago = reserva?.estadoPago ?? "";
  const token = getStateTokens(estado);
  const duracion = getDurationMinutes(event.start, event.end);

  const nombre = (reserva?.nombrePaciente ?? "").trim();
  const apellido = (reserva?.apellidoPaciente ?? "").trim();
  const nombreCompleto = [nombre, apellido].filter(Boolean).join(" ");
  // Tipo de consulta/prestación (viene del agendamiento web o del drawer)
  const prestacion = (reserva?.motivo_reserva ?? reserva?.nombrePrestacion ?? reserva?.prestacion ?? reserva?.nombre_prestacion ?? reserva?.motivoConsulta ?? "").trim();
  // Modalidad: 'online' | 'presencial' | '' (campo nuevo — requiere migración BD)
  const modalidad = (reserva?.modalidad ?? "").toLowerCase().trim();
  // Nombre del profesional — resuelto en el mapeo de eventos del calendario
  const profesional = (reserva?._nombreProfesional ?? reserva?.nombreProfesional ?? "").trim();
  const horaInicio = formatHora(event.start);
  const horaFin = formatHora(event.end);

  // ── Vista MES: una sola línea compacta (el wrapper RBC ya tiene bg y border) ──
  if (currentView === "month") {
    return (
      <div className="flex w-full items-center gap-1 overflow-hidden h-full">
        <span className="text-[10px] font-semibold tabular-nums leading-none flex-shrink-0" style={{ color: token.accent }}>
          {horaInicio}
        </span>
        <span className="truncate text-[11px] font-bold leading-none flex-1" style={{ color: token.text }}>
          {nombreCompleto || event.title}
        </span>
      </div>
    );
  }

  if (currentView === "agenda") {
    return (
      <div
        className="flex h-full w-full min-w-0 flex-col gap-0.5 overflow-hidden rounded-md px-3 py-2"
        style={{
          borderLeft: `4px solid ${token.accent}`,
          background: token.bg,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
        }}
      >
        <span className="text-[11px] font-bold tabular-nums leading-none" style={{ color: token.accent }}>
          {horaInicio} – {horaFin}
        </span>
        <span
          className="truncate text-[13px] font-bold leading-snug"
          style={{ color: token.text }}
        >
          {nombreCompleto || event.title}
        </span>
        {profesional && (
          <span className="truncate text-[11px] font-semibold text-slate-400 leading-tight">
            {profesional}
          </span>
        )}
        <div className="flex flex-wrap gap-1 pt-0.5">
          <StatusBadge estado={estado} size="xs" />
          {pago && <StatusBadge estado={pago} size="xs" />}
        </div>
      </div>
    );
  }

  // ── Vista SEMANA / DÍA / AGENDA ─────────────────────────────────────────
  // Umbral: slots menores a 25px aprox. corresponden a ~15 min
  const isShort = duracion < 30;
  const isVeryShort = duracion < 20;

  if (isVeryShort) {
    // Tarjeta ultra-mini: solo hora de inicio + nombre en una línea
    return (
      <div
        className="flex h-full w-full items-center gap-1 px-1.5 overflow-hidden"
        style={{ borderLeft: `3px solid ${token.accent}`, background: token.bg }}
      >
        <span className="text-[10px] font-bold tabular-nums leading-none flex-shrink-0" style={{ color: token.accent }}>
          {horaInicio}
        </span>
        <span className="truncate text-[10px] font-semibold leading-none" style={{ color: token.text }}>
          {nombreCompleto || event.title}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col justify-start px-2.5 py-2 cursor-pointer overflow-hidden"
      style={{
        borderLeft: `3px solid ${token.accent}`,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(6px)",
        boxShadow: `0 1px 4px rgba(0,0,0,0.06), inset 0 0 0 1px ${token.border}`,
      }}
    >
      {/* Fila superior: hora + pill estado */}
      <div className="flex items-center justify-between gap-1 shrink-0">
        <span
          className="text-[11px] font-semibold tabular-nums leading-none tracking-tight"
          style={{ color: token.accent }}
        >
          {horaInicio} – {horaFin}
        </span>

        {/* Pill translúcido estilo Apple */}
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold leading-none shrink-0"
          style={{
            backgroundColor: `${token.accent}22`,
            color: token.text,
            border: `1px solid ${token.accent}44`,
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: token.accent }}
          />
          {token.label}
        </span>
      </div>

      {/* Línea divisoria — más delgada y con el color del acento */}
      <div
        className="my-1.5 shrink-0"
        style={{ height: "1px", background: `${token.accent}30` }}
      />

      {/* Nombre paciente */}
      <span
        className="truncate text-[13px] font-bold leading-snug shrink-0"
        style={{ color: token.text }}
      >
        {nombreCompleto || event.title}
      </span>

      {/* Prestación */}
      {prestacion && (
        <span
          className="truncate text-[11px] font-medium leading-tight mt-0.5 shrink-0"
          style={{ color: token.text, opacity: 0.72 }}
        >
          {prestacion}
        </span>
      )}

      {/* Profesional — inicial en círculo + nombre, solo cuando hay espacio */}
      {profesional && !isShort && (
        <div className="flex items-center gap-1.5 mt-1.5 shrink-0 min-w-0">
          <span
            className="inline-flex items-center justify-center h-4 w-4 rounded-full text-[8px] font-black shrink-0"
            style={{
              backgroundColor: `${token.accent}25`,
              color: token.text,
            }}
          >
            {profesional.charAt(0).toUpperCase()}
          </span>
          <span
            className="truncate text-[10px] font-medium leading-none"
            style={{ color: token.text, opacity: 0.65 }}
          >
            {profesional}
          </span>
        </div>
      )}

      {/* Modalidad online */}
      {modalidad === "online" && !isShort && (
        <span className="inline-flex items-center gap-1 text-[9px] font-semibold leading-none mt-1 shrink-0 text-sky-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Online
        </span>
      )}
    </div>
  );
}
