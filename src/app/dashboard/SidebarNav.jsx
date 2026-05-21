"use client";

/**
 * SidebarNav.jsx
 * Navegación del sidebar como componente cliente.
 * Usa useState + usePathname para:
 *   1. Detectar la ruta activa y resaltar el ítem correspondiente
 *   2. Mantener abiertos los acordeones de la sección activa
 *   3. Persistir el estado de acordeones en sessionStorage para
 *      que no se cierren al navegar entre páginas del mismo layout
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import UserMenu from "./UserMenu";

// ── Mapa de rutas por acordeón ─────────────────────────────────────────────
const ACCORDION_ROUTES = {
    agenda:    ["/dashboard/calendario", "/dashboard/calendarioGeneral", "/dashboard/bloqueosAgenda"],
    pacientes: ["/dashboard/listaPacientes", "/dashboard/GestionPaciente", "/dashboard/FichaClinica"],
    documentos:["/dashboard/presupuestoTratamiento", "/dashboard/recetaRapida", "/dashboard/recetaLentes", "/dashboard/examenDocumento"],
    servicios: ["/dashboard/profesionales", "/dashboard/ingresoProductos", "/dashboard/serviciosAgendamiento", "/dashboard/tarifaServicio"],
    fichas:    ["/dashboard/fichasClinicasPlantillas", "/dashboard/categoriasProductos", "/dashboard/examenesClinicos"],
    contenido: ["/dashboard/portadaEdit", "/dashboard/publicacionesTituloDescripcion", "/dashboard/publicaciones"],
};

function getActiveAccordion(pathname) {
    for (const [key, routes] of Object.entries(ACCORDION_ROUTES)) {
        if (routes.some(r => pathname.startsWith(r))) return key;
    }
    return null;
}

// ── Iconos ──────────────────────────────────────────────────────────────────
const IcoHome = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const IcoCalendar = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const IcoPacientes = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IcoDocumentos = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
const IcoAjustes = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IcoFichas = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>;
const IcoContenido = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;

// ── Sub-componentes ──────────────────────────────────────────────────────────
function NavGroup({ label }) {
    return (
        <p className="mt-5 mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 select-none first:mt-2">
            {label}
        </p>
    );
}

function NavItem({ href, icon, label }) {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                    ? "bg-[#F3F0FF] text-[#6E56CF]"
                    : "text-slate-600 hover:bg-[#F3F0FF] hover:text-[#6E56CF]"
            }`}
        >
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-150 ${
                isActive
                    ? "bg-[#EDE9FE] text-[#6E56CF]"
                    : "bg-slate-100 text-slate-500 group-hover:bg-[#EDE9FE] group-hover:text-[#6E56CF]"
            }`}>
                {icon}
            </span>
            <span className="flex-1 leading-none">{label}</span>
        </Link>
    );
}

function SubNavItem({ href, label }) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);
    return (
        <Link
            href={href}
            className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-medium transition-all duration-150 ${
                isActive
                    ? "bg-[#EDE9FE] text-[#6E56CF]"
                    : "text-slate-500 hover:bg-[#F3F0FF] hover:text-[#6E56CF]"
            }`}
        >
            <div className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isActive ? "bg-[#6E56CF]" : "bg-slate-300 group-hover:bg-[#6E56CF]"
            }`} />
            <span className="leading-tight">{label}</span>
        </Link>
    );
}

function NavAccordion({ id, label, icon, children, openAccordions, onToggle }) {
    const isOpen = openAccordions.has(id);
    const ref = useRef(null);

    const handleToggle = () => {
        onToggle(id);
        if (!isOpen) {
            requestAnimationFrame(() => {
                ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });
        }
    };

    return (
        <div className="mt-1" ref={ref}>
            <button
                type="button"
                onClick={handleToggle}
                className={`w-full flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                    isOpen
                        ? "bg-[#F3F0FF] text-[#6E56CF]"
                        : "text-slate-600 hover:bg-[#F3F0FF] hover:text-[#6E56CF]"
                }`}
            >
                <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-150 ${
                        isOpen
                            ? "bg-[#EDE9FE] text-[#6E56CF]"
                            : "bg-slate-100 text-slate-500"
                    }`}>
                        {icon}
                    </span>
                    <span className="leading-none">{label}</span>
                </div>
                <svg
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            {isOpen && (
                <div className="mt-1 flex flex-col gap-0.5 pl-[3.25rem] pr-2 pb-1">
                    {children}
                </div>
            )}
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function SidebarNav() {
    const pathname = usePathname();

    // Inicializa solo con el acordeón activo — valor seguro para SSR (sin sessionStorage)
    const [openAccordions, setOpenAccordions] = useState(() => {
        const active = getActiveAccordion(pathname);
        return new Set(active ? [active] : ["agenda"]);
    });

    // Tras el montaje en cliente, restaura los acordeones guardados en sessionStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(sessionStorage.getItem("sidebar_open") || "[]");
            if (saved.length > 0) {
                setOpenAccordions(prev => {
                    const next = new Set(prev);
                    saved.forEach(k => next.add(k));
                    return next;
                });
            }
        } catch {}
    }, []);

    // Cuando cambia la ruta, asegura que el acordeón de la sección activa esté abierto
    useEffect(() => {
        const active = getActiveAccordion(pathname);
        if (active) {
            setOpenAccordions(prev => {
                if (prev.has(active)) return prev;
                const next = new Set(prev);
                next.add(active);
                return next;
            });
        }
    }, [pathname]);

    // Persiste cambios en sessionStorage
    function toggleAccordion(id) {
        setOpenAccordions(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            try { sessionStorage.setItem("sidebar_open", JSON.stringify([...next])); } catch {}
            return next;
        });
    }

    const accProps = { openAccordions, onToggle: toggleAccordion };

    return (
        <>
            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                <NavItem href="/dashboard" icon={IcoHome} label="Inicio" />

                {/* ══ AGENDA ══ */}
                <NavGroup label="AGENDA" />

                <NavAccordion id="agenda" label="Agenda Clínica" icon={IcoCalendar} {...accProps}>
                    <SubNavItem href="/dashboard/calendario" label="Nueva Reserva" />
                    <SubNavItem href="/dashboard/calendarioGeneral" label="Vista General" />
                    <SubNavItem href="/dashboard/bloqueosAgenda" label="Bloqueos" />
                </NavAccordion>

                {/* ══ PACIENTES ══ */}
                <NavGroup label="PACIENTES" />

                <NavAccordion id="pacientes" label="Pacientes" icon={IcoPacientes} {...accProps}>
                    <SubNavItem href="/dashboard/listaPacientes" label="Listado de Pacientes" />
                    <SubNavItem href="/dashboard/GestionPaciente" label="Registrar Paciente" />
                    <SubNavItem href="/dashboard/FichaClinica" label="Carpeta del Paciente" />
                </NavAccordion>

                {/* ══ DOCUMENTOS ══ */}
                <NavGroup label="DOCUMENTOS" />

                <NavAccordion id="documentos" label="Documentos Clínicos" icon={IcoDocumentos} {...accProps}>
                    <SubNavItem href="/dashboard/recetaRapida" label="Receta Médica" />
                    <SubNavItem href="/dashboard/recetaLentes" label="Receta de Lentes" />
                    <SubNavItem href="/dashboard/examenDocumento" label="Solicitar Exámenes" />
                </NavAccordion>


                <NavAccordion id="fichas" label="Presupuestos" icon={IcoFichas} {...accProps}>
                    <SubNavItem href="/dashboard/presupuestoTratamiento" label="Generar presupuesto" />
                    <SubNavItem href="/dashboard/ingresoProductos" label="Tratamientos Disponibles" />
                    <SubNavItem href="/dashboard/categoriasProductos" label="Categorías de Tratamientos" />
                </NavAccordion>

                {/* ══ CONFIGURACIÓN ══ */}
                <NavGroup label="CONFIGURACIÓN" />

                <NavAccordion id="servicios" label="Agenda & Servicios" icon={IcoAjustes} {...accProps}>
                    <SubNavItem href="/dashboard/profesionales" label="Profesionales" />
                    <SubNavItem href="/dashboard/serviciosAgendamiento" label="Catálogo de Servicios" />
                    <SubNavItem href="/dashboard/tarifaServicio" label="Tarifas por Profesional" />
                </NavAccordion>




                <NavAccordion id="fichas" label="Diseño de Fichas" icon={IcoFichas} {...accProps}>
                    <SubNavItem href="/dashboard/fichasClinicasPlantillas" label="Modelos de Fichas" />
                </NavAccordion>


                <NavAccordion id="fichas" label="Crear Examenes" icon={IcoFichas} {...accProps}>
                    <SubNavItem href="/dashboard/examenesClinicos" label="Exámenes Clínicos" />
                </NavAccordion>

                <NavAccordion id="contenido" label="Contenido Web" icon={IcoContenido} {...accProps}>
                    <SubNavItem href="/dashboard/portadaEdit" label="Carrusel de Portada" />
                    <SubNavItem href="/dashboard/publicacionesTituloDescripcion" label="Carrusel Sección 1" />
                    <SubNavItem href="/dashboard/publicaciones" label="Carrusel Sección 2" />
                </NavAccordion>

            </nav>

            {/* ── Footer: User Menu ── */}
            <UserMenu />
        </>
    );
}
