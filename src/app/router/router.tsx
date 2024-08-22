import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthOnlyRoute, NotAuthOnlyRoute } from "@/common/components";
import {
  AddCompanyForm,
  DuplicateCompanyForm,
  EditCompanyForm,
} from "@/composite-features/companyForm";
import {
  CreateDeviceForm,
  DuplicateDeviceForm,
  EditDeviceForm,
} from "@/composite-features/deviceForm";
import {
  ModuleChangeStatusForm,
  ModuleCopyConfigurationForm,
  ModuleListForm,
} from "@/composite-features/moduleForm";
import {
  CreateReplicationSiteForm,
  DuplicateReplicationSiteForm,
  EditReplicationSiteForm,
} from "@/composite-features/replicationSiteForm";
import { EditServerForm } from "@/composite-features/serverForm";
import {
  CreateShopForm,
  DuplicateShopForm,
  EditShopForm,
} from "@/composite-features/shopForm";
import {
  AddTenantForm,
  DuplicateTenantForm,
  EditTenantForm,
} from "@/composite-features/tenantForm";
import { HistoryForm } from "@/features/history";
import { AuthPage, ErrorPage, ObjectsPage } from "@/pages";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />} errorElement={<ErrorPage />}>
      <Route index element={<Navigate to="/auth" replace />} />

      <Route
        path="auth"
        element={
          <NotAuthOnlyRoute>
            <AuthPage />
          </NotAuthOnlyRoute>
        }
      />

      <Route element={<AuthOnlyRoute />}>
        <Route path="objects" element={<ObjectsPage />}>
          <Route index element={<div />} />

          <Route path="server/edit" element={<EditServerForm />} />

          <Route path="tenant/add" element={<AddTenantForm />} />
          <Route path="tenant/duplicate" element={<DuplicateTenantForm />} />
          <Route path="tenant/edit" element={<EditTenantForm />} />

          <Route
            path="replicationsite/add"
            element={<CreateReplicationSiteForm />}
          />
          <Route
            path="replicationsite/duplicate"
            element={<DuplicateReplicationSiteForm />}
          />
          <Route
            path="replicationsite/edit"
            element={<EditReplicationSiteForm />}
          />

          <Route path="company/add" element={<AddCompanyForm />} />
          <Route path="company/duplicate" element={<DuplicateCompanyForm />} />
          <Route path="company/edit" element={<EditCompanyForm />} />

          <Route path="shop/add" element={<CreateShopForm />} />
          <Route path="shop/duplicate" element={<DuplicateShopForm />} />
          <Route path="shop/edit" element={<EditShopForm />} />

          <Route path="device/add" element={<CreateDeviceForm />} />
          <Route path="device/duplicate" element={<DuplicateDeviceForm />} />
          <Route path="device/edit" element={<EditDeviceForm />} />

          <Route path="module/list" element={<ModuleListForm />} />
          <Route path="module/copy" element={<ModuleCopyConfigurationForm />} />
          <Route
            path="module/change-status"
            element={<ModuleChangeStatusForm />}
          />

          <Route path="history" element={<HistoryForm />} />

          <Route path="*" element={<Navigate to="/objects" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  ),
);
