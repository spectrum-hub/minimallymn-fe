/**
 *
 * src\Redux\layoutActions.ts
 *
 */

import { Dispatch } from "@reduxjs/toolkit";
import { apolloClient } from "../lib/apolloClient";

import {
  setLayoutFailure,
  setLayoutRequest,
  setLayoutSuccess,
} from "./slices/layoutSlice";
import { gql } from "@apollo/client";
import { websiteId } from "../lib/configs";
import {
  setCategoriesFailure,
  setCategoriesRequest,
  setCategoriesSuccess,
} from "./slices/categorySlice";

export const GET_LAYOUTS = gql`
  query WebsiteBlocks($websiteId: String!, $pageUrl: String!) {
    websiteBlocks(pageUrl: $pageUrl, websiteId: $websiteId) {
      menus
      blocks
      footer
    }
  }
`;

export const getLayoutsAsync =
  (forceRefresh = false) =>
  async (dispatch: Dispatch) => {
    dispatch(setLayoutRequest());
    try {
      const { data } = await apolloClient.query({
        query: GET_LAYOUTS,
        variables: { websiteId, pageUrl: "/" },
        fetchPolicy: forceRefresh ? "network-only" : "cache-first", // Toggle policy
      });

      if (data) {
        dispatch(setLayoutSuccess(data));
      } else {
        dispatch(setLayoutFailure("Мэдээлэл олдсонгүй."));
      }
      return { success: true, message: "Мэдээлэл амжилттай татагдлаа." };
    } catch (err) {
      console.error("Fetch Error:", err);
      dispatch(setLayoutFailure("Мэдээлэл татахад алдаа гарлаа."));
      return { success: false, message: "Мэдээлэл татахад алдаа гарлаа." };
    }
  };

export const GET_CATEGORIES = gql`
  query ($page: Int = 1, $pageSize: Int = 20) {
    categories(page: $page, pageSize: $pageSize) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        pageCount
        pageSize
        currentPage
      }
      categories {
        id
        name
        parentId
        websiteId
        parentPath
        sequence
        websiteDescription
        websiteMetaTitle
        websiteMetaDescription
        productCount
      }
    }
  }
`;

export const getCatgoriesAsync =
  (forceRefresh = false) =>
  async (dispatch: Dispatch) => {
    dispatch(setCategoriesRequest());
    try {
      const { data } = await apolloClient.query({
        query: GET_CATEGORIES,
        variables: {
          page: 1,
          pageSize: 100,
        },
        fetchPolicy: forceRefresh ? "network-only" : "cache-first", // Toggle policy
      });

      if (data) {
        dispatch(setCategoriesSuccess(data));
      } else {
        dispatch(setCategoriesFailure("Мэдээлэл олдсонгүй."));
      }
      return { success: true, message: "Мэдээлэл амжилттай татагдлаа." };
    } catch (err) {
      console.error("Fetch Error:", err);
      dispatch(setCategoriesFailure("Мэдээлэл татахад алдаа гарлаа."));
      return { success: false, message: "Мэдээлэл татахад алдаа гарлаа." };
    }
  };
