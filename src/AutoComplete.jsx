import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

const AutoComplete = ({ fetchOptions, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedValue = useDebounce(inputValue, 300);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const query = debouncedValue.trim();

    if (!query) {
      setOptions([]);
      setIsOpen(false);
      setLoading(false);
      setError("");
      setHighlightedIndex(-1);
      return;
    }

    const requestId = ++requestIdRef.current;

    const loadOptions = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchOptions(query);

        // Ignore stale response
        if (requestId !== requestIdRef.current) {
          return;
        }

        setOptions(result);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError("Something went wrong");
        setOptions([]);
        setIsOpen(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    loadOptions();
  }, [debouncedValue, fetchOptions]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    setInputValue(option.name);
    setOptions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);

    onSelect(option);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || !options.length) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex((prev) =>
        prev === options.length - 1 ? 0 : prev + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((prev) =>
        prev <= 0 ? options.length - 1 : prev - 1
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (highlightedIndex >= 0) {
        handleSelect(options[highlightedIndex]);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div style={{ width: "300px", position: "relative" }}>
      <input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search users..."
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      {loading && <div>Searching...</div>}

      {error && <div>{error}</div>}

      {!loading && !error && isOpen && options.length === 0 && (
        <div>No results found</div>
      )}

      {isOpen && options.length > 0 && (
        <div
          role="listbox"
          style={{
            border: "1px solid #ccc",
            marginTop: "4px",
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              role="option"
              aria-selected={highlightedIndex === index}
              onMouseDown={() => handleSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                background: highlightedIndex === index ? "#eee" : "transparent",
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
