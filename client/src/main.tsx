import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "./components/ui/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Create a history object
const history = createBrowserHistory();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="html-editor-theme">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ThemeProvider>
);
