import axios from "axios";

/*
 * No base URL means "same origin": the app calls /api and the host rewrites
 * that to the API server (see vercel.json for production, setupProxy.js for
 * the dev server). Same origin is what keeps the session cookie first-party,
 * and therefore what keeps it working in browsers that block third-party
 * cookies. Setting REACT_APP_BACKEND_URL points straight at another domain
 * instead, which needs COOKIE_SAMESITE=none on the API.
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

    // /me and /login answer 401 to say "not signed in", which is an answer,
    // not an expiry. Treating those as a session drop would loop.
    const isAuthProbe = url.endsWith("/me") || url.endsWith("/login");

    if (status === 401 && !isAuthProbe && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

/** Pull the most useful message out of an axios error. */
export const errorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

export default axiosInstance;
