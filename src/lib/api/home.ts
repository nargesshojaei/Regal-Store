import { getCategories, getSubs, type Category, type Sub } from "./categories";
import { getProducts, productPhoto, productPhotoUrls, type Product } from "./products";
import type { Product as CardProduct, ProductColor } from "@/types/product";
import type { Category as CardCategory } from "@/types";
import { colorHex, nameList } from "@/lib/variants";

export { colorHex };

function colorsOf(product: Product): ProductColor[] {
  return nameList(product.color).map((name) => ({
    name,
    hex: colorHex(name),
  }));
}

export function toCardProduct(product: Product): CardProduct {
  const discount = product.discount || 0;
  const originalPrice =
    discount > 0 ? Math.round(product.price / (1 - discount / 100)) : undefined;

  return {
    id: String(product.id),
    name: product.name,
    category: String(product.category ?? ""),
    price: product.price,
    originalPrice,
    discountPercent: discount || undefined,
    stock: product.quantity,
    image: productPhoto(product) || "",
    description: product.description || "",
    colors: colorsOf(product),
    sizes: nameList(product.size),
  };
}

export type ShopItem = CardProduct & {
  sizes: string[];
  quantity: number;
  createdAt: number;
  colorNames: string[];
  subcategoryId?: number;
};

export function toShopItem(product: Product): ShopItem {
  return {
    ...toCardProduct(product),
    sizes: nameList(product.size),
    quantity: product.quantity,
    createdAt: product.createdAt || 0,
    colorNames: nameList(product.color),
    subcategoryId: product.subcategory,
  };
}

export type HomeLook = {
  alt: string;
  src: string;
  featured?: boolean;
};

// یک ردیف دسته در صفحه خانه: عنوان و حداکثر چهار کالا
export type FeaturedGroup = {
  title: string;
  products: CardProduct[];
};

export type HomeCatalog = {
  heroLooks: HomeLook[];
  heroFeatured?: HomeLook;
  categories: CardCategory[];
  bodyLooks: HomeLook[];
  discountProducts: CardProduct[];
  featuredGroups: FeaturedGroup[];
  brandLook: HomeLook;
  blogImages: string[];
  testimonialAvatars: string[];
};

function withPhoto(products: Product[]) {
  return products.filter((item) => productPhoto(item));
}

export function productPhotos(product: Product) {
  return productPhotoUrls(product);
}

// داده کامل صفحه جزئیات: عکس‌ها + اسم دسته و زیردسته
export type DetailProduct = ShopItem & {
  photos: string[];
  categoryName: string;
  subcategoryName: string;
  categoryId?: number;
};

export function toDetailProduct(
  product: Product,
  categories: Category[],
  subs: Sub[],
): DetailProduct {
  const cat = categories.find((item) => Number(item.id) === Number(product.category));
  const sub = subs.find((item) => Number(item.id) === Number(product.subcategory));

  return {
    ...toShopItem(product),
    photos: productPhotos(product),
    categoryName: cat?.name?.trim() || "",
    subcategoryName: sub?.name?.trim() || "",
    categoryId: product.category,
  };
}

function looksFrom(products: Product[]): HomeLook[] {
  return products.flatMap((product) =>
    productPhotos(product).map((src) => ({
      alt: product.name,
      src,
    })),
  );
}

// همه عکس‌های صفحه اصلی از JSON سرور می‌آیند (فایل کالاها).
export async function getHomeCatalog(): Promise<HomeCatalog> {
  let products: Product[] = [];
  let categories: Category[] = [];
  let subs: Sub[] = [];
  let eveningProducts: Product[] = [];
  let blouseProducts: Product[] = [];
  let shortDressProducts: Product[] = [];

  try {
    const [
      productResult,
      categoryResult,
      subResult,
      eveningResult,
      blouseResult,
      shortDressResult,
    ] = await Promise.all([
      getProducts(1, undefined, undefined, 80),
      getCategories(),
      getSubs(),
      getProducts(1, 1, 1, 12),
      getProducts(1, 2, undefined, 12),
      getProducts(1, 5, undefined, 12),
    ]);
    products = productResult.data || [];
    categories = categoryResult.data || [];
    subs = subResult.data || [];
    eveningProducts = eveningResult.data || [];
    blouseProducts = blouseResult.data || [];
    shortDressProducts = shortDressResult.data || [];

    const eveningPhotos = eveningProducts;
    for (const item of eveningPhotos) {
      if (!products.some((product) => product.id === item.id)) {
        products.push(item);
      }
    }
  } catch {
    products = [];
    categories = [];
    subs = [];
  }

  // فقط کالاهایی که روی سرور عکس دارند
  const photos = withPhoto(products);

  const categoryCards = categories.map((category) => {
    const sample =
      photos.find((item) => Number(item.category) === Number(category.id)) ||
      photos[0];
    const firstSub = subs.find(
      (item) => Number(item.category) === Number(category.id),
    );

    return {
      id: String(category.id),
      name: category.name.trim(),
      subtitle: firstSub?.name,
      href: `/shop?category=${category.id}`,
      image: productPhoto(sample) || "",
    };
  });

  // عکس هیرو، فرم بدن، بلاگ و نظرات همه از همین لیست کالا می‌آیند
  const dresses = photos.filter((item) => Number(item.category) === 1);
  const eveningDresses = photos.filter(
    (item) => Number(item.category) === 1 && Number(item.subcategory) === 1,
  );
  const eveningLooks = looksFrom(eveningDresses);
  const dressLooks = looksFrom(dresses);
  const heroLooksAll = eveningLooks.length >= 4 ? eveningLooks : dressLooks;

  const bodySource = dresses.length >= 5 ? dresses : photos;
  const bodyLooks = bodySource.slice(0, 10).map((item, index) => ({
    alt: item.name,
    src: productPhoto(item) || "",
    featured: index === 2,
  }));

  const discounted = photos
    .filter((item) => (item.discount || 0) > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 12)
    .map(toCardProduct);

  const brandProduct = photos.find((item) => item.id === 4) || photos[3] || photos[0];
  const blogSource = photos.slice(6, 9);
  const heroLooks = heroLooksAll.slice(1, 4);
  const heroFeatured = heroLooksAll[0];

  return {
    heroLooks,
    heroFeatured,
    categories: categoryCards,
    bodyLooks,
    discountProducts: discounted,
    // بالای نظرات: دسته ۵ پیراهن کوتاه و دسته ۲ شومیز
    featuredGroups: [
      {
        title: "پیراهن کوتاه",
        products: withPhoto(shortDressProducts).slice(0, 4).map(toCardProduct),
      },
      {
        title: "شومیز",
        products: withPhoto(blouseProducts).slice(0, 4).map(toCardProduct),
      },
    ],
    brandLook: {
      alt: brandProduct?.name || "رگال",
      src: productPhoto(brandProduct) || "",
    },
    blogImages: blogSource.map((item) => productPhoto(item) || ""),
    testimonialAvatars: photos.slice(1, 4).map((item) => productPhoto(item) || ""),
  };
}
