import AuthPage from "./auth";
import ProtectedRoute from "../components/ProtectedRoute";
import { Main } from "~/components/main/main";

export const routes = [
  {
    path: "/auth",
    element: <ProtectedRoute element={<AuthPage />} redirectPath="/" />,
  },
  {
    path: "/",
    element: <Main />,
  },
];
