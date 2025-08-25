import { gql } from "@apollo/client";

export const getEecommerceProducts = gql`
  query ecommerceProducts($first: Int = 40, $page: Int = 1) {
    ecommerceProducts(first: $first, page: $page) {
      data {
        id
        category_id
        product_id
        name
        icon
        description
        content
        sort_order
        price
        discount_price
        stock
        feature_image
        is_visible
        sku
        barcode
        media {
          id
          model_id
          uuid
          collection_name
          name
          file_name
          mime_type
          conversions_disk
          order_column
        }
      }
      paginatorInfo {
        currentPage
        lastPage
        perPage
        total
        hasMorePages
      }
    }
  }
`;

