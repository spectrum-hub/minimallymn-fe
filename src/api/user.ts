import { gql } from "@apollo/client";

export const USER_PROFILE = gql`
  query {
    userProfile {
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

export const USER_INFO_UPDATE = gql`
  mutation userInfoUpdate(
    $cityId: String
    $districtId: String
    $baghorooId: String
    $street: String
    $street2: String
    $name: String
    $email: String
  ) {
    userInfo(
      cityId: $cityId
      districtId: $districtId
      baghorooId: $baghorooId
      street: $street
      street2: $street2
      name: $name
      email: $email
    ) {
      success
      message
      userId
      userData
      pdata
      clientIp
    }
  }
`;
