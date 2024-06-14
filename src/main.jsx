import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ErrorPage from "./components/error-page";
import Root, { action as rootAction, loader as rootLoader } from "./root";
import Index from "./routes";
import Contact, {
  action as contactAction,
  loader as contactLoader,
} from "./routes/contact";
import { action as destroyContactAction } from "./routes/destroy";
import EditContact, {
  action as editContactAction,
  loader as editContactLoader,
} from "./routes/edit";
import "./styles/index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={editContactLoader}
          action={editContactAction}
        />
        <Route
          path="contacts/:contactId/destroy"
          action={destroyContactAction}
        />
      </Route>
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
