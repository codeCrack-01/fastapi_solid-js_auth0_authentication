// App.tsx
import { onMount, Show } from "solid-js";
import {
  initAuth,
  login,
  logout,
  isAuthenticated,
  user,
  isLoading,
  authError,
} from "./components/Auth";
import Protected from "./components/Protected";

// Import Bootstrap CSS in the application
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  onMount(async () => {
    await initAuth();
  });

  return (
    <div class="container py-4">
      <header class="pb-3 mb-4 border-bottom">
        <div class="d-flex align-items-center justify-content-between">
          <h1 class="h3 mb-0 text-primary">OrderOne Authentication</h1>
          <Show
            when={isAuthenticated()}
            fallback={
              <button
                class="btn btn-primary"
                onClick={() => login()}
                disabled={isLoading()}
              >
                <Show when={isLoading()} fallback="Login with Auth0">
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Loading...
                </Show>
              </button>
            }
          >
            <div class="d-flex align-items-center">
              <div class="me-3">
                <img
                  src={user()?.picture}
                  alt="Profile"
                  class="rounded-circle"
                  width="32"
                  height="32"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user()?.name || "User");
                  }}
                />
                <span class="ms-2">Hello, {user()?.name}</span>
              </div>
              <button class="btn btn-outline-danger" onClick={logout}>
                Logout
              </button>
            </div>
          </Show>
        </div>
      </header>

      <main>
        <Show when={authError()}>
          <div class="alert alert-danger" role="alert">
            <strong>Authentication Error:</strong> {authError()}
          </div>
        </Show>

        <div class="p-4 mb-4 bg-light rounded-3">
          <div class="container-fluid py-5">
            <h1 class="display-5 fw-bold">SolidJS + Auth0 + FastAPI</h1>
            <p class="col-md-8 fs-4">
              This is a sample application demonstrating authentication with
              Auth0 in a SolidJS and FastAPI application.
            </p>
            <Show when={!isAuthenticated() && !isLoading()}>
              <button class="btn btn-primary btn-lg" onClick={() => login()}>
                Get Started
              </button>
            </Show>
          </div>
        </div>

        <Show when={isAuthenticated()}>
          <Protected />
        </Show>
      </main>

      <footer class="pt-3 mt-4 text-muted border-top">
        &copy; {new Date().getFullYear()} OrderOne App
      </footer>
    </div>
  );
}
