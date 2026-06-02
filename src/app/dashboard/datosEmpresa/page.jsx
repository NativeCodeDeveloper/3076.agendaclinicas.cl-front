'use client'
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import { ButtonDinamic } from "@/Componentes/ButtonDinamic";

/*
 * DATOS DE LA EMPRESA — CRUD
 *
 * Backend conectado:
 *   GET  /datosempresa/seleccionartodos
 *   POST /datosempresa/seleccionarporid
 *   POST /datosempresa/actualizar
 *
 * Estos datos alimentan (una vez conectados) los siguientes archivos del frontend:
 *   - src/lib/publicContact.js                           (fuente central de contacto y redes)
 *   - src/app/(public)/portada/page.jsx                  (redes sociales del Hero/Portada)
 *   - src/Componentes/Footer.jsx                         (contacto + redes en el footer)
 *   - src/Componentes/FlotanteInstagram.jsx              (botón flotante de Instagram)
 *   - src/Componentes/FloatingWhatsApp.jsx               (botón flotante de WhatsApp)
 *   - src/Componentes/WhatsAppFloatButton.jsx            (botón flotante de WhatsApp alternativo)
 *   - src/app/(public)/contacto/page.jsx                 (página de contacto)
 *   - src/app/(public)/seccion1/page.jsx                 (sección "Sobre nosotros" del inicio)
 */

export default function DatosEmpresa() {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [cargando, setCargando] = useState(false);

    // Datos generales
    const [id_empresa, setId_empresa] = useState(1);
    const [empresaNombre, setEmpresaNombre] = useState("");

    // Contacto
    const [contactoTelefono, setContactoTelefono] = useState("");
    const [contactoWhatsapp, setContactoWhatsapp] = useState("");
    const [contactoEmail, setContactoEmail] = useState("");
    const [contactoDireccion, setContactoDireccion] = useState("");
    const [contactoUrlMapa, setContactoUrlMapa] = useState("");

    // Sobre nosotros
    const [sobreNosotrosTitulo, setSobreNosotrosTitulo] = useState("");
    const [sobreNosotrosParrafo1, setSobreNosotrosParrafo1] = useState("");
    const [sobreNosotrosParrafo2, setSobreNosotrosParrafo2] = useState("");

    // Redes sociales
    const [socialInstagramUrl, setSocialInstagramUrl] = useState("");
    const [socialInstagramHandle, setSocialInstagramHandle] = useState("");
    const [socialFacebookUrl, setSocialFacebookUrl] = useState("");
    const [socialTwitterUrl, setSocialTwitterUrl] = useState("");
    const [socialLinkedinUrl, setSocialLinkedinUrl] = useState("");
    const [socialTiktokUrl, setSocialTiktokUrl] = useState("");
    const [socialYoutubeUrl, setSocialYoutubeUrl] = useState("");
    const [socialOtraUrl, setSocialOtraUrl] = useState("");
    const [socialOtraEtiqueta, setSocialOtraEtiqueta] = useState("");

    function cargarFormulario(d) {
        if (!d) return;

        setId_empresa(d.id_empresa || 1);
        setEmpresaNombre(d.empresaNombre || "");
        setContactoTelefono(d.contactoTelefono || "");
        setContactoWhatsapp(d.contactoWhatsapp || "");
        setContactoEmail(d.contactoEmail || "");
        setContactoDireccion(d.contactoDireccion || "");
        setContactoUrlMapa(d.contactoUrlMapa || "");
        setSobreNosotrosTitulo(d.sobreNosotrosTitulo || "");
        setSobreNosotrosParrafo1(d.sobreNosotrosParrafo1 || "");
        setSobreNosotrosParrafo2(d.sobreNosotrosParrafo2 || "");
        setSocialInstagramUrl(d.socialInstagramUrl || "");
        setSocialInstagramHandle(d.socialInstagramHandle || "");
        setSocialFacebookUrl(d.socialFacebookUrl || "");
        setSocialTwitterUrl(d.socialTwitterUrl || "");
        setSocialLinkedinUrl(d.socialLinkedinUrl || "");
        setSocialTiktokUrl(d.socialTiktokUrl || "");
        setSocialYoutubeUrl(d.socialYoutubeUrl || "");
        setSocialOtraUrl(d.socialOtraUrl || "");
        setSocialOtraEtiqueta(d.socialOtraEtiqueta || "");
    }

    async function cargarDatosEmpresa() {
        try {
            const res = await fetch(`${API}/datosempresa/seleccionartodos`, {
                method: "GET",
                headers: { Accept: "application/json" },
                mode: "cors",
            });
            if (!res.ok) return toast.error("No se pudieron cargar los datos de la empresa.");
            const data = await res.json();
            const d = Array.isArray(data) ? data[0] : data;
            cargarFormulario(d);
        } catch {
            toast.error("Error de conexión al cargar los datos.");
        } finally {
            setCargandoInicial(false);
        }
    }

    async function seleccionarDatosEmpresaPorId() {
        if (!id_empresa) {
            toast.error("Ingresa el ID de la empresa.");
            return;
        }

        try {
            setCargando(true);
            const res = await fetch(`${API}/datosempresa/seleccionarporid`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({ id_empresa }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            const d = Array.isArray(data) ? data[0] : data;
            if (!d) {
                toast.error("No se encontraron datos para ese ID.");
                return;
            }

            cargarFormulario(d);
            toast.success("Datos cargados correctamente.");
        } catch {
            toast.error("No se pudieron cargar los datos de la empresa.");
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarDatosEmpresa();
    }, []);

    async function guardarDatosEmpresa() {
        if (
            !empresaNombre ||
            !contactoTelefono ||
            !contactoWhatsapp ||
            !contactoEmail ||
            !contactoDireccion ||
            !contactoUrlMapa ||
            !sobreNosotrosTitulo ||
            !sobreNosotrosParrafo1 ||
            !sobreNosotrosParrafo2 ||
            !socialInstagramUrl ||
            !socialInstagramHandle ||
            !socialFacebookUrl ||
            !socialTwitterUrl ||
            !socialLinkedinUrl ||
            !socialTiktokUrl ||
            !socialYoutubeUrl ||
            !socialOtraUrl ||
            !socialOtraEtiqueta ||
            !id_empresa
        ) {
            toast.error("Completa todos los campos antes de guardar.");
            return;
        }

        try {
            setCargando(true);
            const res = await fetch(`${API}/datosempresa/actualizar`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    empresaNombre,
                    contactoTelefono,
                    contactoWhatsapp,
                    contactoEmail,
                    contactoDireccion,
                    contactoUrlMapa,
                    sobreNosotrosTitulo,
                    sobreNosotrosParrafo1,
                    sobreNosotrosParrafo2,
                    socialInstagramUrl,
                    socialInstagramHandle,
                    socialFacebookUrl,
                    socialTwitterUrl,
                    socialLinkedinUrl,
                    socialTiktokUrl,
                    socialYoutubeUrl,
                    socialOtraUrl,
                    socialOtraEtiqueta,
                    id_empresa,
                }),
            });
            if (!res.ok) throw new Error();
            const respuesta = await res.json();
            if (respuesta?.message !== true) throw new Error();
            toast.success("Datos guardados correctamente.");
        } catch {
            toast.error("No fue posible guardar los datos.");
        } finally {
            setCargando(false);
        }
    }

    const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = "text-sm font-medium text-slate-700";

    if (cargandoInicial) {
        return (
            <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
                <p className="text-sm text-slate-400">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFB]">
            <ToasterClient />
            <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8">

                {/* Header */}
                <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">Configuración</p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Datos de la Página Web</h1>
                        <p className="text-sm text-slate-500">
                            Configura el nombre, contacto, redes sociales y textos que se muestran en toda la página pública.
                        </p>
                    </div>
                </div>

                {/* Datos generales */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-slate-900">Datos generales</h2>
                            <p className="text-sm text-slate-500">
                                {/* CONEXIÓN: empresaNombre se usa en Footer.jsx (copyright), FloatingWhatsApp.jsx,
                                    WhatsAppFloatButton.jsx (aria-label) y layout.jsx (metadata del sitio) */}
                                Nombre de la empresa tal como aparece en la web y en los metadatos del sitio.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[180px_1fr]">
                            <div className="space-y-1.5">
                                <label className={labelClass}>ID empresa</label>
                                <div className="flex gap-2">
                                    <input
                                        value={id_empresa}
                                        onChange={(e) => setId_empresa(e.target.value)}
                                        type="number"
                                        min="1"
                                        className={inputClass}
                                        placeholder="1"
                                    />
                                    <ButtonDinamic
                                        onClick={seleccionarDatosEmpresaPorId}
                                        className="shrink-0 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                                    >
                                        Cargar
                                    </ButtonDinamic>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Nombre de la empresa</label>
                                <input
                                    value={empresaNombre}
                                    onChange={(e) => setEmpresaNombre(e.target.value)}
                                    className={inputClass}
                                    placeholder="Ej: Clínica San Pedro"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-slate-900">Información de contacto</h2>
                            <p className="text-sm text-slate-500">
                                {/* CONEXIÓN: Todos estos campos se leen desde src/lib/publicContact.js y se muestran en:
                                    - Footer.jsx → sección "Contacto" (teléfono, email, dirección)
                                    - src/app/(public)/contacto/page.jsx → página de contacto completa
                                    - FloatingWhatsApp.jsx y WhatsAppFloatButton.jsx → botón flotante
                                    Reemplazar las variables NEXT_PUBLIC_CONTACT_* del .env por este endpoint */}
                                Aparece en el footer, en la página de contacto y en el botón flotante de WhatsApp.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Teléfono</label>
                                <input value={contactoTelefono} onChange={(e) => setContactoTelefono(e.target.value)} className={inputClass} placeholder="+56 9 XXXX XXXX" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>WhatsApp</label>
                                <input value={contactoWhatsapp} onChange={(e) => setContactoWhatsapp(e.target.value)} className={inputClass} placeholder="+56 9 XXXX XXXX" />
                                <p className="text-xs text-slate-400">Si queda vacío se usa el teléfono de arriba.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Email de contacto</label>
                                <input value={contactoEmail} onChange={(e) => setContactoEmail(e.target.value)} type="email" className={inputClass} placeholder="contacto@clinica.cl" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Dirección física</label>
                                <input value={contactoDireccion} onChange={(e) => setContactoDireccion(e.target.value)} className={inputClass} placeholder="Av. Principal 123, Santiago" />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className={labelClass}>Mapa de Google Maps</label>
                                <input value={contactoUrlMapa} onChange={(e) => setContactoUrlMapa(e.target.value)} className={inputClass} placeholder="https://www.google.com/maps/embed?pb=..." />
                                <p className="text-xs text-slate-400">Pega el src del iframe o el iframe completo de Google Maps. Se mostrará en el footer.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sobre nosotros */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-slate-900">Sobre nosotros</h2>
                            <p className="text-sm text-slate-500">
                                {/* CONEXIÓN: Estos textos se muestran en:
                                    - src/app/(public)/seccion1/page.jsx → sección "Sobre nosotros" del inicio
                                    - src/app/(public)/portada/page.jsx → título principal del Hero
                                    Actualmente el frontend lee de NEXT_PUBLIC_ABOUT_* (.env) como fallback
                                    y de los endpoints /titulo y /textos del backend antiguo.
                                    Este formulario centraliza todo en /datosEmpresa */}
                                Se muestra en la sección "Acerca de / Sobre nosotros" de la página de inicio.
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Título de la sección</label>
                            <input value={sobreNosotrosTitulo} onChange={(e) => setSobreNosotrosTitulo(e.target.value)} className={inputClass} placeholder="Ej: Clínica San Pedro" />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Primer párrafo</label>
                            <textarea value={sobreNosotrosParrafo1} onChange={(e) => setSobreNosotrosParrafo1(e.target.value)} rows={3} className={textareaClass} placeholder="Descripción principal del centro..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Segundo párrafo</label>
                            <textarea value={sobreNosotrosParrafo2} onChange={(e) => setSobreNosotrosParrafo2(e.target.value)} rows={3} className={textareaClass} placeholder="Servicios destacados, horarios u otros detalles..." />
                        </div>
                    </div>
                </div>

                {/* Redes sociales */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-slate-900">Redes sociales</h2>
                            <p className="text-sm text-slate-500">
                                {/* CONEXIÓN: Las redes sociales se consumen en múltiples lugares:
                                    - src/lib/publicContact.js → objeto publicContact.socials (fuente central)
                                    - src/app/(public)/portada/page.jsx → íconos del Hero (actualmente hardcodeados con href="#", deben reemplazarse con estos valores)
                                    - src/Componentes/Footer.jsx → íconos y enlaces en el footer
                                    - src/Componentes/FlotanteInstagram.jsx → botón flotante de Instagram
                                    - src/app/(public)/contacto/page.jsx → lista de redes en página de contacto
                                    REGLA: Si el campo URL está vacío, el ícono NO aparece en ningún componente */}
                                Solo aparecen los íconos de las redes que tengan una URL ingresada.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Instagram — URL del perfil</label>
                                <input value={socialInstagramUrl} onChange={(e) => setSocialInstagramUrl(e.target.value)} className={inputClass} placeholder="https://instagram.com/tuusuario" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Instagram — Handle (@usuario)</label>
                                <input value={socialInstagramHandle} onChange={(e) => setSocialInstagramHandle(e.target.value)} className={inputClass} placeholder="@tuusuario" />
                                <p className="text-xs text-slate-400">Se muestra en el botón flotante y en la página de contacto.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Facebook — URL del perfil</label>
                                <input value={socialFacebookUrl} onChange={(e) => setSocialFacebookUrl(e.target.value)} className={inputClass} placeholder="https://facebook.com/tuusuario" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Twitter / X — URL del perfil</label>
                                <input value={socialTwitterUrl} onChange={(e) => setSocialTwitterUrl(e.target.value)} className={inputClass} placeholder="https://x.com/tuusuario" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>LinkedIn — URL del perfil</label>
                                <input value={socialLinkedinUrl} onChange={(e) => setSocialLinkedinUrl(e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/tuusuario" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>TikTok — URL del perfil</label>
                                <input value={socialTiktokUrl} onChange={(e) => setSocialTiktokUrl(e.target.value)} className={inputClass} placeholder="https://tiktok.com/@tuusuario" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>YouTube — URL del canal</label>
                                <input value={socialYoutubeUrl} onChange={(e) => setSocialYoutubeUrl(e.target.value)} className={inputClass} placeholder="https://youtube.com/@tucanal" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Otra red — Nombre / Etiqueta</label>
                                <input value={socialOtraEtiqueta} onChange={(e) => setSocialOtraEtiqueta(e.target.value)} className={inputClass} placeholder="Ej: Threads, Pinterest..." />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className={labelClass}>Otra red — URL del perfil</label>
                                <input value={socialOtraUrl} onChange={(e) => setSocialOtraUrl(e.target.value)} className={inputClass} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón guardar */}
                <div className="flex justify-end pb-4">
                    <ButtonDinamic
                        onClick={guardarDatosEmpresa}
                        className="rounded-xl bg-[#6E56CF] text-white shadow-sm hover:bg-[#5B47B0] transition-colors"
                    >
                        {cargando ? "Guardando..." : "Guardar todos los datos"}
                    </ButtonDinamic>
                </div>

            </div>
        </div>
    );
}
