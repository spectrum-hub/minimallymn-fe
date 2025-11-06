import { Dispatch } from "@reduxjs/toolkit";
import { apolloClient } from "../lib/apolloClient";

import {
  setLayoutFailure,
  setLayoutRequest,
  setLayoutSuccess,
} from "./slices/layoutSlice";
import { gql } from "@apollo/client";
import {
  setCategoriesFailure,
  setCategoriesRequest,
  setCategoriesSuccess,
} from "./slices/categorySlice";

export const GET_LAYOUTS = gql`
  query WebsiteBlocks($themeType: String!) {
    themeGrid(themeType: $themeType) {
      id
      name
      companyName
      companyDescription
      contactPhone
      contactEmail
      address
      timetable
      footerTemplate
      copyrightText
      facebookUrl
      youtubeUrl
      instagramUrl
      twitterUrl
      webfrontDefault
      headerItems
      footerItems
      domainName
      checkoutWarningMessages {
       warningId
       warningText
      }
      payments {
        paymentId
        bankName
        bankIban
        bankAccount
        bankAccountName
        accountViewStatus
      }
      mainMenu {
        menuId
        menuTitle
        menuSequence
        menuLink
        menuExternal
      }
      pages {
        pageId
        pageName
        pageSlug
        pageLink
        pageContentType
        pageDescription
        pageAdditional
        pageActive
      }
      rows {
        gridId
        rowId
        rowType
        itemViewType
        sectionTitle
        sectionSubtitle
        sectionDescription
        rowItems {
          itemId
          itemTitle
          itemRowRel
          itemDescriptionId
          itemDescriptionTitle
          itemDescriptionSubTitle
          itemDescriptionFullDescription
          itemDescriptionViewStyle
          itemDescriptionRowRel
          itemName
          productTemplateId
          itemLink
          itemType
          itemAttributes
          itemImage {
            large
            medium
            small
          }
        }
      }
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
        variables: { themeType: "webfront" },
        fetchPolicy: forceRefresh ? "network-only" : "cache-first", // Toggle policy
        context: {
          api: "version8",
        },
      });

      console.log("data", data);

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
