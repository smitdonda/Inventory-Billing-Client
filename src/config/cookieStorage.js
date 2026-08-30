import Cookies from "js-cookie";

/*
 * `secure` is conditional because the dev server runs on plain http — a
 * secure cookie there would be dropped and nothing could sign in.
 * `sameSite: strict` keeps the token off cross-site requests entirely.
 */
const attributes = () => ({
  sameSite: "strict",
  secure: window.location.protocol === "https:",
  path: "/",
});

const getItem = (key) => {
  const data = Cookies.get(key);
  if (data === undefined) return undefined;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const setItem = (key, value, option = {}) => {
  const raw = typeof value === "string" ? value : JSON.stringify(value);

  if (option.expires != null && !(option.expires instanceof Date)) {
    throw new Error("The 'expires' option must be a Date.");
  }

  Cookies.set(key, raw, {
    ...attributes(),
    ...(option.expires ? { expires: option.expires } : {}),
  });
};

// Removal only matches on path and domain, but pass the same attributes so
// the call stays correct if a domain is ever added above.
const removeItem = (key) => Cookies.remove(key, attributes());

export { getItem, setItem, removeItem };
