export const websiteId = "1";
// export const baseURL = "https://minim-admini.minimally.mn/";
export const baseURL = "http://172.31.217.111:8069";
 
export const categoryImageUrl = (id: number) =>
  `${baseURL}/web/image/product.public.category/${id}/image_128`;

export const brandLogo = (id?: number) => {
  if (id) {
    return `${baseURL}/web/image/product.brand/${id}/logo/image_512`;
  }
};

export const imageBaseUrl = (
  variantId?: number,
  size: "image_1920" | "image_512" | "image_128" = "image_512"
) => {
  if (variantId) {
    return `${baseURL}/web/image/product.product/${variantId}/${size}`;
  }
};

export const nimageBaseUrl = (
  variantId: number,
  size: string = "image_512"
) => {
  return `${baseURL}/web/image/product.template/${variantId}/${size}`;
};

export const productAdditionalImage = (
  variantId: number | undefined,
  size: "image_512" | "image_1920"
) => {
  return `${baseURL}/web/image/product.image/${variantId}/${size}`;
};

export const productAttributeValue = (attributeNumber: number) => {
  return `${baseURL}/web/image/product.attribute.value/${attributeNumber}/image`;
};

// theme.ts
const themeColors = {
  primary: "#28133f",
  white: "#fff",
  // Add other color variables if needed
};

// theme.ts
const radius = {
  primary: 16,
};

const shadow = {
  primary: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: radius.primary,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
};

export { themeColors, shadow };
