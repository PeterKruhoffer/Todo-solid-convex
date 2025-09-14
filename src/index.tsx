/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { ConvexContext } from "./cvxsolid";
import { ConvexClient } from "convex/browser";
import "solid-devtools";

import App from "./App";
import { Tasks } from "./Tasks";

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL!);

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <ConvexContext.Provider value={convex}>
      <Router>
        <Route path="/" component={App} />
        <Route path="/tasks" component={Tasks} />
      </Router>
    </ConvexContext.Provider>
  ),
  root!,
);
