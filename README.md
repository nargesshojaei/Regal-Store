# رگال (Regal)

فروشگاه پوشاک زنانه با Next.js.

- **فروشگاه** برای مشتری (`/`) — پورت ۳۰۰۰
- **پنل مدیریت** برای ادمین (`/admin`) — بعد از ورود با JWT
- **API** روی [http://localhost:3002](http://localhost:3002)

توضیح کوتاه لایهٔ fetch: [`src/lib/api/README.md`](src/lib/api/README.md)

## اجرای پروژه

دو سرور باید همزمان روشن باشند.

### ۱. فرانت (Next.js)

```bash
npm install
npm run dev
```

آدرس: [http://localhost:3000](http://localhost:3000)

### ۲. بک‌اند (پورت ۳۰۰۲)

```bash
cd server
npm install
npm run backend
```

از ریشه پروژه:

```bash
npm run backend
```

اگر این سرور خاموش باشد، ورود ادمین و درخواست‌های GET/POST کار نمی‌کنند.

## ورود به پنل ادمین

یوزر تست: `admin` / `admin`

۱. در هدر فروشگاه روی آیکون داشبورد کلیک کنید.  
۲. صفحه `/admin/login` باز می‌شود.  
۳. نام کاربری و رمز را وارد کنید.  
۴. فرانت به `POST http://localhost:3002/auth/login` می‌زند و `accessToken` می‌گیرد.  
۵. توکن در کوکی ذخیره می‌شود و برای GET/POST در هدر `token` می‌رود.  
۶. بدون توکن معتبر، داشبورد به لاگین برمی‌گردد.

---

## کارهای امروز (پنل ادمین)

سه بخش پنل به JSON Server وصل شد: **کالاها**، **موجودی و قیمت**، **سفارش‌ها**. فیلتر، صفحه‌بندی و ذخیره روی بک‌اند است (`_page`، `_limit`، `category`).

### ۱. مدیریت کالاها — `/admin/products`

- لیست کالا با عکس، اسم و دسته‌بندی
- صفحه‌بندی سمت سرور: ۵ کالا در هر صفحه
- فیلتر دسته‌بندی سمت سرور: `GET /products?category=2&_page=1&_limit=5`
- افزودن / ویرایش در مودال (عکس، نام، دسته، توضیحات HTML)
- حذف کالا با تأیید
- آپلود عکس: `POST /upload`

### ۲. مدیریت موجودی و قیمت‌ها — `/admin/inventory`

- لیست کالا با عکس، قیمت و موجودی
- صفحه‌بندی سمت سرور: ۵ تا در هر صفحه
- کلیک روی قیمت یا موجودی → textbox
- `id` کالای تغییر یافته در آرایه `ids` نگه داشته می‌شود
- **ذخیره** برای هر id یک `PATCH /products/:id` جدا می‌زند
- **Escape** همان سلول را برمی‌گرداند و id را از آرایه برمی‌دارد
- اگر آرایه خالی باشد دکمه ذخیره غیرفعال است

### ۳. مدیریت سفارش‌ها — `/admin/orders`

- فیلتر در انتظار ارسال / تحویل‌شده سمت سرور
- صفحه‌بندی ۵ تایی سمت سرور
- عکس کالاهای هر سفارش در جدول
- مودال بررسی سفارش: جزئیات، سبد با عکس، ثبت اتمام تحویل

---

## هر فایل چه کار می‌کند

### صفحات پنل

| فایل | کار |
| --- | --- |
| `src/app/(admin)/admin/(dashboard)/products/page.tsx` | صفحه مدیریت کالا؛ جدول محصولات را نشان می‌دهد |
| `src/app/(admin)/admin/(dashboard)/inventory/page.tsx` | صفحه موجودی و قیمت |
| `src/app/(admin)/admin/(dashboard)/orders/page.tsx` | صفحه سفارش‌ها |
| `src/app/(admin)/admin/(dashboard)/layout.tsx` | لایه داشبورد؛ بدون توکن به لاگین می‌فرستد |
| `src/app/(admin)/admin/login/page.tsx` | صفحه ورود ادمین |

### کالاها

| فایل | کار |
| --- | --- |
| `src/features/admin/product/ProductTable.tsx` | جدول کالا + فیلتر دسته + صفحه‌بندی + دکمه‌های افزودن/ویرایش/حذف |
| `src/features/admin/product/ProductFormModal.tsx` | مودال افزودن و ویرایش؛ فرم را به POST/PATCH وصل می‌کند |
| `src/features/admin/product/HtmlEditor.tsx` | ویرایشگر ساده HTML برای فیلد توضیحات |
| `src/features/admin/product/ProductDeleteDialog.tsx` | مودال تأیید حذف؛ `DELETE /products/:id` |

### موجودی

| فایل | کار |
| --- | --- |
| `src/features/admin/inventory/InventoryTable.tsx` | جدول موجودی؛ آرایه `ids` و ذخیره چند PATCH |
| `src/features/admin/inventory/EditableCell.tsx` | سلول قابل کلیک؛ با Escape ویرایش لغو می‌شود |

### سفارش‌ها

| فایل | کار |
| --- | --- |
| `src/features/admin/order/OrderTable.tsx` | جدول سفارش با فیلتر، عکس کالا، صفحه‌بندی |
| `src/features/admin/order/OrderModal.tsx` | مودال جزئیات سفارش و ثبت تحویل |
| `src/features/admin/order/OrderStatusBadge.tsx` | نشان وضعیت سفارش (در انتظار / تحویل‌شده) |

### لایه API (`src/lib/api`)

همه به `http://localhost:3002` می‌روند. توکن لاگین در هدر `token` است.

| فایل | کار |
| --- | --- |
| `client.ts` | `fetch` مشترک، هدر توکن، ساخت آدرس عکس (`/files/:id`)، آپلود FormData |
| `auth.ts` | `POST /auth/login` و گرفتن `accessToken` |
| `products.ts` | لیست/افزودن/ویرایش/حذف کالا + pagination و فیلتر `category` |
| `categories.ts` | گرفتن دسته و زیردسته از `/category` و `/subcategory` |
| `files.ts` | آپلود عکس کالا (`POST /upload`) |
| `inventory.ts` | لیست موجودی با pagination و `PATCH` قیمت/تعداد |
| `orders.ts` | لیست/جزئیات سفارش و ثبت تحویل |
| `README.md` | توضیح خیلی سادهٔ همین پوشه |

### بقیهٔ فایل‌های مرتبط

| فایل | کار |
| --- | --- |
| `src/lib/auth/access-token.ts` | خواندن توکن از cookie مرورگر |
| `src/lib/auth/actions.ts` | Server Action ورود و خروج |
| `src/lib/format.ts` | فرمت قیمت و تاریخ فارسی |
| `src/ui/Modal.tsx` | مودال مشترک پنل |
| `src/ui/Pagination.tsx` | دکمه‌های صفحه |

---

## درخواست‌های سرور

| کار | درخواست |
| --- | --- |
| لیست کالا | `GET /products?_page=1&_limit=5&_sort=createdAt&_order=desc` |
| فیلتر دسته | `GET /products?category=2&_page=1&_limit=5` |
| افزودن کالا | `POST /products` |
| ویرایش کالا | `PATCH /products/:id` |
| حذف کالا | `DELETE /products/:id` |
| آپلود عکس | `POST /upload` |
| دسته‌ها | `GET /category` |
| زیردسته‌ها | `GET /subcategory` |
| موجودی | همان `/products` با pagination |
| ذخیره موجودی | `PATCH /products/:id` با `{ price, quantity }` |
| سفارش‌ها | `GET /orders?delivered=false&_page=1&_limit=5` |
| جزئیات سفارش | `GET /orders/:id` |
| ثبت تحویل | `PATCH /orders/:id` با `{ delivered: true }` |
| عکس فایل | `GET /files/:id` |

---

## پشته فنی

| ابزار | کاربرد |
| --- | --- |
| Next.js 16 + React 19 | فریم‌ورک و UI |
| Tailwind CSS 4 | استایل |
| Redux Toolkit + React Redux | state سراسری |
| TanStack React Query | درخواست و کش داده |
| Zod | اعتبارسنجی فرم ورود |
| json-server + JWT | API روی پورت ۳۰۰۲ |

Providerهای Redux و React Query در `src/lib/store-provider.tsx` به کل اپ وصل شده‌اند.

## مسیرهای مهم

- فروشگاه: `/`
- ورود ادمین: `/admin/login`
- داشبورد: `/admin`
- کالاها: `/admin/products`
- موجودی و قیمت: `/admin/inventory`
- سفارش‌ها: `/admin/orders`
- لایه API: `src/lib/api`
