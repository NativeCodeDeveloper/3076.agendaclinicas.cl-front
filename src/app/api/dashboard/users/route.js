import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  canAccessDashboardPath,
  getAssignableDashboardRoles,
  getDashboardRoleFromClaims,
  normalizeDashboardRole,
} from "@/lib/dashboard-access";

const ASSIGNABLE_ROLE_SET = new Set(getAssignableDashboardRoles().map((role) => role.value));

function badRequest(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return badRequest("Debes iniciar sesion para crear usuarios.", 401);
  }

  const requesterRole = getDashboardRoleFromClaims(sessionClaims);

  if (!canAccessDashboardPath(requesterRole, "/dashboard/createUser")) {
    return badRequest("No tienes permisos para crear usuarios.", 403);
  }

  let body;

  try {
    body = await req.json();
  } catch {
    return badRequest("No se pudo leer el formulario enviado.");
  }

  const firstName = String(body?.firstName || "").trim();
  const lastName = String(body?.lastName || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const role = normalizeDashboardRole(body?.role);

  if (!firstName) {
    return badRequest("Debes ingresar el nombre.");
  }

  if (!lastName) {
    return badRequest("Debes ingresar el apellido.");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Debes ingresar un correo valido.");
  }

  if (password.length < 8) {
    return badRequest("La contrasena debe tener al menos 8 caracteres.");
  }

  if (!ASSIGNABLE_ROLE_SET.has(role)) {
    return badRequest("El perfil seleccionado no es valido.");
  }

  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password,
      publicMetadata: {
        role,
        rol: role,
        createdByNativeCodeUserId: userId,
        createdAtNativeCode: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || email,
        firstName: user.firstName || firstName,
        lastName: user.lastName || lastName,
        role,
      },
    });
  } catch (error) {
    const clerkMessage =
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      "Clerk no pudo crear el usuario.";

    return badRequest(clerkMessage, 400);
  }
}
