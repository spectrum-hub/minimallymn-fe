import React from "react";
import { useSearchParams } from "react-router";
import { Button } from "antd";
import { Search, Heart } from "lucide-react";

interface Props {
  screen?: "products" | "wishlist";
}

const EmptySearch: React.FC<Props> = ({ screen = "products" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search") ?? "";

  const text =
    screen === "wishlist"
      ? "Хүслийн жагсаалт хоосон байна"
      : "Хайсан бараа олдсонгүй";
  const Icon = screen === "wishlist" ? Heart : Search;

  return (
    <section className="products  mx-auto my-8">
      <div className="flex shadow justify-center flex-col w-full bg-white p-2 rounded-md items-center py-20">
        <Icon className="mb-4" size={46} />
        <h2 className="my-4">{text}</h2>
        {searchValue && (
          <>
            <h3 className="my-4">
              <b>"{searchValue}"</b> түлхүүр үгт илэрц олдсонгүй
            </h3>
            <Button
              type="default"
              size="large"
              onClick={() => setSearchParams({})}
            >
              Цэвэрлэх
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default EmptySearch;
