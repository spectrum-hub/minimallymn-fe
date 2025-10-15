import { gql, MutationOptions } from "@apollo/client";
import { apolloClient } from "../lib/apolloClient";

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

// filters: { name: $searchValue, attributesValues: ["1-2", "3-4"] }

export const GET_PRODUCTS = gql`
  query (
    $page: Int = 1
    $pageSize: Int = 20
    $orderBy: String
    $searchValue: String
  ) {
    products(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      filters: {
        name: $searchValue
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        pageCount
        currentPage
        pageSize
      }
      items {
        indicesCount
        attrName
        attValueName
        attValueId
        priceExtra
        attributeProductTmplId
        categoryName
        categoryId
        brandName
        discountPrice
        templateName
        productId
        productTmplId
        listPrice
        mainImageUrl
      }
    }
  }
`;
export const OLD_GET_PRODUCTS = gql`
  query (
    $page: Int = 1
    $pageSize: Int = 20
    $orderBy: String
    $searchValue: String
    $attributesValues: [String]
    $categoryId: Int
    $brands: [String] # Add brands argument
    $onsale: Int
  ) {
    products(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      filters: {
        onsale: $onsale
        name: $searchValue
        attributesValues: $attributesValues
        categoryId: $categoryId
        brands: $brands # Include brands in filters
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        pageCount
        pageSize
        currentPage
      }
      publicCategories {
        id
        name
        parentPath
      }
      items {
        id
        name
        listPrice
        standardPrice
        type
        websiteSequence
        category {
          id
          name
        }
        productVariantIds
        productVariantId
        productVariantCount
        barcode
        pricelistItemCount
        images {
          id
          url
        }
        productTemplateImageIds
      }
      attributes {
        id
        name
        sequence
        attributeId
        color
        htmlColor
        active
        defaultExtraPrice
        displayType
      }
    }
  }
`;
export const PRODUCT_DETAIL_PLATFORM = gql`
  query ($platformItemId: String = "", $platform: String = "amazon") {
    itemDetailPlatform(platformItemId: $platformItemId, platform: $platform) {
      id
      name
      success
      error
      defaultCode
      listPrice
      standardPrice
      productHtmlDesc
      qtyAvailable
      configurator
      productPlatformImages {
        url
        smallUrl
        width
        isMain
      }

      productImages {
        id
        productVariantId
      }

      productBrand {
        id
        name
      }

      publicCategIds {
        id
        name
        parentPath
        parentId
      }

      commerceDescription {
        brandName
      }
      platformItemVariants {
        id
        quantity
        salesCount
        price
        configOptions
      }

      videos {
        preview
        url
      }

      attributes {
        pid
        vid
        value
        name
        image
        thumbnail
      }
    }
  }
`;

export const PRODUCT_DETAIL = gql`
  query ($productId: Int = 0) {
    itemDetail(id: $productId) {
      qtyAvailable
      id
      name
      description
      defaultCode
      listPrice
      standardPrice
      productHtmlDesc
      publicCategIds {
        name
        id
        parentPath
      }
      productBrand {
        name
        id
      }
      productImages {
        id
        productVariantId
        sequence
        name
        videoUrl
      }
      parentProducts {
        qtyAvailable
        id
        isProductVariant
        priceExtra
        combinationIndices
        listPrice
        price
        productVariantImageIds {
          id
        }
        productTemplateAttributeValueIds {
          productAttributeValueId {
            id
            attributeId {
              id
              name
              displayType
              name
              priceExtra
              defaultExtraPrice
            }
            color
            htmlColor
            name
            defaultExtraPrice
            isCustom
          }
        }
      }
    }
  }
`;

/**
 *
 *
 *
 *
 *
 *
 */

export const PRODUCT_DETAIL_OLD = gql`
  query ($productId: Int = 0) {
    productDetails(id: $productId) {
      id
      name
      description
      pricelist
      attributes
      listPrice
      standardPrice
      type
      displayName
      productVariantIds
      productVariantId
      productVariantCount
      productVariantNum
      productVariantName
      propertyStockProductionId
      propertyStockProductionName
      websiteSequence
      productTemplateImageIds
      publicCategIds {
        name
        id
        parentPath
      }
      baseUnitPrice
      availableThreshold
      baseUnitName
      baseUnitCount
      descriptionSale
      attributeLineIds
      validProductTemplateAttributeLineIds
      incomingQty
      outgoingQty
      salesCount
      alternativeProductIds
      websiteDescription
      salesCount
      qtyAvailable
      freeQty
      images {
        id
        name
        url
      }
      category {
        name
        id
        completeName
      }
      productVariants {
        attributesList {
          qtyAvailable
          attributeName
          id
          productAttributeValueId
          attributeLineId
          productTmplId
          attributeId
          attributeDisplayType
          sequence
          color
          name
          htmlColor
          priceExtra
          productVariantId
        }
        combinationIndicesValues {
          combinationIndices
          productId
          salesCount
          qtyAvailable
          productTemplateImageIds
          productVariantImageIds
        }
      }
      productBrand {
        name
        id
      }
      productHtmlDesc
    }
  }
`;

export const apiApolloMutateAsync = async (props: MutationOptions) => {
  try {
    const response = await apolloClient.mutate({
      ...props,
      fetchPolicy: props?.fetchPolicy ?? "no-cache",
    });

    return response;
  } catch (err) {
    console.error("Apollo Mutate Error:", err);
    return null;
  }
};
