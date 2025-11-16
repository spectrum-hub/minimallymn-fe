import { useMemo } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import { baseURL } from "../lib/configs";
import RowTitle from "../components/RowTitle";
import { Brand } from "../types/Products";

function BrandsScreen(): JSX.Element {
  const items = useSelector((state: RootState) => state.products?.data?.items);

  const brands = useMemo(() => {
    if (!items?.length) return [];

    const map = new Map<string, Brand>();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = item?.brand?.id;
      const brand = item?.brand;
      if (id && brand) {
        // Map-ийн key-г string болгох нь илүү найдвартай
        // (sparse array-оос зайлсхийх)
        map.set(String(id), brand);
      }
    }
    // Хүсвэл нэрээр эрэмбэлэх (optional)
    const arr = Array.from(map.values());
    arr.sort((a, b) => {
      const an = (a.name ?? "").toString().toLowerCase();
      const bn = (b.name ?? "").toString().toLowerCase();
      return an.localeCompare(bn);
    });

    return arr;
  }, [items]);

  return (
    <section className="products mx-auto">
      <RowTitle title="Брэндүүд" />
      <div className="flex flex-wrap gap-2 justify-center md:justify-normal">
        {brands.map((brand) => {
          const href = brand?.url ?? `/products?brands=${brand.id}`;
          const imgSrc = brand?.logo?.main
            ? `${baseURL}${brand.logo.main}`
            : undefined;

          return (
            <NavLink
              to={href}
              key={String(brand.id)}
              className={`
                border border-gray-200 rounded p-2 md:p-4 shadow 
                flex flex-col gap-2 md:gap-4 justify-center items-center 
                bg-white hover:shadow-lg transition-shadow
                min-w-36 md:min-w-48
              `}
              aria-label={`Брэнд ${brand.name ?? brand.id}`}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={`${brand.name ?? ""} Logo`}
                  className="w-28 h-16 md:w-38 md:h-32 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-28 h-16 md:w-38 md:h-32 flex items-center justify-center bg-gray-100 text-xs text-gray-500"></div>
              )}

              <h2 className="mt-4 text-sm font-semibold text-gray-600 font-sans">
                {brand.name}
              </h2>
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}

export default BrandsScreen;
