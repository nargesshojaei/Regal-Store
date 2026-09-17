import { getApiUrl } from "./client";
// لاگین و گرفتن accessToken
// لاگین با fetch. اگر درست باشد accessToken برمی‌گردد.
export async function loginRequest(username: string, password: string) {
  try {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return { error: "نام کاربری یا رمز عبور نادرست است." };
    }

    const data = await response.json();

    if (!data.accessToken) {
      return { error: "توکن از سرور نیامد." };
    }

    return { accessToken: data.accessToken as string };
  } catch {
    return { error: "سرور روی پورت ۳۰۰۲ روشن نیست." };
  }
}
