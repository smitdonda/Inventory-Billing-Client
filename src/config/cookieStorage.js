import Cookies from "js-cookie";

const getItem = (key) => {
  const data = Cookies.get(key);
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

const setItem = (key, value, option) => {
  const stringify = typeof value !== "string" ? JSON.stringify(value) : value;

  // Check if the key is "token" and handle the expires option accordingly
  if (key === "token" && option && option.expires) {
    // Ensure that option.expires is a Date object
    if (!(option.expires instanceof Date)) {
      throw new Error("The 'expires' option must be a Date.");
    }
    Cookies.set(key, stringify, { expires: option.expires });
  } else {
    Cookies.set(key, stringify);
  }
};

const removeItem = (key) => {
  Cookies.remove(key);
};

export { getItem, setItem, removeItem };
