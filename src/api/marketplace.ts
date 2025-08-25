import { gql } from "@apollo/client";

export const GET_MARKETPLACE_PRODUCTS = gql`
  query ($page: Int = 1, $searchValue: String!) {
    commerceSearchItems(page: $page, filters: { searchText: $searchValue }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        pageCount
        pageSize
        currentPage
      }
      items {
        id
        name
        commerceDescription {
          title
          id
          description
          brandName
          mainPictureUrl
          price {
            originalPrice
            currencyName
          }
          pictures {
            url
            small
            medium
            large
          }
        }
      }
    }
  }
`;

export const GET_MARKETPLACE_PRODUCTSR = gql`
  query {
    commerceSearchItems(filters: { search_text: "laptop" }) {
      pageInfo {
        totalCount
        provider
      }
      commerceSearchItems {
        id
        name
        productCommerce {
          title
          id
          description
          brandName
          mainPictureUrl
          price {
            originalPrice
            currencyName
          }
          pictures {
            url
            small
            medium
            large
          }
        }
      }
    }
  }
`;
