import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  element: React.ReactElement;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  redirectPath = "/",
}) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default ProtectedRoute;
