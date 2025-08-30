import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Spin } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useGqlQuery from "../Hooks/Query";
import { PRODUCT_DETAIL } from "../api";
import useWindowWidth from "../Hooks/use-window-width";
import { scrollToTop } from "../lib/helpers";
import { SaveWishList } from "../components/Buttons";
import {
  NProductDetail,
  ProductDetailType,
  GroupedAttrbutesProps,
} from "../types/ProductDetail";

import { motion } from "framer-motion";

const ImageSliderProductDetail = lazy(
  () => import("../components/Products/ImageSliderProductDetail")
);
const AddCartButtons = lazy(
  () => import("../components/Products/CartActionButtons")
);
const GroupedAttributes = lazy(
  () => import("../components/Products/GroupedAttributes")
);
const QuantitySwitcher = lazy(
  () => import("../components/Products/QuantitySwitcher")
);
const RenderPrice = lazy(() => import("../components/Products/RenderPrice"));
const LoanModules = lazy(() => import("../components/LoanModules"));
const NLink = lazy(() => import("../components/NLink"));

const shakeAnimation = {
  x: [0, -5, 5, -5, 5, 0], // Чичрэх хөдөлгөөн (баруун-зүүн)
  transition: { duration: 0.4, ease: "easeInOut" },
};

const DescriptionSale = ({ description }: { description?: string }) => {
  if (!description || description === "false") return null;
  return (
    <div
      className="text-sm bg-white p-4"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
};

function groupByAttributeValues(
  itemDetail?: NProductDetail
): GroupedAttrbutesProps {
  
  const parentProducts = itemDetail?.parentProducts ?? [];
  const groupedByAttributes: GroupedAttrbutesProps = {};

  parentProducts.forEach((item) => {
    item?.productTemplateAttributeValueIds?.forEach((attributeValue) => {
      const attribute = attributeValue?.productAttributeValueId?.attributeId;
      const value = attributeValue?.productAttributeValueId;

      if (attribute?.id && value?.id) {
        if (!groupedByAttributes[attribute.id]) {
          groupedByAttributes[attribute.id] = {
            attribute: {
              id: attribute.id,
              name: attribute.name,
              displayType: attribute.displayType ?? "default",
              priceExtra: attribute.priceExtra ?? 0,
              defaultExtraPrice: attribute.defaultExtraPrice ?? 0,
            },
            values: [],
          };
        }

        if (
          !groupedByAttributes[attribute.id].values.some(
            (v) => v.id === value.id
          )
        ) {
          groupedByAttributes[attribute.id].values.push({
            ...value,
            productVariantId: item.id,
          });
        }
      }
    });
  });

  return groupedByAttributes;
}

const ProductDetailScreen = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  const productId = Number(slug) || null;
  const initialAttributeId = searchParams.get("attributeId") ?? "";
  const returnTo = searchParams.get("returnTo") ?? "";
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      if (returnTo && returnTo !== "//") {
        navigate(returnTo, { replace: true });
      }
      if (returnTo === "//") {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, [navigate, returnTo]);

  const [selectedPriceForLoan, setSelectedPriceForLoan] = useState<number>(0);

  const [isErrorAttribute, setIsErrorAttribute] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number>();

  const [amount, setAmount] = useState<number>(1);

  const { isMobile } = useWindowWidth();
  const { loading, error, data, refetch } = useGqlQuery<ProductDetailType>(
    PRODUCT_DETAIL,
    productId ? { productId } : undefined
  );

  const product = data?.itemDetail;

  useEffect(() => {
    scrollToTop();
    if (productId) refetch();
  }, [productId, refetch]);

  const groupedAttributes = useMemo(
    () => groupByAttributeValues(product),
    [product]
  );

  useEffect(() => {
    if (!product) return;
    if ((product?.parentProducts ?? [])?.length > 0) {
      setSelectedProductId(Number(initialAttributeId));
      if (Number(initialAttributeId) > 0) {
        setIsErrorAttribute(false);
      }
    } else {
      setSelectedProductId(Number(productId));
    }
  }, [initialAttributeId, product, productId]);

  const initialTotalAmount = useCallback(() => {
    if (!product) return 0;

    const parentProducts = product.parentProducts || [];
    if (parentProducts.length > 0 && initialAttributeId) {
      return (
        parentProducts.find((p) => Number(p.id) === Number(initialAttributeId))
          ?.qtyAvailable ?? 0
      );
    }
    return product.qtyAvailable ?? 0;
  }, [product, initialAttributeId]);

  if (loading) {
    return <Spin size="large" className="flex justify-center mt-20" />;
  }

  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;

  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <section className="products  mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md overflow-hidden">
          <Suspense fallback={<Spin />}>
            <ImageSliderProductDetail
              item={product}
              selectedProductId={selectedProductId}
            />
            <NLink
              label={product.productBrand?.name}
              to={product.productBrand?.id}
              type="brand"
            />
            {!isMobile && (
              <DescriptionSale description={product.productHtmlDesc} />
            )}
          </Suspense>
        </div>

        <div className="p-4 bg-white rounded-md">
          <div className="flex justify-end mb-4">
            <SaveWishList itemId={product.id} itemName={product.name} />
          </div>

          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <Suspense fallback={<Spin />}>
            <NLink
              to={product.publicCategIds?.[0]?.id}
              label={product.publicCategIds?.[0]?.name}
              type="category"
            />
            <RenderPrice
              product={product}
              selectedProductId={selectedProductId}
              setSelectedPriceForLoan={setSelectedPriceForLoan}
            />

            {(product?.parentProducts ?? []).length > 0 ? (
              <motion.div
                className={`${
                  isErrorAttribute
                    ? "border border-red-300 p-2 rounded-md shadow "
                    : ""
                }`}
                animate={isErrorAttribute ? shakeAnimation : {}}
              >
                <GroupedAttributes
                  groupedAttributes={groupedAttributes}
                  parentProducts={product.parentProducts}
                />
              </motion.div>
            ) : null}
          </Suspense>

          <Suspense fallback={<Spin />}>
            <LoanModules productPrice={selectedPriceForLoan} />
            <QuantitySwitcher
              initialAmount={initialTotalAmount()}
              amount={amount}
              setAmount={setAmount}
            />

            <AddCartButtons
              initialAmount={initialTotalAmount()}
              productId={selectedProductId}
              quantity={amount}
              productName={product.name}
              setIsErrorAttribute={setIsErrorAttribute}
              isVariant={product?.parentProducts?.length > 0 ? 1 : 0}
              isMobile={isMobile}
            />

            {isMobile && (
              <DescriptionSale description={product?.productHtmlDesc} />
            )}
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailScreen;
