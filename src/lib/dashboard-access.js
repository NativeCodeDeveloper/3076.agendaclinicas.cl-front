const DASHBOARD_ROLES = [
  "default",
  "admin",
  "recepcionista",
  "secretaria",
  "basico",
  "centro-estetico",
  "clinico-medico",
  "odontologico",
  "oftalmologia",
  "agenda",
  "configuracion",
];

const DASHBOARD_ROLE_SET = new Set(DASHBOARD_ROLES);

const routeMatchersByRole = {
  recepcionista: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/agendaCitas$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/paciente\/[^/]+$/,
  ],
  secretaria: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/agendaCitas$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/paciente\/[^/]+$/,
  ],
  basico: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
  ],
  "centro-estetico": [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/categoriasProductos$/,
  ],
  "clinico-medico": [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/examenDocumento$/,
  ],
  odontologico: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/examenDocumento$/,
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/categoriasProductos$/,
  ],
  oftalmologia: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/examenDocumento$/,
    /^\/dashboard\/recetaLentes$/,
  ],
  agenda: [
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/agendaCitas$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
  ],
  configuracion: [
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/fichasClinicasPlantillas$/,
    /^\/dashboard\/fichasClinicasCategorias\/[^/]+$/,
    /^\/dashboard\/fichaCampo\/[^/]+$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/categoriasProductos$/,
    /^\/dashboard\/subCategorias\/[^/]+$/,
    /^\/dashboard\/subsubcategoria\/[^/]+$/,
    /^\/dashboard\/EspecificacionProductos\/[^/]+$/,
    /^\/dashboard\/examenesClinicos$/,
  ],
};

const DASHBOARD_NAV_SECTIONS = [
  {
    id: "principal",
    title: "Principal",
    items: [
      { label: "Panel de Citas", href: "/dashboard", icon: "home" },
    ],
  },
  {
    id: "agenda",
    title: "Agenda",
    accordionLabel: "Agenda Clinica",
    icon: "calendar",
    items: [
      { label: "Calendario General", href: "/dashboard/calendarioGeneral", icon: "panels" },
      { label: "Calendario y Reservas", href: "/dashboard/calendario", icon: "calendarDays" },
      { label: "Estado de Reservaciones", href: "/dashboard/agendaCitas", icon: "clipboard" },
      { label: "Bloqueos", href: "/dashboard/bloqueosAgenda", icon: "lock" },
    ],
  },
  {
    id: "pacientes",
    title: "Pacientes",
    accordionLabel: "Pacientes",
    icon: "users",
    items: [
      { label: "Listado de Pacientes", href: "/dashboard/listaPacientes", icon: "users" },
      { label: "Registrar Paciente", href: "/dashboard/GestionPaciente", icon: "users" },
      { label: "Carpeta del Paciente", href: "/dashboard/FichaClinica", icon: "fileText" },
    ],
  },
  {
    id: "documentos",
    title: "Documentos",
    accordionLabel: "Documentos Clinicos",
    icon: "document",
    items: [
      { label: "Receta Medica", href: "/dashboard/recetaRapida", icon: "fileText" },
      { label: "Receta de Lentes", href: "/dashboard/recetaLentes", icon: "fileText" },
      { label: "Solicitar Examenes", href: "/dashboard/examenDocumento", icon: "fileText" },
    ],
  },
  {
    id: "presupuestos",
    title: "Presupuestos",
    accordionLabel: "Presupuestos",
    icon: "budget",
    items: [
      { label: "Generar Presupuesto", href: "/dashboard/presupuestoTratamiento", icon: "budget" },
      { label: "Tratamientos Disponibles", href: "/dashboard/ingresoProductos", icon: "budget" },
      { label: "Categorias", href: "/dashboard/categoriasProductos", icon: "budget" },
    ],
  },
  {
    id: "configuracion",
    title: "Configuracion",
    accordionLabel: "Agenda y Servicios",
    icon: "settings",
    items: [
      { label: "Profesionales", href: "/dashboard/profesionales", icon: "settings" },
      { label: "Catalogo de Servicios", href: "/dashboard/serviciosAgendamiento", icon: "settings" },
      { label: "Tarifas por Profesional", href: "/dashboard/tarifaServicio", icon: "settings" },
    ],
  },
  {
    id: "plantillas",
    title: "Plantillas",
    accordionLabel: "Plantillas y Examenes",
    icon: "folder",
    items: [
      { label: "Modelos de Fichas", href: "/dashboard/fichasClinicasPlantillas", icon: "folder" },
      { label: "Examenes Clinicos", href: "/dashboard/examenesClinicos", icon: "folder" },
    ],
  },
  {
    id: "contenido",
    title: "Contenido",
    accordionLabel: "Contenido Web",
    icon: "image",
    items: [
      { label: "Carrusel de Portada", href: "/dashboard/portadaEdit", icon: "monitor" },
      { label: "Carrusel Seccion 1", href: "/dashboard/publicacionesTituloDescripcion", icon: "image" },
      { label: "Carrusel Seccion 2", href: "/dashboard/publicaciones", icon: "layout" },
    ],
  },
];

function normalizeDashboardRole(input) {
  const raw = String(input || "").trim().toLowerCase();

  if (!raw) {
    return "default";
  }

  if (raw === "default" || raw === "admin") {
    return "admin";
  }

  return DASHBOARD_ROLE_SET.has(raw) ? raw : "unknown";
}

function hasFullDashboardAccess(role) {
  const normalizedRole = normalizeDashboardRole(role);
  return normalizedRole === "admin" || normalizedRole === "default";
}

function canAccessDashboardPath(role, pathname) {
  if (!pathname?.startsWith("/dashboard")) {
    return true;
  }

  if (hasFullDashboardAccess(role)) {
    return true;
  }

  const normalizedRole = normalizeDashboardRole(role);
  const matchers = routeMatchersByRole[normalizedRole] || [];
  return matchers.some((matcher) => matcher.test(pathname));
}

function getVisibleDashboardSections(role) {
  return DASHBOARD_NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessDashboardPath(role, item.href)),
    }))
    .filter((section) => section.items.length > 0);
}

function getRoleFromClerkData(source) {
  return (
    source?.metadata?.role ||
    source?.publicMetadata?.role ||
    source?.public_metadata?.role ||
    source?.unsafeMetadata?.role ||
    source?.unsafe_metadata?.role ||
    source?.publicMetadata?.rol ||
    source?.public_metadata?.rol ||
    source?.unsafeMetadata?.rol ||
    source?.unsafe_metadata?.rol ||
    null
  );
}

function getDashboardRoleFromClaims(claims) {
  return normalizeDashboardRole(getRoleFromClerkData(claims));
}

function getDashboardRoleFromUser(user) {
  return normalizeDashboardRole(getRoleFromClerkData(user));
}

function canAccessOdontograma(role) {
  return hasFullDashboardAccess(role) || normalizeDashboardRole(role) === "odontologico";
}

function canAccessRecetasEnFicha(role) {
  const normalizedRole = normalizeDashboardRole(role);
  return hasFullDashboardAccess(role) || ["clinico-medico", "odontologico", "oftalmologia", "agenda"].includes(normalizedRole);
}

export {
  DASHBOARD_NAV_SECTIONS,
  DASHBOARD_ROLES,
  canAccessDashboardPath,
  canAccessOdontograma,
  canAccessRecetasEnFicha,
  getDashboardRoleFromClaims,
  getDashboardRoleFromUser,
  getVisibleDashboardSections,
  hasFullDashboardAccess,
  normalizeDashboardRole,
  routeMatchersByRole,
};
