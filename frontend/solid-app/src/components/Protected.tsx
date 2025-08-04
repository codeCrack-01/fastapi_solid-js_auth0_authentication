// components/Protected.tsx
import { createSignal, onMount, Show } from "solid-js";
import { getToken } from "./Auth";

export default function Protected() {
  const [response, setResponse] = createSignal("");
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal(false);

  onMount(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `API Error (${res.status}): ${errorData.detail || res.statusText}`,
        );
      }

      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
      setSuccess(true);
    } catch (err) {
      setError(`${err instanceof Error ? err.message : String(err)}`);
      setResponse("");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="card mt-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Protected API Response</h5>
        <Show when={loading()}>
          <div
            class="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </Show>
      </div>
      <div class="card-body">
        <Show
          when={error()}
          fallback={
            <Show
              when={success() && response()}
              fallback={
                <p class="text-center text-muted">Waiting for response...</p>
              }
            >
              <div class="alert alert-success">
                <strong>Authentication successful!</strong>
              </div>
              <pre class="bg-light p-3 border rounded">{response()}</pre>
            </Show>
          }
        >
          <div class="alert alert-danger">
            <strong>Error:</strong> {error()}
          </div>
          <div class="mt-3">
            <button
              class="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
