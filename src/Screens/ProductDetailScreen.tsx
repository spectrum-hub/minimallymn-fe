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
import { GET_PRODUCTS, PRODUCT_DETAIL } from "../api";
import useWindowWidth from "../Hooks/use-window-width";
import { scrollToTop } from "../lib/helpers";
import { SaveWishList } from "../components/Buttons";
import {
  NProductDetail,
  ProductDetailType,
  GroupedAttrbutesProps,
} from "../types/ProductDetail";
import ProductItemCard from "../components/Products/ProductItemCard";
import { ProductsQuery } from "../types/Products";
import { motion } from "framer-motion";

// Lazy imports for better code-splitting
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

const SHAKE_ANIMATION = {
  x: [0, -5, 5, -5, 5, 0],
  transition: { duration: 0.4, ease: "easeInOut" },
};

const DescriptionSale = ({ description }: { description?: string }) =>
  !description || description === "false" ? null : (
    <div
      className="text-sm bg-white p-4"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );

// Utility: Group product detail attributes for easier display
function groupByAttributeValues(
  itemDetail?: NProductDetail
): GroupedAttrbutesProps {
  const grouped: GroupedAttrbutesProps = {};
  itemDetail?.parentProducts?.forEach((item) => {
    item?.productTemplateAttributeValueIds?.forEach((attrValue) => {
      const attr = attrValue?.productAttributeValueId?.attributeId;
      const value = attrValue?.productAttributeValueId;
      if (attr?.id && value?.id) {
        if (!grouped[attr.id]) {
          grouped[attr.id] = {
            attribute: {
              id: attr.id,
              name: attr.name,
              displayType: attr.displayType ?? "default",
              priceExtra: attr.priceExtra ?? 0,
              defaultExtraPrice: attr.defaultExtraPrice ?? 0,
            },
            values: [],
          };
        }
        if (!grouped[attr.id].values.some((v) => v.id === value.id)) {
          grouped[attr.id].values.push({ ...value, productVariantId: item.id });
        }
      }
    });
  });
  return grouped;
}

const ProductDetailScreen = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile } = useWindowWidth();

  // Params
  const productId = Number(slug) || null;
  const initialAttributeId = searchParams.get("attributeId") ?? "";
  const returnTo = searchParams.get("returnTo") ?? "";

  // States
  const [selectedPriceForLoan, setSelectedPriceForLoan] = useState(0);
  const [isErrorAttribute, setIsErrorAttribute] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [amount, setAmount] = useState(1);

  // Data queries
  const { loading, error, data, refetch } = useGqlQuery<ProductDetailType>(
    PRODUCT_DETAIL,
    productId ? { productId } : undefined
  );
  const product = data?.itemDetail;

  const { data: categoryProductsData } = useGqlQuery<ProductsQuery>(
    GET_PRODUCTS,
    {
      page: 1,
      pageSize: 6,
      categoryId: product?.publicCategIds?.[0]?.id,
    }
  );
  const categoryProductsItems =
    categoryProductsData?.products?.items?.filter(
      (p) => p.id !== product?.id
    ) ?? [];
  const publicCategories =
    categoryProductsData?.products?.publicCategories ?? [];

  // Effects
  useEffect(() => {
    scrollToTop();
    if (productId) refetch();
  }, [productId, refetch]);

  useEffect(() => {
    const handler = () => {
      if (returnTo && returnTo !== "//") navigate(returnTo, { replace: true });
      if (returnTo === "//") navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [navigate, returnTo]);

  useEffect(() => {
    if (!product) return;
    if ((product.parentProducts ?? []).length > 0) {
      setSelectedProductId(Number(initialAttributeId));
      setIsErrorAttribute(
        Number(initialAttributeId) > 0 ? false : isErrorAttribute
      );
    } else {
      setSelectedProductId(Number(productId));
    }
  }, [initialAttributeId, isErrorAttribute, product, productId]);

  // Derived values
  const groupedAttributes = useMemo(
    () => groupByAttributeValues(product),
    [product]
  );

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

  // Render
  if (loading)
    return <Spin size="large" className="flex justify-center mt-20" />;
  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;
  if (!product) return <div className="p-4">Product not found</div>;

  const renderCategoryTitle = () => {
    const categoryId = product?.publicCategIds?.[0]?.id;
    const category = publicCategories.find(
      (c) => Number(c.id) === Number(categoryId)
    );
    return category?.name ? (
      <h2 className="md:my-8 my-4 text-md md:text-2xl text-gray-700">
        &quot;{category.name}&quot; ангилалын бусад бараанууд
      </h2>
    ) : null;
  };

  return (
    <section className="products mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT: Product Images + Category/Brand Links + Description */}
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="m-4">
            <h1 className="text-xl font-bold mb-1">{product.name}</h1>
            <Suspense fallback={<span />}>
              <NLink
                to={product.publicCategIds?.[0]?.id}
                label={product.publicCategIds?.[0]?.name}
                type="category"
              />
            </Suspense>
          </div>
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
        {/* RIGHT: Actions */}
        <div className="p-4 bg-white rounded-md">
          <div className="flex justify-end mb-4">
            <SaveWishList itemId={product.id} itemName={product.name} />
          </div>
          <Suspense fallback={<Spin />}>
            <RenderPrice
              product={product}
              selectedProductId={selectedProductId}
              setSelectedPriceForLoan={setSelectedPriceForLoan}
            />
            {(product.parentProducts ?? []).length > 0 && (
              <motion.div
                className={
                  isErrorAttribute
                    ? "border border-red-300 p-2 rounded-md shadow"
                    : ""
                }
                animate={isErrorAttribute ? SHAKE_ANIMATION : {}}
              >
                <GroupedAttributes
                  groupedAttributes={groupedAttributes}
                  parentProducts={product.parentProducts}
                />
              </motion.div>
            )}
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
              isVariant={product.parentProducts?.length > 0 ? 1 : 0}
              isMobile={isMobile}
            />
            {isMobile && (
              <DescriptionSale description={product.productHtmlDesc} />
            )}
          </Suspense>
        </div>
      </div>
      {/* Category Products - Related */}
      <section className="mx-auto my-4">
        {renderCategoryTitle()}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {categoryProductsItems.map((item) => (
            <ProductItemCard
              item={item}
              key={item.id}
              type="slider"
              isMobile={isMobile}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default ProductDetailScreen;
