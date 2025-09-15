import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "db53e902-1a7b-4553-94c8-36ff29247b1c",  // From Azure
    authority: "https://login.microsoftonline.com/d2b5a349-bb86-4820-a3a5-41da5261d2b5", // Tenant ID
    redirectUri: `${window.location.origin}/login`,
    postLogoutRedirectUri: "/", 
    navigateToLoginRequestUrl: false, 
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read", "email"]
};

export const msalInstance = new PublicClientApplication(msalConfig);
