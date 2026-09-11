import axios from "axios";

/*
 * No base URL means "same origin": the app calls /api and the host rewrites
 * that to the API server (see vercel.json for production, setupProxy.js for
 * the dev server). Same origin is what keeps the session cookie first-party,
 * and therefore what keeps it working in browsers that block third-party
 * cookies.
 *
 * The API serves that /api prefix itself, so the path is the same on both
 * sides of the rewrite. Setting REACT_APP_BACKEND_URL points straight at
 * another domain instead and must include the prefix —
 * https://api.example.com/api — and needs COOKIE_SAMESITE=none on the API.
 */
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "/api",
  // The session is an httpOnly cookie now — nothing here can read it, so the
  // browser has to be told to send it.
  withCredentials: true,
});

/*
 * A dead session is handled once, centrally, by whoever owns the auth state,
 * rather than by every page surfacing its own "Unauthorized" toast. The old
 * code reached for window.location here, which threw away React state and
 * reloaded the whole bundle to show a login form.
 */
let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // /auth/me and /auth/login answer 401 to say "not signed in", which is an
    // answer, not an expiry. Treating those as a session drop would loop.
    const isAuthProbe = url.endsWith("/auth/me") || url.endsWith("/auth/login");

    if (status === 401 && !isAuthProbe && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

/*
 * Pull the most useful message out of an axios error.
 *
 * The API's own wording comes first. After that it is the caller's fallback,
 * never error.message: on a failed request that property holds axios's
 * internal wording — "Network Error", "Request failed with status code 500" —
 * which reads as a stack trace leaking into the UI and says nothing the
 * caller's own sentence does not say better.
 *
 * The one thing worth saying over the fallback is that the request never
 * arrived, because that is the case where trying again might work and where
 * "Could not save the bill" would otherwise imply the server refused it.
 */
const NO_REPLY = "Cannot reach the server — check your connection.";
const TOO_SLOW = "The server took too long to respond. Try again.";

export const errorMessage = (error, fallback = "Something went wrong") => {
  const fromServer = error?.response?.data?.message;
  if (fromServer) return fromServer;

  // No response and no status: the request died in transit. Anything else
  // reaching here — a server that answered without a message of its own, or a
  // plain Error from a caller's try block — belongs to the fallback.
  if (error?.isAxiosError && !error.response) {
    return error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
      ? TOO_SLOW
      : NO_REPLY;
  }

  return fallback;
};

export default axiosInstance;
