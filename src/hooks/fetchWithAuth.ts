export async function fetchWithAuth(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    // Don't redirect for login endpoint - let the form handle the error
    if (typeof window !== "undefined" && !url.includes("/api/auth/login")) {
      window.location.href = "/login";
    }
    // Try to parse error body as JSON to preserve the original error message
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = null;
    }
    if (errorBody && typeof errorBody === "object" && errorBody.error) {
      throw { ...errorBody, status: res.status };
    } else if (errorBody && typeof errorBody === "object") {
      throw { error: JSON.stringify(errorBody), status: res.status };
    } else {
      throw { error: "Unauthorized", status: res.status };
    }
  }
  if (!res.ok) {
    // Try to parse error body as JSON
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = null;
    }
    if (errorBody && typeof errorBody === "object" && errorBody.error) {
      throw { ...errorBody, status: res.status };
    } else if (errorBody && typeof errorBody === "object") {
      throw { error: JSON.stringify(errorBody), status: res.status };
    } else {
      const text = await res.text();
      throw { error: "Fetch error", status: res.status, message: text };
    }
  }
  return res.json();
}
