import { z } from "zod";
// اعتبارسنجی نام کاربری و رمز
// اعتبارسنجی سمت فرانت؛ کاربر واقعی در db.json سرور (admin / admin) است.
export const adminLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, "نام کاربری باید حداقل ۴ کاراکتر باشد.")
    .max(20, "نام کاربری حداکثر ۲۰ کاراکتر باشد."),
  password: z
    .string()
    .min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد.")
    .max(20, "رمز عبور حداکثر ۲۰ کاراکتر باشد."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
