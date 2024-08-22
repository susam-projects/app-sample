import { ProtectedRoute } from "@/common/components";
import { APP_START_ROUTE } from "@/common/constants";
import { authService } from "@/features/authentication";

export const NotAuthOnlyRoute = ({ ...props }) => {
  return (
    <ProtectedRoute
      isAllowed={!authService.isAuthenticated()}
      redirectPath={APP_START_ROUTE}
      {...props}
    />
  );
};
