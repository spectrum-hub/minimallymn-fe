import { gql } from "@apollo/client";

export const USER_INFO = gql`
  mutation userInfo {
    userInfo {
      success
      message
      userData
      pdata
      address
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



