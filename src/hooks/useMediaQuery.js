import { useEffect, useState } from "react";

/**
 * Whether a CSS media query currently matches, kept in step as it changes.
 *
 * For the cases a stylesheet cannot reach — a prop that has to be a boolean in
 * JavaScript rather than a rule in CSS. Reach for a Tailwind breakpoint first;
 * this is for the rest.
 *
 * The first value is read during the initial state, so the first paint is
 * already correct rather than a desktop layout that corrects itself a frame
 * later.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia?.(query).matches ?? false
  );

  useEffect(() => {
    const list = window.matchMedia?.(query);
    if (!list) return undefined;

    // The query can change between renders, so re-read on the way in rather
    // than trusting the value the previous effect left behind.
    setMatches(list.matches);

    const onChange = (event) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
