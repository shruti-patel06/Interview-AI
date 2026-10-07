import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, //option to send cookies or authentication headers in cross-origin requests.
});

/**
 * @description Extracts the backend's error message from an axios error, falling back to a generic one.
 */
export async function getErrorMessage(error, fallback) {
  let data = error?.response?.data;

  // Blob responses (e.g. the resume PDF download) carry their JSON error as a Blob.
  if (data instanceof Blob) {
    try {
      data = JSON.parse(await data.text());
    } catch {
      data = null;
    }
  }

  return data?.message?.trim() || fallback;
}
