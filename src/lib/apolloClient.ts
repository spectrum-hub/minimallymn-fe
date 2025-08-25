import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AUTH_SESSION_ID, CLIENT_CUSTOMER_TOKEN } from "../Constants";
import { decryptData } from "./helpers";
import { baseURL } from "./configs";
import { ApiContextType } from "../types/Common";

// Create links for each GraphQL endpoint
const coreLink = new HttpLink({ uri: `${baseURL}/api/v1/graphql` });
const commerceLink = new HttpLink({ uri: `${baseURL}/api/v3/graphql` });

// Function to safely retrieve decrypted auth token
const getAuthToken = () => {
  try {
    const encryptedToken = localStorage.getItem(AUTH_SESSION_ID);
    return encryptedToken ? decryptData(encryptedToken) : "";
  } catch (error) {
    console.error("Failed to decrypt auth token:", error);
    return "";
  }
};

const authLink = setContext(() => {
  const clientToken = localStorage.getItem(CLIENT_CUSTOMER_TOKEN) ?? "";
  const authToken = getAuthToken();

  return {
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
      "x-client-token": clientToken,
    },
  };
});

const dynamicLink = ApolloLink.split(
  (operation) => (operation.getContext().api as ApiContextType) === "commerce",
  commerceLink,
  coreLink
);

export const apolloClient = new ApolloClient({
  link: authLink.concat(dynamicLink),
  cache: new InMemoryCache(),
  //  connectToDevTools: true,
});
