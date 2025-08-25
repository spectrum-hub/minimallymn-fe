import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Spin } from "antd";
import { useParams, useSearchParams, useNavigate } from "react-router";
import useGqlQuery from "../Hooks/Query";
import { PRODUCT_DETAIL_PLATFORM } from "../api";
import useWindowWidth from "../Hooks/use-window-width";
import { scrollToTop } from "../lib/helpers";
import { groupBy } from "lodash";

import {
  NProductDetail,
  PlatformAttributes,
  ProductDetailType,
} from "../types/ProductDetail";

import ImageSliderMarketplaceItem from "../components/Products/ImageSliderMarketplaceItem";

const AddCartButtons = lazy(
  () => import("../components/Products/CartActionButtons")
);

const QuantitySwitcher = lazy(
  () => import("../components/Products/QuantitySwitcher")
);
const RenderPrice = lazy(() => import("../components/Products/RenderPrice"));
const LoanModules = lazy(() => import("../components/LoanModules"));
const NLink = lazy(() => import("../components/NLink"));

const DescriptionSale = ({ description }: { description?: string }) => {
  if (!description) return null;
  return (
    <div
      className="text-sm bg-white p-4"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
};

const VideoStrip: React.FC<{ videos?: NProductDetail["videos"] }> = ({
  videos,
}) => {
  if (!videos?.length) return null;
  return (
    <div className="p-3">
      <h3 className="font-medium mb-2">Videos</h3>
      <div className="flex flex-wrap gap-2">
        {videos.map((v, i) => (
          <a
            key={`${v.url}-${i}`}
            href={v.url}
            target="_blank"
            rel="noreferrer"
            className="block border rounded overflow-hidden hover:shadow"
            title="Open video"
          >
            <img
              src={v.preview}
              alt={`Video ${i + 1}`}
              className="w-28 h-16 object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        * HLS (.m3u8) тоглуулахад браузер дээр video.js/hls.js ашиглавал
        зохимжтой.
      </p>
    </div>
  );
};

const PlatformAttributesRender: React.FC<{
  product: NProductDetail;
  setSelectedAttribute: (variant: PlatformAttributes) => void;
}> = ({ product, setSelectedAttribute }) => {
  const attributes = product?.attributes ?? [];
  if (!attributes.length) return null;

  const grouped = groupBy(attributes, "name");

  console.log(
    "attributes.lengthattributes.length-",
    Object.keys(grouped).length,
    "---"
  );

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([attrName, attrValues]) => (
        <div key={attrName} className="w-full">
          <h3 className="font-semibold mb-2">{attrName}</h3>
          <div className="flex flex-wrap gap-2">
            {attrValues.map((variant, index) => {
              const label = variant?.value;
              return (
                <button
                  key={index}
                  className="
                  flex items-center gap-2
                  border border-gray-200 flex-col
                  rounded shadow-sm hover:border-black 
                  cursor-pointer text-sm
                  "
                  title={label}
                  onClick={() => setSelectedAttribute(variant)}
                >
                  {variant.thumbnail || variant.image ? (
                    <img
                      src={variant.thumbnail || variant.image}
                      alt={label}
                      className="h-16 w-20 object-cover rounded "
                      loading="lazy"
                    />
                  ) : null}
                  <span className="text-xs px-2 py-1 w-16 text-center m-0 line-clamp-2">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};



const MarketplaceProductDetailScreen = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialAttributeId = searchParams.get("attributeId") ?? "";

  const [selectedPriceForLoan, setSelectedPriceForLoan] = useState<number>(0);

  // const [totalAttributes, setTotalAttributes] = useState<number>(0);

  // const [isErrorAttribute, setIsErrorAttribute] = useState(false);

  const [selectedAtributes, setSelectedAtributes] = useState<
    Record<number, PlatformAttributes>
  >({});

  const [selectedProductId, ] = useState<number>();

  const [amount, setAmount] = useState<number>(1);

  const { isMobile } = useWindowWidth();
  const { loading, error, data, refetch } = useGqlQuery<ProductDetailType>(
    PRODUCT_DETAIL_PLATFORM,
    { platformItemId: productId, platform: "amazon" },
    {
      context: {
        api: "commerce",
      },
    }
  );

  const product = data?.itemDetailPlatform;
  // const searchPids = product?.platformItemVariants;

  // useEffect(() => {
  //   searchPids
  //     ?.flatMap((v) => v?.configOptions || [])
  //     .reduce<Record<string, (typeof searchPids)[0]["configOptions"][0]>>(
  //       (acc, curr) => {
  //         acc[`${curr.Pid}:${curr.Vid}`] = curr;

  //         console.log(acc);
  //         return acc;
  //       },
  //       {}
  //     );
  // }, [searchPids]);


  useEffect(() => {
    scrollToTop();
    if (productId) refetch();
  }, [productId, refetch]);

  useEffect(() => {
    //
    if (data?.itemDetailPlatform?.error && !data?.itemDetailPlatform?.success) {
      navigate(
        `/marketplace/?search=${productId?.replace("AZ-", "")}&provider=amazon`
      );
    }
  }, [
    data?.itemDetailPlatform?.error,
    data?.itemDetailPlatform?.success,
    navigate,
    productId,
  ]);

  console.log(
    "selectedAtributes length",
    Object.keys(selectedAtributes).length
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

  useEffect(() => {
    console.log("selectedAtributes", selectedAtributes);
  }, [selectedAtributes]);

  

  if (loading) {
    /**
     * -----------------------
     * -----------------------
     */

    return <Spin size="large" className="flex justify-center mt-20" />;
  }

  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;

  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <section className="products max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md overflow-hidden">
          {selectedProductId}
          <Suspense fallback={<Spin />}>
            <ImageSliderMarketplaceItem item={product} />
            <VideoStrip videos={product.videos} />
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
          <h2 className="normal text-sm mb-2 text-blue-700">
            {product?.commerceDescription?.brandName}
          </h2>
          <h1 className=" font-semibold mb-2 break-words">{product.name}</h1>

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

            <PlatformAttributesRender
              product={product}
              setSelectedAttribute={(selectedAttribute) =>
                setSelectedAtributes((prev) => ({
                  ...prev,
                  [Number(selectedAttribute.pid)]: selectedAttribute,
                }))
              }
            />
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
              setIsErrorAttribute={() => {}}
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

export default MarketplaceProductDetailScreen;
