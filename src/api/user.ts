import { gql } from "@apollo/client";

export const USER_PROFILE = gql`
  query {
    userProfile {
      fullname
      success
      message
      userId
      recentlyViewedPids {
        productTmplId
        viewCount
      }
      shippingAddressesConfig {
        title
        addText
        editText
        deleteText
      }
      shippingAddresses {
        cityId
        districtId
        baghorooId
        phone
        id
        addressTitle
        addressDetail
      }
      phone
      phone2
      userType
      companyRegister
      email
      birthday
      gender
      textRequests
      recentSearchList
    }
  }
`;


