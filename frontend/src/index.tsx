import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Event } from "components/screens/event";
import { CreateEvent } from "components/screens/eventCreate";
import { EditEvent } from "components/screens/eventEdit";
import { Events } from "components/screens/events";
import { CreateUser } from "components/screens/userCreate";
import { EditUser } from "components/screens/userEdit";
import { UsersAdministration } from "components/screens/usersAdministration";
import { CreateVenue } from "components/screens/venueCreate";
import { EditVenue } from "components/screens/venueEdit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Categories } from "./components/screens/categories";
import { CategoryApproval } from "./components/screens/categoryApproval";
import { EventApproval } from "./components/screens/eventApproval";
import { EventCalendarScreen } from "./components/screens/eventCalendarScreen";
import { Fallback } from "./components/screens/fallback";
import { Login } from "./components/screens/login";
import { Logout } from "./components/screens/logout";
import { Register } from "./components/screens/register";
import { VenueApproval } from "./components/screens/venueApproval";
import { VenueDetail, Venues } from "./components/screens/venues";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Events />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/venues",
        element: <Venues />,
      },
      {
        path: "/venues/:id",
        element: <VenueDetail />,
      },
      {
        path: "/event/:id",
        element: <Event />,
      },
      {
        path: "/event/create",
        element: <CreateEvent />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/venues/create",
        element: <CreateVenue />,
      },
      {
        path: "/approve/categories",
        element: <CategoryApproval />,
      },
      {
        path: "/approve/venues",
        element: <VenueApproval />,
      },
      {
        path: "/approve/events",
        element: <EventApproval />,
      },
      {
        path: "/venues/:id/edit",
        element: <EditVenue />,
      },
      {
        path: "/event-calendar",
        element: <EventCalendarScreen />,
      },
      {
        path: "/administration/users",
        element: <UsersAdministration />,
      },
      {
        path: "/user/:id/edit",
        element: <EditUser />,
      },
      {
        path: "/user/create",
        element: <CreateUser />,
      },
      {
        path: "/event/:id/edit",
        element: <EditEvent />,
      },
    ],
  },
  { path: "/*", element: <Fallback /> },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
