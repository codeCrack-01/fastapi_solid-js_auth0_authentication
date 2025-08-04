// components/Auth.ts
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

let auth0: Auth0Client;

export async function initAuth() {
  auth0 = await createAuth0Client({
    domain: "your-domain.auth0.com",
    client_id: "your-client-id",
    redirect_uri: window.location.origin,
    audience: "your-api-identifier",
  });

  if (
    window.location.search.includes("code=") &&
    window.location.search.includes("state=")
  ) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }
}

export const login = () => auth0.loginWithRedirect();
export const logout = () => auth0.logout({ returnTo: window.location.origin });
export const getToken = () => auth0.getTokenSilently();
export const getUser = () => auth0.getUser();
export const isAuthenticated = () => auth0.isAuthenticated();
