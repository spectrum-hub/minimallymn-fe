import { ShoppingCart } from "lucide-react";
import { Button } from "antd";
import { useNavigate } from "react-router";
import { FC } from "react";

const EmptyCart:FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center">
      <ShoppingCart className="w-12 h-12" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold dark:text-white text-gray-900">
        Таны сагс хоосон байна
      </h1>

      <Button size={"large"} onClick={() => navigate("/products")}>
        Дэлгүүр рүү буцах
      </Button>
    </div>
  );
};

export default EmptyCart;
