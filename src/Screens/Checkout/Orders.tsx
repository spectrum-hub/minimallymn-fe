import { ShoppingCart } from "lucide-react";
import ContentContainer from "../../components/ContentContainer";

const OrderDetail = () => {
  return (
    <ContentContainer>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Таны сагс
          </span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-2"></div>
    </ContentContainer>
  );
};

export default OrderDetail;
