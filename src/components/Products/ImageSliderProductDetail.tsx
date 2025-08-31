import { FC, Suspense, useMemo, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Image } from "antd";
import { imageBaseUrl, productAdditionalImage } from "../../lib/configs";
import {
  A11y,
  Navigation,
  Scrollbar,
  Thumbs,
  Pagination,
} from "swiper/modules";
import { NProductDetail } from "../../types/ProductDetail";

type ImageKind = "main" | "variant" | "additional";

interface VImage {
  id: number;
  kind: ImageKind;
  // Хэрэв GraphQL-д sequence орж ирдэг бол ашиглана (product.image.sequence)
  sequence?: number;
}

interface Props {
  item?: NProductDetail;
  selectedProductId?: number;
}

const ImageSlider: FC<Props> = ({ item, selectedProductId }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const imagesArray: VImage[] = useMemo(() => {
    if (!item) return [];

    // main image (product.template image_*)
    const main: VImage[] = item.id ? [{ id: item.id, kind: "main" }] : [];

    // template-н нэмэлт зургууд (product.image)
    const mainAdditional: VImage[] =
      item.productImages?.map((img) => ({
        id: Number(img.id),
        kind: "additional",
        sequence: img?.sequence,
      })) ?? [];

    // бүх variant-н main зураг (product.product image_*) — selected байхгүй үед ашиглана
    const allVariantMain: VImage[] =
      item.parentProducts?.map((p) => ({
        id: Number(p.id),
        kind: "variant",
      })) ?? [];

    // variant-н additional (product.image) — selected байвал зөвхөн тэр variant, үгүй бол бүгд
    const variantAdditional: VImage[] =
      (selectedProductId
        ? item.parentProducts
            ?.filter((p) => Number(p.id) === Number(selectedProductId))
            .flatMap((p) =>
              (p.productVariantImageIds ?? []).map((img) => ({
                id: Number(img.id),
                kind: "additional" as const,
              }))
            )
        : item.parentProducts?.flatMap((p) =>
            (p.productVariantImageIds ?? []).map((img) => ({
              id: Number(img.id),
              kind: "additional" as const,
            }))
          )) ?? [];

    // selected байвал тэр variant-н main зургийг нэгээр нь
    const selectedVariantMain: VImage[] =
      selectedProductId && selectedProductId > 0
        ? [{ id: selectedProductId, kind: "variant" }]
        : [];

    // Давхардлыг арилга (kind+id-гаар)
    const uniqueByKey = (arr: VImage[]) => {
      const seen = new Set<string>();
      return arr.filter((x) => {
        const key = `${x.kind}:${x.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    // sequence байгаа бол нэмэлт зургуудыг эрэмбэл
    const sortAdditional = (arr: VImage[]) =>
      [...arr].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    const ordered = selectedProductId
      ? uniqueByKey([
          ...selectedVariantMain,
          ...variantAdditional,
          ...main,
          ...mainAdditional,
        ])
      : uniqueByKey([
          ...main,
          ...mainAdditional,
          ...allVariantMain,
          ...variantAdditional,
        ]);

    // additional-уудаа sequence-ээрээ дотроос нь эрэмбэлнэ
    const additional = sortAdditional(
      ordered.filter((x) => x.kind === "additional")
    );
    const rest = ordered.filter((x) => x.kind !== "additional");

    return [...rest, ...additional];
  }, [item, selectedProductId]);

  const getSrc = (img: VImage, size: "image_1920" | "image_512") =>
    img.kind === "additional"
      ? productAdditionalImage(img.id, size)
      : imageBaseUrl(img.id, size);

  if (!imagesArray.length) {
    return (
      <div className="bg-white rounded-md p-8 text-center text-gray-500">
        Зураг олдсонгүй
      </div>
    );
  }

  return (
    <Suspense fallback={<></>}>
      <SwiperComponent
        modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
        spaceBetween={1}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={false}
        autoHeight
        className="bg-white rounded-md"
        observer
        observeParents
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        nested
      >
        {imagesArray.map((image) => (
          <SwiperSlide
            key={`${image.kind}-${image.id}`}
            className="flex items-center justify-center"
          >
            <div className="max-h-[480px] overflow-auto flex items-center justify-center h-96">
              <Image
                src={getSrc(image, "image_1920") ?? ""}
                alt={item?.name ?? ""}
                className="mx-auto w-full h-auto object-contain p-8 rounded-md"
                loading="lazy"
                preview
              />
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>

      {imagesArray.length > 1 && (
        <SwiperComponent
          modules={[Thumbs]}
          watchSlidesProgress
          onSwiper={setThumbsSwiper}
          spaceBetween={4}
          slidesPerView={8}
          breakpoints={{
            0: { slidesPerView: 6, spaceBetween: 4 },
            640: { slidesPerView: 8, spaceBetween: 6 },
            1024: { slidesPerView: 10, spaceBetween: 8 },
          }}
          className="my-4"
        >
          {imagesArray.map((image) => (
            <SwiperSlide key={`thumb-${image.kind}-${image.id}`}>
              <img
                src={getSrc(image, "image_512") ?? ""}
                alt={item?.name ?? ""}
                className="h-[54px] w-[54px] md:h-[64px] md:w-[64px] 
                object-cover transition-transform duration-300 
                group-hover:scale-105 bg-white rounded-md ml-1 cursor-pointer p-0.5"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      )}
    </Suspense>
  );
};

export default ImageSlider;
