import { useEffect, useState } from "react";

interface UseDebounceProperties {
  delay?: number;
  initialValue?: string;
}

export function useDebounce({
  delay = 300,
  initialValue = "",
}: UseDebounceProperties = {}) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    setValue,
    value: debouncedValue,
  };
}
