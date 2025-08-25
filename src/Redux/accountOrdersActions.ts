import { gql } from "@apollo/client";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Orders,
  setOrdersFailure,
  setOrdersRequest,
  setOrdersSuccess,
} from "./slices/accountOrdersSlice";
import { apolloClient } from "../lib/apolloClient";

export const ACCOUNT_ORDERS = gql`
  query GetAccountOrders($page: Int, $pageSize: Int, $orderBy: String) {
    accountOrders(page: $page, pageSize: $pageSize, orderBy: $orderBy) {
      orders {
        id
        name
        state
        amountTotal
        partnerId
        dateOrder
        paymentMethodDesc
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
      genericdata
      message
    }
  }
`;

interface FetchOrdersParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
}

export const accountOrdersAsync =
  (params: FetchOrdersParams = {}) =>
  async (
    dispatch: Dispatch
  ): Promise<{ success: boolean; message: string; orders?: Orders }> => {
    try {
      dispatch(setOrdersRequest());

      const response = await apolloClient.query<{ accountOrders: Orders }>({
        query: ACCOUNT_ORDERS,
        variables: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          orderBy: params.orderBy,
        },
      });

      const orders = response.data.accountOrders;

      if (!orders.orders.length && orders.totalCount === 0) {
        dispatch(setOrdersSuccess({ ...orders, message: "No orders found" }));
        return { success: true, message: "No orders found", orders };
      }

      dispatch(setOrdersSuccess(orders));
      return {
        success: true,
        message: "Orders fetched successfully",
        orders,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      dispatch(setOrdersFailure(errorMessage));
      console.error("Account Orders Fetch Error:", err);
      return { success: false, message: errorMessage };
    }
  };
