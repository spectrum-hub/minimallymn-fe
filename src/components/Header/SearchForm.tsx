import { useEffect, useRef } from "react";
import { Search as SearchIcon, X as XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router";
import { searchFormSchema } from "../../lib/form-schemas";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

interface FormSubmit {
  searchString: string;
}

interface SearchFormProps {
  onSearch?: () => void;
}

/**
 * Zara-like search field
 * - Underline-only input, no box/rounded corners
 * - Thin line that thickens on focus
 * - Right-aligned icon buttons (clear + submit)
 * - Uppercase, wide tracking placeholder
 * - Keyboard shortcut: press "/" to focus
 */
const SearchForm = ({ onSearch }: SearchFormProps = {}) => {
  const [searchParams] = useSearchParams();
  const { historyNavigate } = useHistoryNavigate();
  const searchValue = searchParams.get("search") ?? "";

  const { control, handleSubmit, resetField, watch } = useForm<FormSubmit>({
    resolver: yupResolver(searchFormSchema),
    defaultValues: { searchString: searchValue },
    mode: "onSubmit",
  });

  const currentValue = watch("searchString", searchValue);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // "/" to focus (common ecomm shortcut)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSubmit = async (data: FormSubmit) => {
    try {
      const q = (data.searchString || "").trim();
      if (!q) {
        historyNavigate("/products");
      } else {
        historyNavigate(`/products?search=${encodeURIComponent(q)}`);
      }
      // Call the onSearch callback if provided
      onSearch?.();
    } catch (err) {
      console.log(err);
    }
  };

  const clearSearch = () => {
    resetField("searchString", { defaultValue: "" });
    historyNavigate("/products");
    inputRef.current?.focus();
    // Call the onSearch callback if provided
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="relative w-full">
        <Controller
          control={control}
          name="searchString"
          render={({ field }) => (
            <input
              {...field}
              ref={(el) => {
                field.ref(el);
                inputRef.current = el;
              }}
              type="search"
              placeholder="Хайх"
              className="peer w-full bg-transparent text-[15px] md:text-base tracking-wide md:tracking-wider
                         text-gray-900 dark:text-gray-100 placeholder-gray-400 
                         outline-none border-0 border-b border-black/20 dark:border-white/20
                         focus:border-b-2 focus:border-black dark:focus:border-white
                         transition-[border] duration-200 py-2 md:py-2.5 pr-20"
            />
          )}
        />

        {/* Clear button */}
        {currentValue?.length ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full
                       text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white
                       focus:outline-none"
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </button>
        ) : null}

        {/* Submit button */}
        <button
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5
                     text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white
                     focus:outline-none"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
