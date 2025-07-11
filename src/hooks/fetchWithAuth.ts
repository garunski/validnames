export async function fetchWithAuth(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    // Try to parse error body as JSON
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = null;
    }
    if (errorBody && typeof errorBody === "object") {
      throw { ...errorBody, status: res.status };
    } else {
      const text = await res.text();
      throw { error: "Fetch error", status: res.status, message: text };
    }
  }
  return res.json();
}
