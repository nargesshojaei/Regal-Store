// ذخیره کاربر فروشگاه روی json-server
// سرور: http://localhost:3001
// داده داخل db.json و آرایه users می‌نشیند
// اجرا: npm run server

const JSON_SERVER = "http://localhost:3001";

export type UserInfo = {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

// بدنه درخواست. id را خود سرور می‌سازد.
function userBody(user: UserInfo) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
  };
}

async function readJson(response: Response) {
  if (!response.ok) {
    throw new Error("درخواست json-server ناموفق بود");
  }
  return response.json();
}

// کاربر را با شماره موبایل پیدا می‌کند. اگر نباشد null برمی‌گردد.
// همه کاربران را می‌گیریم و خودمان مقایسه می‌کنیم،
// چون json-server شماره را عدد حساب می‌کند و صفر اول را حذف می‌کند.
export async function findUserByPhone(phone: string): Promise<UserInfo | null> {
  const response = await fetch(`${JSON_SERVER}/users`);
  const list = await readJson(response);

  if (!Array.isArray(list)) return null;

  const cleanPhone = phone.trim();
  for (let i = 0; i < list.length; i++) {
    const user = list[i] as UserInfo;
    if (String(user.phone) === cleanPhone) return user;
  }

  return null;
}

// کاربر جدید: POST /users
export async function createUser(user: UserInfo): Promise<UserInfo> {
  const response = await fetch(`${JSON_SERVER}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userBody(user)),
  });

  return readJson(response);
}

// ویرایش کاربر قبلی: PATCH /users/:id
export async function updateUser(user: UserInfo): Promise<UserInfo> {
  let id = user.id;

  // اگر id نداریم، با شماره موبایل همان رکورد را پیدا می‌کنیم
  if (!id) {
    const found = await findUserByPhone(user.phone);
    id = found?.id;
  }

  if (!id) return createUser(user);

  const response = await fetch(`${JSON_SERVER}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userBody(user)),
  });

  return readJson(response);
}

// ورود: اگر این شماره قبلاً ثبت شده باشد همان را برمی‌گرداند، وگرنه می‌سازد
export async function loginUser(phone: string): Promise<UserInfo> {
  const found = await findUserByPhone(phone);
  if (found) return found;

  return createUser({
    firstName: "",
    lastName: "",
    phone,
    email: "",
  });
}
