import SearchList from "@/features/search/SearchList";

// آیکون جستجو در هدر به همین صفحه می‌رود: /search
export default function SearchPage() {
  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <SearchList />
    </div>
  );
}
