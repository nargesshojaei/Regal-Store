# لایه API — `src/lib/api`

با `fetch` به سرور حرف می‌زنیم: `http://localhost:3002`

1. لاگین → سرور `accessToken` می‌دهد
2. توکن را در cookie ذخیره می‌کنیم
3. بعد در GET / POST همان توکن را در header `token` می‌فرستیم

## فایل‌ها

| فایل | کار |
| --- | --- |
| `client.ts` | fetch مشترک، هدر `token`، آدرس عکس |
| `auth.ts` | `POST /auth/login` |
| `orders.ts` | سفارش‌ها: لیست، جزئیات، ثبت تحویل |
| `products.ts` | کالاها: لیست با pagination/فیلتر، POST، PATCH، DELETE |
| `categories.ts` | دسته‌ها و زیردسته‌ها |
| `files.ts` | آپلود عکس کالا |
| `inventory.ts` | موجودی و قیمت (همان `/products`) |

## لاگین

```ts
const result = await loginRequest("admin", "admin");
cookies().set("regal-access-token", result.accessToken);
redirect("/admin");
```

## بعد از لاگین

```ts
getOrders(1, false, "desc");
getProducts(1, 2); // صفحه ۱، دسته ۲
addProduct({ name: "پیراهن", price: 1200000, quantity: 5 });
saveInventory(1, 1500000, 8);
setOrderDelivered(1);
```

یوزر تست: `admin` / `admin`
