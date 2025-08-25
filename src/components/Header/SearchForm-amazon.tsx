import { SearchIcon, X as XIcon, ChevronDown, Check } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchFormSchema } from "../../lib/form-schemas";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect, useRef } from "react";

interface FormSubmit {
  searchString: string;
}

const providers = [
  { label: "Amazon", value: "amazon", icon: "🟠" },
  { label: "Antmall.mn", value: "antmall", icon: "⚫" },
  // { label: "Taobao", value: "taobao", icon: "🔴" },
  // { label: "J.ZAO", value: "jzao", icon: "🟥" },
  // { label: "IKEA", value: "ikea", icon: "🟡" },
  // { label: "eBay", value: "ebay", icon: "🔵" },
];

const SearchForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchValue = searchParams.get("search") ?? "";

  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, resetField } = useForm<FormSubmit>({
    resolver: yupResolver(searchFormSchema),
    defaultValues: { searchString: searchValue },
  });

  const onSubmit = (data: FormSubmit) => {
    const query = new URLSearchParams({
      search: data.searchString,
      provider: selectedProvider.value,
    }).toString();

    let queryUrl = `/products?${query}`;

    if (selectedProvider.value === "amazon") {
      queryUrl = `/marketplace?${query}`;
    }
    navigate(queryUrl);
  };

  useEffect(() => {
    const closeOnClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl w-full mx-auto relative"
    >
      {/* Provider dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
              flex items-center gap-1 px-3 py-2 bg-white border 
            border-gray-300 rounded-l-xl h-14
              md:h-10 shadow-sm  transition-all
              focus:outline-none focus:border-b-0
              text-gray-900 text-md
              ${isOpen ? " rounded-bl-none " : ""}
           `}
        >
          <span className="text-xl">{selectedProvider.icon}</span>
          <span className="hidden md:inline text-sm font-medium">
            {selectedProvider.label}
          </span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
        </button>

        {isOpen && (
          <div
            className="absolute z-50 mt-0 w-44 bg-white shadow-lg rounded-b-xl
           border border-gray-200 overflow-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300"
          >
            {providers.map((provider) => (
              <button
                type="button"
                key={provider.value}
                onClick={() => {
                  setSelectedProvider(provider);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm 
                  cursor-pointer  transition-colors ${
                    selectedProvider.value === provider.value
                      ? "bg-purple-100 font-semibold"
                      : ""
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{provider.icon}</span>
                  <span>{provider.label}</span>
                </span>
                {selectedProvider.value === provider.value && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search input */}
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
        <Controller
          control={control}
          name="searchString"
          render={({ field: { onChange } }) => (
            <input
              type="search"
              onChange={onChange}
              placeholder="Хайх барааны нэр..."
              className="w-full pl-10 pr-24 py-2.5 h-14 md:h-10 bg-white border 
              border-gray-300 rounded-r-xl shadow-sm focus:ring-2 focus:ring-purple-500 
              focus:outline-none text-gray-900 text-md
               border-l-0"
            />
          )}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              resetField("searchString");
              navigate("/products");
            }}
            className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition"
            aria-label="Clear"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm shadow-md transition"
        >
          Хайх
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
