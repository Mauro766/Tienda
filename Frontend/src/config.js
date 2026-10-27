
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8081"
).replace(/\/+$/, "");

export const API_BASE_URL = API_URL;

export const formatImageUrl = (url, fallback = "/Campera.jpg") => {
  if (!url) return fallback;
  const raw = Array.isArray(url) ? url[0] : url;
  if (typeof raw !== "string" || !raw) return fallback;
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("blob:") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }
  const cleanPath = raw.startsWith("/") ? raw : `/uploads/${raw}`;
  return `${API_URL}${cleanPath}`;
};

export const getImageUrl = formatImageUrl;
