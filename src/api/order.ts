import { gql } from "@apollo/client";

export const STOREPAY_LOAN_CHECK = gql`
  query ($orderId: Int!) {
    storepayLoanCheck(orderId: $orderId) {
      status
      message
      result
    }
  }
`;

export const PocketZeroInvoiceDETAIL = gql`
  query ($orderId: Int!) {
    pocketzeroInvoiceDetail(orderId: $orderId) {
      response
      error
      timestamp
    }
  }
`;

export const GET_ORDER_DETAIL = gql`
  query ($orderId: String!) {
    orderDetails(id: $orderId) {
      id
      name
      paymentMethodDesc
      amountUntaxed
      amountTax
      amountTotal
      amountToInvoice
      accessToken
      state
      reference
      signedBy
      invoiceStatus
      validityDate
      note
      locked
      createDate
      dateOrder
      carrierId
      payment {
        id
        name
        code
        pendingMsg
      }
      partner {
        id
        name
        userId
        stateId
        countryId
        completeName
        type
        street
        street2
        zip
        email
        city
        phone
        mobile
        commercialCompanyName
        companyName
        comment
        phoneSanitized
      }
      orderLines {
        id
        name
        price
        productId
        qtyAvailable
      }
      qpayInvoice {
        invoiceId
        qrText
        qrImage
        bankList {
          id
          name
          description
          link
          __typename
        }
      }
      pocketzeroResponse {
        invoiceId
        qr
        orderId
        orderNumber
        deeplink
        info
        amount
        error
      }
      lendmnResponse {
         invoiceId
         qr
         orderId
         orderNumber
         deeplink
         info
         amount
         error
         description
      }
    }
  }
`;
