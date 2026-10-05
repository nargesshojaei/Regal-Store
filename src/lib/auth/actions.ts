"use server";
//ورود و خروج (Server Action)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginRequest } from "@/lib/api/auth";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "./access-token";
import { adminLoginSchema } from "./admin-login-schema";

export async function loginAdmin(input: {
  username: string;
  password: string;
}) {
  const parsed = adminLoginSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است." };
  }

  const result = await loginRequest(parsed.data.username, parsed.data.password);

  if ("error" in result) {
    return { error: result.error };
  }

  const store = await cookies();
  store.set(ADMIN_ACCESS_TOKEN_COOKIE, result.accessToken, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_ACCESS_TOKEN_COOKIE);
  redirect("/admin/login");
}
