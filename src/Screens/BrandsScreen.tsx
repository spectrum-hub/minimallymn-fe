import { useState, Key } from "react";
import { useQuery, gql } from "@apollo/client";
import { NavLink } from "react-router";
import { Button } from "antd";

// GraphQL Query for Brands (matches your schema)
const GET_BRANDS = gql`
  query Brands($page: Int, $pageSize: Int, $orderBy: String, $websiteId: Int) {
    brands(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      websiteId: $websiteId
    ) {
      pageInfo {
        totalCount
        pageCount
        currentPage
        pageSize
      }
      brands {
        id
        name
        description
        partnerId
        logo
        productCount
        websiteId
      }
    }
  }
`;

function BrandsScreen() {
  const [page, setPage] = useState(1);
  const pageSize = 30; // Default page size
  const orderBy = "name asc"; // Default sorting
  const websiteId = 1; // Example website ID; adjust as needed or make dynamic
  const { loading, error, data } = useQuery(GET_BRANDS, {
    variables: { page, pageSize, orderBy, websiteId },
  });

  if (loading)
    return <p className="text-center text-gray-500">Loading brands...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const { brands } = data;

  type Brand = {
    id: Key | null | undefined;
    logo: string | null;
    name: string;
    description: string;
    productCount: number;
    websiteId: number;
  };

  return (
    <section className="products  mx-auto ">
      <h1 className="text-center md:text-left text-md md:text-2xl 
      font-bold font-sans  text-gray-800 my-5">
        Брендүүд
      </h1>
      <div className="flex flex-wrap gap-2 justify-center md:justify-normal ">
        {brands?.brands?.map((brand: Brand) => (
          <NavLink
            to={`/products?brands=${brand.id}`}
            key={brand.id}
            className={`
                border border-gray-200 rounded-lg p-2 md:p-4 shadow-md 
                flex  flex-col gap-2 md:gap-4 justify-center items-center 
                bg-white hover:shadow-lg transition-shadow
                min-w-36 md:min-w-48
            `}
          >
            {brand?.logo && (
              <img
                src={`data:image/png;base64,${brand.logo}`}
                alt={`${brand.name} Logo`}
                className="w-28 h-16 md:w-38 md:h-32 object-contain"
              />
            )}

            <h2 className="text-lg font-semibold text-gray-900 font-sans ">
              {brand.name}
            </h2>
          </NavLink>
        ))}
      </div>
      {/* Pagination */}
      <div className="mt-5 text-center text-xs">
        {page === 1 ? null : (
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Өмнөх
          </Button>
        )}

        <span className="px-4 py-2 text-gray-700">
          Хуудас {page} -ээс {brands.pageInfo.pageCount || 1}
        </span>
        {page === brands.pageInfo.pageCount ? null : <Button
          onClick={() => setPage(page + 1)}
          disabled={page === brands.pageInfo.pageCount}
        >
          Дараах
        </Button>}
        
      </div>
    </section>
  );
}

export default BrandsScreen;
