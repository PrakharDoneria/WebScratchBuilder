import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserHistory } from "history";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Create a history object
const history = createBrowserHistory();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
