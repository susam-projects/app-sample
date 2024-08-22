import { FC, ReactNode } from "react";

import { Navigate, Outlet } from "react-router-dom";

interface IProtectedRoute {
  isAllowed: boolean;
  redirectPath?: string;
  children?: ReactNode;
}

export const ProtectedRoute: FC<IProtectedRoute> = ({
  isAllowed,
  redirectPath = "auth",
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
