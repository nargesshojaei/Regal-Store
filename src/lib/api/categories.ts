import { apiList } from "./client";
// دسته‌ها و زیردسته‌ها
{/*fetchCategories → GET /category
fetchSubcategories → GET /subcategory
categoryPath → متن «دسته / زیردسته» برای جدول */}
export type Category = {
  id: number;
  name: string;
  icon?: string;
};

export type Sub = {
  id: number;
  name: string;
  category: number;
};

export async function getCategories() {
  try {
    return await apiList<Category[]>("/category");
  } catch {
    return apiList<Category[]>("/categories");
  }
}

export async function getSubs() {
  try {
    return await apiList<Sub[]>("/subcategory");
  } catch {
    return apiList<Sub[]>("/subcategories");
  }
}

export function categoryName(
  categoryId?: number,
  subId?: number,
  categories: Category[] = [],
  subs: Sub[] = [],
) {
  const cat = categories.find((item) => Number(item.id) === Number(categoryId));
  const sub = subs.find((item) => Number(item.id) === Number(subId));

  if (cat && sub) return `${cat.name} / ${sub.name}`;
  return sub?.name ?? cat?.name ?? "بدون دسته‌بندی";
}
