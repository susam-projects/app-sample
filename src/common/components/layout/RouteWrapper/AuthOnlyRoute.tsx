import { ProtectedRoute } from "@/common/components";
import { authService } from "@/features/authentication";

export const AuthOnlyRoute = ({ ...props }) => {
  return (
    <ProtectedRoute isAllowed={authService.isAuthenticated()} {...props} />
  );
};
