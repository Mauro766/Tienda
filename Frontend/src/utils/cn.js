import { clsx } from "clsx";

/**
 * Utilidad para combinar clases de forma segura.
 */
export function cn(...inputs) {
  return clsx(inputs);
}
