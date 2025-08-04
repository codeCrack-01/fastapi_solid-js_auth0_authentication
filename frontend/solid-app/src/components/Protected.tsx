// components/Protected.tsx
import { createSignal, onMount } from "solid-js";
import { getToken } from "./Auth";

export default function Protected() {
  const [response, setResponse] = createSignal("");

  onMount(async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (err) {
      setResponse("Error: " + String(err));
    }
  });

  return (
    <div>
      <h2>Protected API Response:</h2>
      <pre>{response()}</pre>
    </div>
  );
}
