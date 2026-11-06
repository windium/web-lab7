import { useEffect, useState } from "react";

function readValue(key, initialValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch {
    // missing storage or broken JSON -> fall back to the default
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  // lazy initializer so localStorage is only read on the first render
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage can be full or disabled, the app still works without it
    }
  }, [key, value]);

  return [value, setValue];
}
