import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserHistory } from "history";

// Create a history object
const history = createBrowserHistory();

createRoot(document.getElementById("root")!).render(<App />);
