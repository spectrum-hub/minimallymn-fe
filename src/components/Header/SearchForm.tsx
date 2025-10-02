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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex justify-center items-center"
    >
      <div
        className="relative w-full max-w-md mx-auto bg-white 
        dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
        rounded-2xl px-4 py-1 flex items-center"
        style={{ borderWidth: 1 }}
      >
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
              className="peer w-full bg-transparent text-[15px] md:text-base 
              tracking-wide md:tracking-wider
                               text-gray-900 dark:text-gray-100 
                               placeholder-gray-400 
                               outline-none border-0 rounded-xl px-4 py-1
                              focus:ring-2 focus:ring-blue-100 
                               transition-all duration-200 pr-16 shadow-sm"
            />
          )}
        />

        {/* Clear button */}
        {currentValue?.length ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 shadow hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </button>
        ) : null}

        {/* Submit button */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 shadow hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" color="#6B7280" />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
