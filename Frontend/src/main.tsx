import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/main.css";
import { API_URL } from './config';

const originalFetch = window.fetch.bind(window);
const csrfHeaderName = "X-XSRF-TOKEN";

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const requestUrl = new URL(url, window.location.origin);
  const isBackendUrl = requestUrl.origin === new URL(API_URL).origin;

  if (!isBackendUrl) {
    return originalFetch(input, init);
  }

  const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
  const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));

  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const csrfResponse = await originalFetch(`${API_URL}/auth/csrf`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!csrfResponse.ok) {
      throw new Error(`No se pudo obtener el token CSRF (${csrfResponse.status})`);
    }

    const csrfData: { token?: string } = await csrfResponse.json();
    if (!csrfData.token) {
      throw new Error("El backend no entregó el token CSRF");
    }

    headers.set(csrfHeaderName, csrfData.token);
  }

  return originalFetch(input, {
    ...init,
    headers,
    credentials: init?.credentials ?? "include",
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
