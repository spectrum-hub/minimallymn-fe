import { SearchIcon, X as XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchFormSchema } from "../../lib/form-schemas";
import { useSearchParams } from "react-router";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

interface FormSubmit {
  searchString: string;
}

const SearchForm = () => {
  const [searchParams] = useSearchParams();

  const { historyNavigate } = useHistoryNavigate();

  const searchValue = searchParams.get("search") ?? "";

  const { control, handleSubmit, resetField } = useForm<FormSubmit>({
    resolver: yupResolver(searchFormSchema),
    defaultValues: {
      searchString: searchValue,
    },
  });

  const onSubmit = async (data: FormSubmit) => {
    try {
      historyNavigate(`/products?search=${data.searchString}`);
    } catch (err) {
      console.log(err);
    } finally {
      console.log("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 max-w-md relative"
    >
      <div className="relative flex items-center w-full">
        <SearchIcon className="absolute left-2 h-5 w-5 text-gray-500" />
        <Controller
          control={control}
          name={"searchString"}
          render={({ field: { onChange } }) => (
            <input
              type="search"
              onChange={onChange}
              placeholder="Хайх ..."
              className="w-full pl-10 pr-24 py-2.5 bg-white  
              border border-gray-300  rounded shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-purple-500 focus:border-transparent 
              transition-all duration-200 placeholder-gray-400 
              text-gray-900 over:border-gray-400 mx-auto h-12 my-4 text-lg "
            />
          )}
        />

        {searchValue && searchValue.length > 0 && (
          <button
            type="button"
            onClick={() => {
              resetField("searchString");
              historyNavigate("/products");
            }}
            className="absolute right-20 bg-gray-200 dark:bg-gray-600 rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="
            absolute right-2  px-3 py-1 text-sm rounded-md  
            transition-colors duration-200 focus:outline-none 
            focus:ring-2 border "
        >
          Хайх
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
