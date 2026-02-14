const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "API error");
  return data;
};
