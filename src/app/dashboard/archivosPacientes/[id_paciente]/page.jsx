"use client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import { formatRut } from "@/lib/designTokens";

// ── Mock Data ──────────────────────────────────────────────
const MOCK_PACIENTE = {
    nombre: "Valentina",
    apellido: "Muñoz Herrera",
    rut: "191684087",
    telefono: "+56 9 8765 4321",
    correo: "valentina.munoz@email.com",
};

const MOCK_ARCHIVOS = [
    {
        id: 1,
        fechaSubida: "2025-06-01",
        tipoArchivo: "PDF",
        profesional: "Dr. Andrés Soto",
        nombreDocumento: "Radiografía Panorámica",
        url: "#",
    },
    {
        id: 2,
        fechaSubida: "2025-05-20",
        tipoArchivo: "Imagen",
        profesional: "Dra. Carolina Reyes",
        nombreDocumento: "Fotografía Intraoral Superior",
        url: "#",
    },
    {
        id: 3,
        fechaSubida: "2025-05-10",
        tipoArchivo: "PDF",
        profesional: "Dr. Andrés Soto",
        nombreDocumento: "Informe de Evaluación Periodontal",
        url: "#",
    },
    {
        id: 4,
        fechaSubida: "2025-04-28",
        tipoArchivo: "Word",
        profesional: "Dra. María López",
        nombreDocumento: "Consentimiento Informado Cirugía",
        url: "#",
    },
    {
        id: 5,
        fechaSubida: "2025-04-15",
        tipoArchivo: "Imagen",
        profesional: "Dr. Andrés Soto",
        nombreDocumento: "Tomografía Computarizada Maxilar",
        url: "#",
    },
    {
        id: 6,
        fechaSubida: "2025-03-22",
        tipoArchivo: "PDF",
        profesional: "Dra. Carolina Reyes",
        nombreDocumento: "Presupuesto Tratamiento Ortodoncia",
        url: "#",
    },
];
// ──────────────────────────────────────────────────────────

function formatearFechaCorta(fecha) {
    if (!fecha) return "-";
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getBadgeColor(tipo) {
    const map = {
        PDF: "bg-red-50 text-red-600 border-red-100",
        Imagen: "bg-blue-50 text-blue-600 border-blue-100",
        Word: "bg-indigo-50 text-indigo-600 border-indigo-100",
    };
    return map[tipo] || "bg-slate-50 text-slate-600 border-slate-100";
}

function getFileIcon(tipo) {
    if (tipo === "PDF") return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    );
    if (tipo === "Imagen") return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    );
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    );
}

export default function ArchivosPaciente() {
    const { id_paciente } = useParams();
    const router = useRouter();

    // TODO: Reemplazar mock por fetch real al backend
    const paciente = MOCK_PACIENTE;
    const [archivos, setArchivos] = useState(MOCK_ARCHIVOS);
    const [modalVer, setModalVer] = useState(null);

    function handleEliminar(id) {
        // TODO: Conectar con endpoint de eliminación
        setArchivos((prev) => prev.filter((a) => a.id !== id));
        toast.success("Documento eliminado correctamente");
    }

    function handleDescargar(archivo) {
        // TODO: Conectar con endpoint de descarga real
        toast.success(`Descargando: ${archivo.nombreDocumento}`);
    }

    function handleVisualizar(archivo) {
        // TODO: Conectar con visor real / modal de previsualización
        setModalVer(archivo);
    }

    function volverAFicha() {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    function volverAListaTrabajo() {
        router.push("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#FAFAFB] flex flex-col">
            <ToasterClient />

            <div className="flex-1 mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-10 2xl:max-w-none">

                {/* ── Header Principal ── */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">Gestión Documental</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Documentos del Paciente
                        </h1>
                        <p className="mt-2 text-[13px] text-slate-500 max-w-2xl">
                            Repositorio centralizado de archivos clínicos, exámenes e informes asociados al paciente.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="h-14 px-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Documentos</span>
                            <span className="text-sm font-bold text-slate-900 mt-1 leading-none">{archivos.length} Archivos</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={volverAFicha}
                                className="h-14 px-5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                title="Volver a ficha"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <button
                                onClick={volverAListaTrabajo}
                                className="h-14 px-6 rounded-2xl bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 flex items-center justify-center gap-2"
                            >
                                Reservaciones
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Tarjeta Información del Paciente ── */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-[20px] bg-[#6E56CF] text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-100">
                            {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">{paciente.nombre} {paciente.apellido}</h2>
                            <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">ID Paciente #{id_paciente}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <div className="space-y-0.5 text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">RUT</span>
                                <span className="text-[13px] font-bold text-slate-900 font-mono">{formatRut(paciente.rut) || "-"}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-200" />
                            <div className="space-y-0.5 text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Teléfono</span>
                                <span className="text-[13px] font-semibold text-slate-700">{paciente.telefono || "-"}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-200" />
                            <div className="space-y-0.5 text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Correo</span>
                                <span className="text-[13px] font-semibold text-slate-700">{paciente.correo || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabla de Documentos ── */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Archivos Clínicos</h3>
                        {/* TODO: Conectar subida de archivos */}
                        <button className="h-10 px-5 rounded-xl bg-[#6E56CF] text-white text-[13px] font-bold hover:bg-[#5B45B0] transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Subir Archivo
                        </button>
                    </div>

                    {archivos.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha Subida</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profesional</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombre Documento</th>
                                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descargar</th>
                                        <th className="px-4 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eliminar</th>
                                        <th className="px-8 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualizar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {archivos.map((archivo, idx) => (
                                        <tr
                                            key={archivo.id}
                                            className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}
                                        >
                                            {/* Fecha */}
                                            <td className="px-8 py-4">
                                                <span className="text-[13px] font-semibold text-slate-700">{formatearFechaCorta(archivo.fechaSubida)}</span>
                                            </td>

                                            {/* Tipo de Archivo */}
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold ${getBadgeColor(archivo.tipoArchivo)}`}>
                                                    {getFileIcon(archivo.tipoArchivo)}
                                                    {archivo.tipoArchivo}
                                                </span>
                                            </td>

                                            {/* Profesional */}
                                            <td className="px-4 py-4">
                                                <span className="text-[13px] text-slate-600">{archivo.profesional}</span>
                                            </td>

                                            {/* Nombre Documento */}
                                            <td className="px-4 py-4">
                                                <span className="text-[13px] font-medium text-slate-900">{archivo.nombreDocumento}</span>
                                            </td>

                                            {/* Descargar */}
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => handleDescargar(archivo)}
                                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 transition-all hover:shadow-sm"
                                                    title="Descargar archivo"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </button>
                                            </td>

                                            {/* Eliminar */}
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => handleEliminar(archivo.id)}
                                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-all hover:shadow-sm"
                                                    title="Eliminar archivo"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>

                                            {/* Visualizar */}
                                            <td className="px-8 py-4 text-center">
                                                <button
                                                    onClick={() => handleVisualizar(archivo)}
                                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-violet-50 text-[#6E56CF] hover:bg-violet-100 border border-violet-100 transition-all hover:shadow-sm"
                                                    title="Visualizar archivo"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* ── Empty State ── */
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="h-16 w-16 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">No hay documentos registrados para este paciente</p>
                            <p className="text-slate-300 text-[12px] mt-1">Suba un archivo para comenzar el repositorio documental</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal de Visualización ── */}
            {modalVer && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalVer(null)}>
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vista Previa del Documento</h3>
                            <button onClick={() => setModalVer(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${getBadgeColor(modalVer.tipoArchivo)}`}>
                                    {getFileIcon(modalVer.tipoArchivo)}
                                </div>
                                <div>
                                    <p className="text-[15px] font-bold text-slate-900">{modalVer.nombreDocumento}</p>
                                    <p className="text-[12px] text-slate-400 mt-0.5">{modalVer.tipoArchivo} &middot; {formatearFechaCorta(modalVer.fechaSubida)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Profesional</span>
                                    <span className="text-[13px] font-semibold text-slate-700">{modalVer.profesional}</span>
                                </div>
                                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fecha Subida</span>
                                    <span className="text-[13px] font-semibold text-slate-700">{formatearFechaCorta(modalVer.fechaSubida)}</span>
                                </div>
                            </div>
                            {/* TODO: Renderizar preview real del archivo (PDF viewer, imagen, etc.) */}
                            <div className="h-48 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                                <p className="text-slate-300 text-sm font-medium">Vista previa no disponible — conectar visor</p>
                            </div>
                            <button
                                onClick={() => { handleDescargar(modalVer); setModalVer(null); }}
                                className="w-full h-11 bg-[#6E56CF] text-white text-[13px] font-bold rounded-2xl hover:bg-[#5B45B0] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar Documento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
