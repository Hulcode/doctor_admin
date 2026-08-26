import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_authenticated")?.value === "true";
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
  return authenticated;
}
