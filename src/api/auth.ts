import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      message
      sessionId
      type
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $action: String!
    $smsPassword: String
  ) {
    register(
      name: $username
      username: $username
      password: ""
      confirmPassword: ""
      smsPassword: $smsPassword
      action: $action
    ) {
      success
      message
      userId
      sessionId
      desc
      status
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation mobileLogin($username: String!, $action: String!) {
    mobileLogin(
      name: ""
      username: $username
      password: ""
      confirmPassword: ""
      smsPassword: ""
      action: $action
    ) {
      success
      message
      userId
      sessionId
      desc
      status
    }
  }
`;

export const VALIDATE_OTP = gql`
  mutation mobileLogin(
    $username: String!
    $action: String!
    $smsPassword: String!
  ) {
    mobileLogin(
      name: ""
      username: $username
      password: ""
      confirmPassword: ""
      smsPassword: $smsPassword
      action: $action
    ) {
      success
      message
      userId
      sessionId
      desc
    }
  }
`;

export const VALIDATE_SESSION = gql`
  mutation validateSession($sessionId: String!) {
    validateSession(sessionId: $sessionId) {
      valid
      message
    }
  }
`;

