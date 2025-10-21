import {
  useQuery,
  QueryResult,
  ApolloQueryResult,
  OperationVariables,
  MaybeMasked,
  DocumentNode,
} from "@apollo/client";
import { websiteId } from "../lib/configs";
import { OrderBy } from "../types/General";
import { ApiContextType } from "../types/Common";

interface UseGqlQueryVariables {
  pageUrl?: string;
  websiteId?: string | number;
  orderBy?: OrderBy;
  page?: number;
  pageSize?: number;
  categoryId?: number;
  productId?: number;
  searchValue?: string;
  platformItemId?: string;
  platform?: string;
  orderId?: string;
  filters?: {
    filterAttributes?: string[];
    attributesValues?: string[];
    cids?: (number | undefined)[];
    brands?: string[];
  };
  attributesValues?: string[];
}

// Define the hook's result interface

interface UseGqlQueryResult<T> {
  loading: boolean;
  error?: Error;
  data: T | null | undefined | MaybeMasked<T>;
  refetch: (
    variables?: Partial<OperationVariables>
  ) => Promise<ApolloQueryResult<MaybeMasked<T>>>;
}

// Custom hook for fetching web blocks data
const useGqlQuery = <T>(
  query: DocumentNode,
  variables?: UseGqlQueryVariables,
  options?: import("@apollo/client").QueryHookOptions<T, UseGqlQueryVariables>
): UseGqlQueryResult<T> => {
  // Use Apollo's useQuery hook to fetch data
  const { context } = options ?? {};

  const { loading, error, data, refetch }: QueryResult<T> = useQuery<T>(query, {
    context: {
      api: "minimally",
      ...context,
    } as {
      api: ApiContextType
    },
    variables: {
      websiteId,
      ...variables,
    },

    fetchPolicy: "no-cache",
  });

  return {
    loading,
    error,
    data,
    refetch,
  };
};

export default useGqlQuery;
