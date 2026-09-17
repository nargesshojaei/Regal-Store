import { cookies } from "next/headers";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "./access-token";
//چک می‌کند ادمین لاگین است یا نه
export { ADMIN_ACCESS_TOKEN_COOKIE };
 

// اگر cookie توکن داشته باشد، ادمین لاگین است.
export async function hasAdminSession() {
  const store = await cookies();
  return Boolean(store.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value);
}


