/**
 * Utility to get the normalized API base URL.
 * Ensures the trailing `/api/v1` is present regardless of whether the user
 * configured NEXT_PUBLIC_API_URL as:
 *  - "https://nbites-api-server.onrender.com"
 *  - "https://nbites-api-server.onrender.com/"
 *  - "https://nbites-api-server.onrender.com/api/v1"
 */
export function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // If missing protocol, prepend https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // If the user entered the root host without /api/v1, append it
  if (!url.endsWith('/api/v1') && !url.endsWith('/api')) {
    url = `${url}/api/v1`;
  }

  return url;
}
