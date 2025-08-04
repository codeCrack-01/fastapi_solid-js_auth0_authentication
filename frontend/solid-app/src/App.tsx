// App.tsx
import { createSignal, onMount, Show } from "solid-js";
import {
  initAuth,
  login,
  logout,
  isAuthenticated,
  getUser,
} from "./components/Auth";
import Protected from "./components/Protected";

export default function App() {
  const [authed, setAuthed] = createSignal(false);
  const [user, setUser] = createSignal<any>(null);

  onMount(async () => {
    await initAuth();
    const isAuth = await isAuthenticated();
    setAuthed(isAuth);
    if (isAuth) setUser(await getUser());
  });

  return (
    <main>
      <h1>SolidJS + Auth0 + FastAPI</h1>
      <Show when={authed()} fallback={<button onClick={login}>Login</button>}>
        <div>
          <p>Hello, {user()?.name}</p>
          <button onClick={logout}>Logout</button>
          <Protected />
        </div>
      </Show>
    </main>
  );
}
