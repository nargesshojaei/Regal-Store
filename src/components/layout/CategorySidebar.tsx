"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCategories, getSubs, type Category, type Sub } from "@/lib/api/categories";
import { getProducts, productPhoto } from "@/lib/api/products";
import LookImage from "@/ui/LookImage";

type PhotoItem = {
  name: string;
  href: string;
  src?: string;
};

// عکس بزرگ و دو عکس کوچک سمت چپ منو
const tallNames = ["پیراهن کوتاه", "ماکسی", "پیراهن"];
const smallTopNames = ["کت و جلیقه", "کت و ژاکت", "مجلسی"];
const smallBottomNames = ["تاپ و کراپ", "تاپ", "مجلسی"];

function findName(names: string[], cats: Category[], subList: Sub[]) {
  for (const name of names) {
    const cat = cats.find((item) => item.name === name);
    if (cat) {
      return {
        name: cat.name,
        href: `/shop?category=${cat.id}`,
        category: Number(cat.id),
        sub: undefined as number | undefined,
      };
    }

    const sub = subList.find((item) => item.name === name);
    if (sub) {
      return {
        name: sub.name,
        href: `/shop?category=${sub.category}&subcategory=${sub.id}`,
        category: Number(sub.category),
        sub: Number(sub.id),
      };
    }
  }

  return null;
}

async function loadPhoto(names: string[], cats: Category[], subList: Sub[]) {
  const found = findName(names, cats, subList);
  if (!found) return undefined;

  try {
    const result = await getProducts(1, found.category, found.sub, 1);
    const product = result.data?.[0];
    return {
      name: found.name,
      href: found.href,
      src: product ? productPhoto(product) : undefined,
    } as PhotoItem;
  } catch {
    return { name: found.name, href: found.href };
  }
}

function PhotoBox({
  photo,
  tall,
  onClose,
}: {
  photo: PhotoItem;
  tall?: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={photo.href}
      onClick={onClose}
      className={`block ${tall ? "h-full w-[190px]" : "h-[140px] w-[168px]"}`}
    >
      <LookImage src={photo.src} alt={photo.name} className="h-full w-full">
        <span className="absolute bottom-2 right-2 z-10 rounded-lg bg-black/45 px-2.5 py-1 text-xs text-white">
          {photo.name}
        </span>
      </LookImage>
    </Link>
  );
}

export default function CategorySidebar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [tallPhoto, setTallPhoto] = useState<PhotoItem | undefined>();
  const [smallTop, setSmallTop] = useState<PhotoItem | undefined>();
  const [smallBottom, setSmallBottom] = useState<PhotoItem | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const catResult = await getCategories();
        const subResult = await getSubs();
        const catList = catResult.data || [];
        const subList = subResult.data || [];

        setCategories(catList);
        setSubs(subList);

        const tall = await loadPhoto(tallNames, catList, subList);
        const top = await loadPhoto(smallTopNames, catList, subList);
        const bottom = await loadPhoto(smallBottomNames, catList, subList);

        setTallPhoto(tall);
        setSmallTop(top);
        setSmallBottom(bottom);
      } catch {
        setCategories([]);
        setSubs([]);
      }
      setLoading(false);
    }

    loadMenu();
  }, []);

  function getSubsOf(categoryId: number) {
    return subs.filter((item) => Number(item.category) === Number(categoryId));
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-11 transition-colors hover:text-primary"
      >
        دسته‌بندی‌ها
        <ChevronDown
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-x-0 top-20 bottom-0 z-40 bg-black/35 md:top-24"
            onClick={closeMenu}
          />

          <div className="fixed inset-x-0 top-20 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-white px-4 py-6 sm:px-6 md:top-24 md:px-12 md:py-10">
            {loading ? (
              <p className="text-sm text-neutral-09">در حال بارگذاری...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-neutral-09">دسته‌بندی‌ای پیدا نشد.</p>
            ) : (
              <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 xl:flex-row">
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                  {categories.map((cat, index) => (
                    <div key={`category-${cat.id}-${index}`}>
                      <Link
                        href={`/shop?category=${cat.id}`}
                        onClick={closeMenu}
                        className="flex items-center gap-2 text-sm font-semibold text-black hover:text-primary"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        {cat.name}
                      </Link>

                      <ul className="mt-3 flex flex-col">
                        {getSubsOf(cat.id).map((sub, subIndex) => (
                          <li key={`sub-${cat.id}-${sub.id}-${subIndex}`}>
                            <Link
                              href={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                              onClick={closeMenu}
                              className="block py-1 text-sm text-neutral-09 hover:text-primary"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="hidden shrink-0 items-start gap-5 xl:flex">
                  <p className="pt-1 text-sm font-semibold text-black">
                    دسته‌بندی‌های پرطرفدار
                  </p>

                  <div className="flex h-[292px] gap-3">
                    {tallPhoto ? (
                      <PhotoBox photo={tallPhoto} tall onClose={closeMenu} />
                    ) : null}

                    <div className="flex flex-col gap-3">
                      {smallTop ? (
                        <PhotoBox photo={smallTop} onClose={closeMenu} />
                      ) : null}
                      {smallBottom ? (
                        <PhotoBox photo={smallBottom} onClose={closeMenu} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
