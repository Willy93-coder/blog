const useAppUrl = () => {
  const config = useRuntimeConfig();

  // Base URL
  const base = String(config.public.siteUrl || "").replace(/\/$/, "");

  // Helper
  const join = (path: string, query?: Record<string, string>) => {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, base);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  };

  return {
    base,

    // Absolute studio URL with optional query
    absoluteStudio: (query?: { toast?: string }) => join("/studio", query),
  };
};

export { useAppUrl };
