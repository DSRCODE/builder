import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";
import Auth0ProviderWithHistory from "./auth0-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <Auth0ProviderWithHistory>
    <App />
  </Auth0ProviderWithHistory>
);
