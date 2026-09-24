export function unsplash(id: string, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

// لینک عکس Unsplash را با عرض دلخواه می‌سازد.