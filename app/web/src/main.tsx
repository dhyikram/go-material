import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { MantineProvider } from "@mantine/core";
import Homepage from "./pages/Homepage";
import { RegisterPage } from "./pages/register";
import { QueryClient, QueryClientProvider } from "react-query";
import ProtectedRoutes from "./pages/protected";
import IssuesPage from "./pages/issues";
import ItemPages from "./pages/items";
import ReceivePages from "./pages/receive";
import NewItem from "./pages/items/new";
import NewReceive from "./pages/receive/new";
import NewIssues from "./pages/issues/new";

const RequireAuth = () => {

};

const LogoutPage = () => {
  localStorage.removeItem("jwt");
  return <LoginPage />;
};

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          <Route path="logout" element={<LogoutPage />} />
          <Route
            path="/"
            element={<ProtectedRoutes/>}
          >
          <Route path="items" element={<ItemPages />}  />
          <Route path="items/new" element={<NewItem />}  />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="issues/new" element={<NewIssues />} />
          <Route path="receive" element={<ReceivePages />} />
          <Route path="receive/new" element={<NewReceive />}  />
           
          </Route>
        </Routes>
      </BrowserRouter>
      </QueryClientProvider>

    </MantineProvider>
  </React.StrictMode>
);
