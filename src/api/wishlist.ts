import { gql } from "@apollo/client";

export const GET_WISHLISTS = gql`
  query ($page: Int!, $pageSize: Int!, $orderBy: String) {
    wishlist(page: $page, pageSize: $pageSize, orderBy: $orderBy) {
      items {
        id
        name
        listPrice
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        pageCount
        pageSize
        currentPage
      }
    }
  }
`;

export const GET_WISHLIST_COUNT = gql`
  query {
    wishlistCount
  }
`;

// {
//   "data": {
//       "wishlistCount": 3
//   }
// }

export const ADD_WISHLIST = gql`
  mutation createWishlist($userId: Int!, $productTmplId: Int!) {
    createWishlist(userId: $userId, productTmplId: $productTmplId) {
      wishlist {
        id
      }
    }
  }
`;

export const DELETE_WISHLIST = gql`
  mutation deleteWishlist($itemId: Int!) {
    deleteWishlist(itemId: $itemId) {
      success
      message
    }
  }
`;
