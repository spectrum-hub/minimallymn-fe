import { gql } from "@apollo/client";

// Mutations
export const UPDATE_CART_ITEM = gql`
  mutation updateCartItem(
    $lineId: Int!
    $productId: Int!
    $addQty: Int!
    $setQty: Int!
  ) {
    updateCartItem(
      lineId: $lineId
      productId: $productId
      setQty: $setQty
      addQty: $addQty
    ) {
      isSuccess
      values
    }
  }
`;

export const CartCreateUpdate = gql`
  mutation createOrder($partnerId: Int!, $orderLine: OrderLineInput!) {
    createOrder(partnerId: $partnerId, orderLine: $orderLine) {
      order {
        id
        name
        amountTotal
        status
        existCart
        orderLines {
          id
          product {
            id
            name
            description
            price
          }
          quantity
          priceUnit
        }
      }
    }
  }
`;

/**
 *
 * Захиалга үүсгэх
 *
 */

export const setDeliveryMethodGQL = gql`
  mutation updateShipment($deliveryId: Int!, $deliveryPid: Int!) {
    updateShipment(deliveryId: $deliveryId, deliveryPid: $deliveryPid) {
      isSuccess
      values
    }
  }
`;

export const CREATE_ORDER_CHECKOUT = gql`
  mutation createOrder(
    $address: String!
    $phone: String!
    $name: String!
    $note: String
    $paymentMethod: String
    $deliveryMethod: Int
    $checkoutWarningMessages: String
  ) {
    checkoutOrder(
      formData: {
        address: $address
        phone: $phone
        name: $name
        note: $note
        paymentMethod: $paymentMethod
        deliveryMethod: $deliveryMethod
        checkoutWarningMessages: $checkoutWarningMessages
      }
    ) {
      isSuccess
      values
    }
  }
`;

// Queries
export const GET_CARTS = gql`
  query Cart {
    carts {
      warningText
      id
      name
      amountTotal
      status
      existCart
      total
      totalDeliveryCarriers
      carrierId
      amountUntaxed
      note
      isDeliverySelected
      selectedDeliveryMethod
      selectedDelivery {
        fixedPrice
        name
        deliveryId
        productId
      }
      orderLinesTotal
      orderLines {
        id
        quantity
        priceUnit
        lineName
        discount
        priceSubtotal
        priceTotal
        isDelivery
        priceTax
        state
        productId
        product {
          id
          name
          description
          price
          qtyAvailable
          productId
          productTmplId
          combinationIndices
        }
      }
      paymentMethods {
        id
        primaryPaymentMethodId
        fixedPrice
        code
        name
        supportRefund
        sequence
        isAuthRequired
      }
      deliveryCarriers {
        id
        freeDeliveryAmount
        fixedPrice
        freeOver
        name
        deliveryType
        productId
      }
    }
  }
`;
