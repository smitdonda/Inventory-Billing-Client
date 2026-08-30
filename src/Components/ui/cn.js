/** Join class names, dropping falsy entries. */
const cn = (...parts) => parts.filter(Boolean).join(" ");

export default cn;
