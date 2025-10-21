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

  // products(page: 1, pageSize: 20, orderBy: "name_desc", 
  // filters: {
  //   # name: "Бараа нэр"
  //   # cids: [1, 2, 9]
  //   category: "Категори "
  // }  
  // ) {

export const GET_PRODUCTS = gql`
  query (
    $page: Int = 1
    $pageSize: Int = 20
    $orderBy: String
    $filters: ProductFilter
  ) {
    products(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      filters: $filters
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
        category
        productTmplId
        productId
        listPrice
        productName
        attributes
        categoryNames
        priceExtraSum
        mainImageUrl {
          main
          medium
          small
        }
        variantImageUrl {
          main
          medium
          small
        }
        brand {
          id
          logo
          name
        }
        price {
          currency
          formatted
          price
        }
        discount {
          originalPrice
          originalPriceFormatted
          rate
          currency
          savingsFormatted
          savings
        }
        tags
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
