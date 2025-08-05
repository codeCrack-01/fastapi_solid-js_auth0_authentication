// components/Auth.ts
import { createAuth0Client } from "@auth0/auth0-spa-js";
import type {
  Auth0Client,
  RedirectLoginOptions,
  LogoutOptions,
} from "@auth0/auth0-spa-js";
import { createSignal } from "solid-js";

// Create signals for auth state
export const [isLoading, setIsLoading] = createSignal(true);
export const [isAuthenticated, setIsAuthenticated] = createSignal(false);
export const [user, setUser] = createSignal<any>(null);
export const [authError, setAuthError] = createSignal<string | null>(null);

// Auth0 configuration
const config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
  cacheLocation: "localstorage" as "localstorage" | "memory",
};

let auth0: Auth0Client;

export async function initAuth() {
  try {
    setIsLoading(true);
    setAuthError(null);

    auth0 = await createAuth0Client(config);

    // Handle redirect callback
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      try {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("Error handling redirect:", err);
        setAuthError(
          `Error handling login redirect: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // Update authentication state
    const authenticated = await auth0.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const userData = await auth0.getUser();
      setUser(userData);
    }
  } catch (err) {
    console.error("Auth initialization error:", err);
    setAuthError(
      `Auth initialization error: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    setIsLoading(false);
  }
}

export const login = async (options?: RedirectLoginOptions) => {
  try {
    setAuthError(null);
    await auth0.loginWithRedirect(options);
  } catch (err) {
    console.error("Login error:", err);
    setAuthError(
      `Login error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
};

export const logout = async () => {
  try {
    setAuthError(null);
    await auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    } as LogoutOptions);
  } catch (err) {
    console.error("Logout error:", err);
    setAuthError(
      `Logout error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
};

export const getToken = async () => {
  try {
    setAuthError(null);
    return await auth0.getTokenSilently();
  } catch (err) {
    console.error("Error getting token:", err);
    setAuthError(
      `Error getting token: ${err instanceof Error ? err.message : String(err)}`,
    );
    throw err;
  }
};

export const getUser = async () => {
  try {
    return await auth0.getUser();
  } catch (err) {
    console.error("Error getting user:", err);
    setAuthError(
      `Error getting user: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
};
