"use client";
//لیست کالا با فیلتر دسته، افزودن، ویرایش، حذف و صفحه‌بندی است.
{/* قلب صفحه مدیریت کالا.

از سرور لیست کالا می‌گیرد: GET /products?_page=1&_limit=5
فیلتر دسته را هم به سرور می‌فرستد: ?category=2
ستون‌ها جدا هستند: تصویر | نام کالا | دسته‌بندی | ویرایش/حذف
دکمه «افزودن کالا» مودال خالی باز می‌کند
«ویرایش» همان مودال را با داده آن کالا باز می‌کند
«حذف» دیالوگ تأیید را باز می‌کند
صفحه‌بندی ۵ تایی؛ اگر صفحه خالی شود یک صفحه عقب می‌رود
حالت‌ها: در حال بارگذاری، خطا، لیست خالی، داده*/
}
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryName, getCategories, getSubs } from "@/lib/api/categories";
import { getProducts, PAGE_SIZE, type Product } from "@/lib/api/products";
import { nameList } from "@/lib/variants";
import Pagination from "@/ui/Pagination";
import ProductPhoto from "@/ui/ProductPhoto";
import { ColorList, SizeList } from "@/ui/VariantText";
import ProductDeleteDialog from "./ProductDeleteDialog";
import ProductFormModal from "./ProductFormModal";

export default function ProductTable() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const categoryId = category ? Number(category) : undefined;

  useEffect(() => {
    setReady(true);
  }, []);

  const list = useQuery({
    queryKey: ["admin-products", page, categoryId],
    queryFn: () => getProducts(page, categoryId),
    enabled: ready,
  });

  const cats = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await getCategories()).data,
    enabled: ready,
  });

  const subs = useQuery({
    queryKey: ["admin-subcategories"],
    queryFn: async () => {
      try {
        return (await getSubs()).data;
      } catch {
        return [];
      }
    },
    enabled: ready,
  });

  const products = list.data?.data ?? [];
  const total = list.data?.total ?? 0;
  const categories = cats.data ?? [];
  const subList = subs.data ?? [];
  const loading = !ready || list.isPending;

  useEffect(() => {
    if (!loading && products.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [loading, products.length, page]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-black">مدیریت کالاها</h1>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex w-full items-center gap-2 text-sm text-neutral-11 sm:w-auto">
            دسته‌بندی
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-10 min-w-0 flex-1 rounded-lg border border-neutral-03 bg-white px-3 text-sm text-black outline-none focus:border-primary sm:w-44 sm:flex-none"
            >
              <option value="">همه</option>
              {categories.map((item, index) => (
                <option key={`category-${item.id}-${index}`} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
          >
            افزودن کالا
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-13 bg-white">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-neutral-03 text-neutral-11">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تصویر</th>
              <th className="px-4 py-3 text-right font-medium">نام کالا</th>
              <th className="px-4 py-3 text-right font-medium">دسته‌بندی</th>
              <th className="px-4 py-3 text-right font-medium">رنگ</th>
              <th className="px-4 py-3 text-right font-medium">سایز</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                ویرایش/حذف
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-09">
                  در حال بارگذاری کالاها...
                </td>
              </tr>
            ) : list.isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-neutral-09">دریافت کالاها با خطا مواجه شد.</p>
                  <button
                    type="button"
                    onClick={() => list.refetch()}
                    className="mt-3 text-sm text-primary underline"
                  >
                    تلاش دوباره
                  </button>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-09">
                  {categoryId
                    ? "کالایی در این دسته‌بندی نیست."
                    : "کالایی ثبت نشده است. از «افزودن کالا» شروع کنید."}
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                  <tr
                    key={`product-${page}-${index}-${item.id}`}
                    className={index % 2 === 1 ? "bg-neutral-01" : "bg-white"}
                  >
                    <td className="px-4 py-3">
                      <ProductPhoto product={item} alt={item.name} />
                    </td>
                    <td className="px-4 py-3 font-medium text-black">{item.name}</td>
                    <td className="px-4 py-3 text-neutral-11">
                      {categoryName(
                        item.category,
                        item.subcategory,
                        categories,
                        subList,
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-11">
                      <ColorList names={nameList(item.color)} />
                    </td>
                    <td className="px-4 py-3 text-neutral-11">
                      <SizeList names={nameList(item.size)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditItem(item);
                            setShowForm(true);
                          }}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          onClick={() => setToDelete(item)}
                          className="text-red-600 underline-offset-4 hover:underline"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-08">
        <span>{total} کالا</span>
        <span>{list.isFetching && !loading ? "در حال به‌روزرسانی..." : null}</span>
      </div>

      <Pagination page={page} total={total} limit={PAGE_SIZE} onPageChange={setPage} />

      <ProductFormModal
        open={showForm}
        product={editItem}
        categories={categories}
        subs={subList}
        onClose={() => {
          setShowForm(false);
          setEditItem(null);
        }}
      />

      <ProductDeleteDialog
        product={toDelete}
        categoryLabel={
          toDelete
            ? categoryName(toDelete.category, toDelete.subcategory, categories, subList)
            : ""
        }
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
