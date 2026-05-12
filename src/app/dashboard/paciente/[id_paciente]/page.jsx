"use client"
import {useParams, useSearchParams} from "next/navigation";
import {useState, useEffect, useRef} from "react";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import * as React from "react";
import {InfoButton} from "@/Componentes/InfoButton";
import {Textarea} from "@/components/ui/textarea";
import { RutInput } from "@/Componentes/RutInput";
import { PhoneInput } from "@/Componentes/PhoneInput";
import { formatRut } from "@/lib/designTokens";




export default function Paciente(){

    const {id_paciente} = useParams();
    const searchParams = useSearchParams();
    const vieneDeFichas = searchParams.get("desde") === "fichas";
    const [detallePaciente, setDetallePaciente] = useState([])
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const formularioRef = useRef(null);

    function volverAFichas() {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }




    //PARAMETROS USESTATE PARA INSERCION DE DATOS EN PACIENTES
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const[pais, setPais] = useState("");
    const [observacion1, setObservacion1] = useState("");
    const [apoderado, setApoderado] = useState("");
    const [apoderadoRut, setApoderadoRut] = useState("");
    const [medicamentosUsados, setMedicamentosUsados] = useState("");
    const [habitos, setHabitos] = useState("");
    const [comentariosAdicionales, setComentariosAdicionales] = useState("");

    function volverAingreso(){
        router.push("/dashboard/GestionPaciente");
    }


    function convertirFecha(isoString) {
        if (!isoString) return null;

        const date = new Date(isoString);
        return date.toISOString().split("T")[0];
    }


    //FUNCION PARA LA ACTUALIZACION DE DATOS DEL PACIENTE
    async function actualizarDatosPacientes(nombre,apellido,rut,nacimiento,sexo, prevision,telefono,correo,direccion,pais,observacion1,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales,id_paciente ) {

        let prevision_id = 0;

        if (prevision.includes("FONASA")) {
            prevision_id = 1;
        } else if (prevision.includes("ISAPRE")) {
            prevision_id = 2;
        } else if (prevision.includes("CONVENIO")) {
            prevision_id = 3;
        } else if (prevision.includes("SIN PREVISION")) {
            prevision_id = 4;
        }

        try {
            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais || !id_paciente) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            }

            const res = await fetch(`${API}/pacientes/pacientesActualizar`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut,
                    nacimiento : convertirFecha(nacimiento),
                    sexo,
                    prevision_id,
                    telefono,
                    correo,
                    direccion,
                    pais,
                    observacion1,
                    apoderado,
                    apoderado_rut,
                    medicamentosUsados,
                    habitos,
                    comentariosAdicionales,
                    id_paciente})
            })

            if(!res.ok) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion, El servidor no esta recibiendo la informacion correcta.")

            } else{

                const resultadoQuery = await res.json();

                if(resultadoQuery.message === true){
                    setNombre("");
                    setApellido("");
                    setNacimiento("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setRut("");
                    setSexo("");
                    setPais("");
                    setObservacion1("");
                    setApoderado("");
                    setApoderadoRut("");
                    setMedicamentosUsados("");
                    setHabitos("");
                    setComentariosAdicionales("");
                    await buscarPacientePorId(id_paciente);
                    return toast.success("Datos del paciente actualizados con Exito!");

                }else{
                    return toast.error("No se han podido Actualizar los datos del paciente. Intente mas tarde.")
                }
            }
        }catch(err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }


    async function buscarPacientePorId(id_paciente){
        try {
            if(!id_paciente){
                return toast.error("No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos.");
            }

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({id_paciente})
            })

            if(!res.ok){
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            // Asegurar que siempre guardamos un array para poder mapear sin errores
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);

        }catch(error){
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify");

        }
    }

    // Ejecutar la búsqueda cuando cambie id_paciente (Next puede resolver el param después del primer render)
    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente)
    }, [id_paciente]);


    useEffect(() => {
        if (detallePaciente.length > 0) {
            const paciente = detallePaciente[0];
            setNombre(paciente.nombre);
            setApellido(paciente.apellido);
            setRut(paciente.rut);
            setNacimiento(paciente.nacimiento);
            setSexo(paciente.sexo);
            setPrevision(previsionDeterminacion(paciente.prevision_id));
            setTelefono(paciente.telefono);
            setCorreo(paciente.correo);
            setDireccion(paciente.direccion);
            setPais(paciente.pais);
            setObservacion1(paciente.observacion1 ?? "");
            setApoderado(paciente.apoderado ?? "");
            setApoderadoRut(paciente.apoderado_rut ?? "");
            setMedicamentosUsados(paciente.medicamentosUsados ?? "");
            setHabitos(paciente.habitos ?? "");
            setComentariosAdicionales(paciente.comentariosAdicionales ?? "");
        }
    }, [detallePaciente]);





    function previsionDeterminacion(id_prevision){
        if(id_prevision === 1) return "FONASA";
        if(id_prevision === 2) return "ISAPRE";
        if(id_prevision === 3) return "CONVENIO";
        if(id_prevision === 4) return "SIN PREVISION";
        return "SIN DEFINIR";
    }



    async function eliminarPaciente(id_paciente){
        try {
            if(!id_paciente){
                return toast.error("No se puede eliminar el paciente si no hay pacientes seleccionados.")
            }

            const res = await fetch(`${API}/pacientes/eliminarPaciente`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                body: JSON.stringify({id_paciente})
            })

            if(!res.ok){
                return toast.error("No se ha podido eliminar paciente, contacte a soporte de NativeCode (Problema en el servidor)")
            }else{

                const resultadoBackend = await res.json();
                if(resultadoBackend.message === true){
                    toast.success("Se ha eliminado correctamente el paciente de la base de datos");
                    router.push("/dashboard/GestionPaciente");
                    return;
                }else{
                    return toast.error("No se ha podido elimnar al paciente de la base de datos, el mensaje que llega se contepla como false")
                }
            }
        }catch (error) {
            return toast.error('No ha sido posible eliminar al paciente, contacte a soporte ')
        }
    }

    const paciente = detallePaciente[0] ?? null;

    return (
        <div className="min-h-screen bg-[#FAFAFB]">
            <ToasterClient/>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

                {/* ── Header ── */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Pacientes</p>
                        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                            {paciente ? `${paciente.nombre} ${paciente.apellido}` : "Ficha de Paciente"}
                        </h1>
                        <p className="mt-1 text-[13px] text-slate-500">
                            Datos clínicos y de contacto del paciente
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={volverAFichas}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all hover:shadow-md hover:scale-[1.01]"
                            style={{ background: "linear-gradient(135deg, #6E56CF 0%, #8B5CF6 100%)" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                            </svg>
                            Carpeta del Paciente
                        </button>
                        <button
                            type="button"
                            onClick={() => volverAingreso()}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMostrarFormulario(prev => !prev);
                                setTimeout(() => {
                                    formularioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }, 100);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-[#F3F0FF] px-4 py-2.5 text-sm font-semibold text-[#6E56CF] shadow-sm transition-all hover:bg-[#EDE9FE]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Editar
                        </button>
                        <button
                            type="button"
                            onClick={() => eliminarPaciente(id_paciente)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Eliminar
                        </button>
                        <InfoButton informacion={"⚠️ Si un paciente es eliminado, no será posible acceder a sus fichas clínicas."}/>
                    </div>
                </div>

                {/* ── Estado vacío ── */}
                {detallePaciente.length === 0 && (
                    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                        Cargando datos del paciente...
                    </div>
                )}

                {/* ── Tarjeta del paciente ── */}
                {paciente && (
                    <div className="space-y-6">

                        {/* Hero */}
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                            <div className="relative overflow-hidden px-6 py-6 sm:px-8"
                                style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#6E56CF 100%)" }}>
                                <div className="pointer-events-none absolute -top-8 right-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
                                <div className="pointer-events-none absolute bottom-0 left-12 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl" />
                                <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white backdrop-blur-sm ring-1 ring-white/20">
                                            {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200/80">Ficha de paciente</p>
                                            <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                                {paciente.nombre} {paciente.apellido}
                                            </h2>
                                            <p className="mt-1 text-sm text-violet-100/80">
                                                RUT <span className="font-semibold text-white font-mono">{formatRut(paciente.rut) || "---"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-sm">
                                            {previsionDeterminacion(paciente.prevision_id)}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
                                            ID #{paciente.id_paciente}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Datos rápidos */}
                            <div className="grid grid-cols-2 gap-px bg-slate-100 md:grid-cols-4">
                                {[
                                    { label: "Nacimiento", value: formatearFecha(paciente.nacimiento) ?? "---" },
                                    { label: "Sexo", value: paciente.sexo ?? "---" },
                                    { label: "Teléfono", value: paciente.telefono ?? "---" },
                                    { label: "País", value: paciente.pais ?? "---" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-white px-5 py-4">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                                        <p className="mt-1.5 text-sm font-semibold text-slate-800 break-words">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contacto + Apoderado */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">

                            <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/40 px-6 py-4">
                                    <div className="h-8 w-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6E56CF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Contacto</p>
                                        <h3 className="text-sm font-semibold text-slate-800">Información principal</h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Correo</p>
                                        <p className="mt-1.5 text-sm font-medium text-slate-800 break-words">{paciente.correo || "---"}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Dirección</p>
                                        <p className="mt-1.5 text-sm font-medium text-slate-800 break-words">{paciente.direccion || "---"}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 md:col-span-2">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Observación</p>
                                        <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-800 break-words">{paciente.observacion1 || "---"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/40 px-6 py-4">
                                    <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Referencia</p>
                                        <h3 className="text-sm font-semibold text-slate-800">Apoderado</h3>
                                    </div>
                                </div>
                                <div className="space-y-4 p-6">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Nombre</p>
                                        <p className="mt-1.5 text-sm font-medium text-slate-800 break-words">{paciente.apoderado || "---"}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">RUT Apoderado</p>
                                        <p className="mt-1.5 text-sm font-medium text-slate-800 break-words">{paciente.apoderado_rut || "---"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Antecedentes clínicos */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {[
                                { label: "Antecedentes", title: "Medicamentos usados", value: paciente.medicamentosUsados, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                                { label: "Rutina", title: "Hábitos", value: paciente.habitos, icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                                { label: "Notas", title: "Comentarios adicionales", value: paciente.comentariosAdicionales, icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
                            ].map(({ label, title, value, icon }) => (
                                <div key={title} className="rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
                                    <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-4">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                                        <h3 className="mt-0.5 text-sm font-semibold text-slate-800">{title}</h3>
                                    </div>
                                    <p className="p-5 text-sm leading-relaxed text-slate-700 break-words whitespace-pre-wrap">
                                        {value || <span className="text-slate-400 italic">Sin información</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Formulario de edición ── */}
                {mostrarFormulario && (
                    <div ref={formularioRef} className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">

                        {/* Header form */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/40 px-6 py-5 sm:px-8">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Edición</p>
                                <h2 className="mt-0.5 text-lg font-bold text-slate-900">Actualizar Datos del Paciente</h2>
                                <p className="mt-0.5 text-sm text-slate-500">Modifica los datos demográficos y clínicos.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMostrarFormulario(false)}
                                className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                Cerrar
                            </button>
                        </div>

                        <div className="p-6 sm:p-8 space-y-8">

                            {/* Datos básicos */}
                            <section>
                                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Identidad</p>
                                <h3 className="mb-5 text-base font-semibold text-slate-900">Datos básicos</h3>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Nombre</label>
                                        <ShadcnInput value={nombre} placeholder="Ej: José Nicolás" onChange={(e) => setNombre(e.target.value)} className="border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Apellido</label>
                                        <ShadcnInput value={apellido} placeholder="Ej: González Garrido" onChange={(e) => setApellido(e.target.value)} className="border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">RUT</label>
                                        <RutInput value={rut} onChange={(clean) => setRut(clean)} />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Sexo</label>
                                        <ShadcnInput value={sexo} placeholder="Ej: Femenino" onChange={(e) => setSexo(e.target.value)} className="border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Previsión</label>
                                        <div className="[&_button]:w-full [&_button]:justify-between [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:text-sm [&_button]:text-slate-700 [&_button]:shadow-none">
                                            <ShadcnSelect nombreDefault="Seleccione Previsión" value1="FONASA" value2="ISAPRE" value3="CONVENIO" value4="SIN PREVISION" onChange={(v) => setPrevision(v)}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Teléfono</label>
                                        <PhoneInput value={telefono} onChange={(full) => setTelefono(full)} />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Correo</label>
                                        <ShadcnInput value={correo} placeholder="paciente@email.com" onChange={(e) => setCorreo(e.target.value)} className="border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Dirección</label>
                                        <ShadcnInput value={direccion} placeholder="Av. España 123, Concepción" onChange={(e) => setDireccion(e.target.value)} className="border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">País</label>
                                        <ShadcnInput value={pais} placeholder="Chile" onChange={(e) => setPais(e.target.value)} className="border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                    </div>
                                    <div className="sm:col-span-2 xl:col-span-3">
                                        <ShadcnDatePicker label="Fecha de nacimiento" value={nacimiento} onChange={(f) => setNacimiento(f)}/>
                                    </div>
                                </div>
                            </section>

                            {/* Apoderado + Antecedentes */}
                            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                                <div className="rounded-[24px] border border-slate-200 bg-slate-50/50 p-5">
                                    <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Referencia</p>
                                    <h3 className="mb-5 text-sm font-semibold text-slate-900">Apoderado</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Nombre Apoderado</label>
                                            <ShadcnInput value={apoderado} placeholder="Nombre completo" onChange={(e) => setApoderado(e.target.value)} className="bg-white border-slate-200"/>
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">RUT Apoderado</label>
                                            <ShadcnInput value={apoderadoRut} placeholder="11222333K" onChange={(e) => setApoderadoRut(e.target.value)} className="bg-white border-slate-200"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[24px] border border-violet-100 bg-violet-50/30 p-5">
                                    <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Resumen clínico</p>
                                    <h3 className="mb-5 text-sm font-semibold text-slate-900">Observaciones y antecedentes</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Observación", value: observacion1, setter: setObservacion1 },
                                            { label: "Medicamentos usados", value: medicamentosUsados, setter: setMedicamentosUsados },
                                            { label: "Hábitos", value: habitos, setter: setHabitos },
                                            { label: "Comentarios adicionales", value: comentariosAdicionales, setter: setComentariosAdicionales },
                                        ].map(({ label, value, setter }) => (
                                            <div key={label}>
                                                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</label>
                                                <Textarea value={value} onChange={(e) => setter(e.target.value)} className="min-h-[80px] resize-y bg-white border-slate-200 focus:border-violet-300 focus:ring-violet-100"/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Botón guardar */}
                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => actualizarDatosPacientes(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, observacion1, apoderado, apoderadoRut, medicamentosUsados, habitos, comentariosAdicionales, id_paciente)}
                                    className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.01]"
                                    style={{ background: "linear-gradient(135deg, #6E56CF 0%, #8B5CF6 100%)" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
