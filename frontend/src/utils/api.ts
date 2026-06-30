const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

interface RequestOptions extends RequestInit {
  json?: any;
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.json) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.json);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, json?: any, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: "POST", json }),
  put: (endpoint: string, json?: any, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: "PUT", json }),
  delete: (endpoint: string, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: "DELETE" }),
  
  upload: async (endpoint: string, file: File) => {
    const token = getAuthToken();
    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "File upload failed");
    }
    
    return response.json();
  }
};
