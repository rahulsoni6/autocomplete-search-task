import { useState, useEffect } from "react";

const useDebounce = (searchText, delay) => {
  const [debouncedText, setDebouncedText] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText);
    }, delay);
    return () => clearTimeout(timer);
  }, [searchText, delay]);
  return debouncedText;
};

export default useDebounce;
