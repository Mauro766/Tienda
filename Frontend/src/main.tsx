import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/main.css";

const originalFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const isBackendUrl =
    url.startsWith("http://localhost:8081") || url.startsWith("http://127.0.0.1:8081");

  if (!isBackendUrl) {
    return originalFetch(input, init);
  }

  return originalFetch(input, {
    ...init,
    credentials: init?.credentials || "include",
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
