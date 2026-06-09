import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, RoleGuard } from "../components/auth";
import { DashboardLayout } from "../components/layout";
import { DashboardPage } from "../pages/DashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { LoginPage } from "../pages/LoginPage";
import { ModulePlaceholderPage } from "../pages/ModulePlaceholderPage";
import { UserListPage } from "../pages/UserListPage";
import { UserCreatePage } from "../pages/UserCreatePage";
import { UserEditPage } from "../pages/UserEditPage";
import { UserDetailPage } from "../pages/UserDetailPage";
import { UserPermissionsPage } from "../pages/UserPermissionsPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductCreatePage } from "../pages/ProductCreatePage";
import { ProductEditPage } from "../pages/ProductEditPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProductVariantsPage } from "../pages/ProductVariantsPage";
import { ProductImagesPage } from "../pages/ProductImagesPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { CategoryCreatePage } from "../pages/CategoryCreatePage";
import { CategoryEditPage } from "../pages/CategoryEditPage";
import { BrandsPage } from "../pages/BrandsPage";
import { BrandCreatePage } from "../pages/BrandCreatePage";
import { BrandEditPage } from "../pages/BrandEditPage";
// Inventory Routes
import { InventoryPage } from "../pages/inventory/InventoryPage";
import { AdjustmentsPage } from "../pages/inventory/AdjustmentsPage";
import { MovementsPage } from "../pages/inventory/MovementsPage";
import { SerialsPage } from "../pages/inventory/SerialsPage";
// Suppliers Routes
import { SupplierListPage } from "../pages/suppliers/SupplierListPage";
import { CreateSupplierPage } from "../pages/suppliers/CreateSupplierPage";
import { SupplierDetailPage } from "../pages/suppliers/SupplierDetailPage";
import { EditSupplierPage } from "../pages/suppliers/EditSupplierPage";
import { ManageContactsPage } from "../pages/suppliers/ManageContactsPage";
// Purchase Orders Routes
import { PurchaseOrderListPage } from "../pages/purchases/PurchaseOrderListPage";
import { CreatePOPage } from "../pages/purchases/CreatePOPage";
import { PODetailPage } from "../pages/purchases/PODetailPage";
import { ReceivePOPage } from "../pages/purchases/ReceivePOPage";
// POS Routes
import POSPage from "../pages/pos/POSPage";
// Customers Routes
import CustomersPage from "../pages/customers/CustomersPage";
import CustomerCreatePage from "../pages/customers/CustomerCreatePage";
import CustomerDetailPage from "../pages/customers/CustomerDetailPage";
import CustomerEditPage from "../pages/customers/CustomerEditPage";
import CustomerPurchasesPage from "../pages/customers/CustomerPurchasesPage";
// Warranty Routes
import WarrantiesPage from "../pages/warranties/WarrantiesPage";
import WarrantyLookupPage from "../pages/warranties/WarrantyLookupPage";
import WarrantyClaimPage from "../pages/warranties/WarrantyClaimPage";
import WarrantyDetailPage from "../pages/warranties/WarrantyDetailPage";
// Repairs Routes
import RepairsPage from "../pages/repairs/RepairsPage";
// Receipts Routes
import ReceiptsPage from "../pages/receipts/ReceiptsPage";
// Reports Routes
import ReportsPage from "../pages/reports/ReportsPage";
import SalesReportPage from "../pages/reports/SalesReportPage";
// Settings Routes
import SettingsPage from "../pages/settings/SettingsPage";
import ShopSettingsPage from "../pages/settings/ShopSettingsPage";
import TaxSettingsPage from "../pages/settings/TaxSettingsPage";
import ReceiptSettingsPage from "../pages/settings/ReceiptSettingsPage";
import PrinterSettingsPage from "../pages/settings/PrinterSettingsPage";
import BarcodeSettingsPage from "../pages/settings/BarcodeSettingsPage";
import PreferenceSettingsPage from "../pages/settings/PreferenceSettingsPage";
import SystemSettingsPage from "../pages/settings/SystemSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <RoleGuard allowedRoles={["admin", "owner"]}>
            <DashboardPage />
          </RoleGuard>
        ),
      },
      // User Management Routes
      {
        path: "/users",
        element: (
          <RoleGuard allowedRoles={["admin", "owner"]}>
            <UserListPage />
          </RoleGuard>
        ),
      },
      {
        path: "/users/create",
        element: (
          <RoleGuard allowedRoles={["admin", "owner"]}>
            <UserCreatePage />
          </RoleGuard>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <RoleGuard allowedRoles={["admin", "owner"]}>
            <UserDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: "/users/:id/edit",
        element: (
          <RoleGuard allowedRoles={["admin", "owner"]}>
            <UserEditPage />
          </RoleGuard>
        ),
      },
      {
        path: "/users/:id/permissions",
        element: (
          <RoleGuard allowedRoles={["admin", "owner"]}>
            <UserPermissionsPage />
          </RoleGuard>
        ),
      },
      // Profile Routes
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      // Product Catalog Routes
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/create",
        element: <ProductCreatePage />,
      },
      {
        path: "/products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/products/:id/edit",
        element: <ProductEditPage />,
      },
      {
        path: "/products/:id/variants",
        element: <ProductVariantsPage />,
      },
      {
        path: "/products/:id/images",
        element: <ProductImagesPage />,
      },
      // Category Routes
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/categories/create",
        element: <CategoryCreatePage />,
      },
      {
        path: "/categories/:id/edit",
        element: <CategoryEditPage />,
      },
      // Brand Routes
      {
        path: "/brands",
        element: <BrandsPage />,
      },
      {
        path: "/brands/create",
        element: <BrandCreatePage />,
      },
      {
        path: "/brands/:id/edit",
        element: <BrandEditPage />,
      },
      // Inventory Routes
      {
        path: "/inventory",
        element: <InventoryPage />,
      },
      {
        path: "/inventory/adjustments",
        element: <AdjustmentsPage />,
      },
      {
        path: "/inventory/movements",
        element: <MovementsPage />,
      },
      {
        path: "/inventory/serials",
        element: <SerialsPage />,
      },
      // Suppliers Routes
      {
        path: "/suppliers",
        element: <SupplierListPage />,
      },
      {
        path: "/suppliers/create",
        element: <CreateSupplierPage />,
      },
      {
        path: "/suppliers/:id",
        element: <SupplierDetailPage />,
      },
      {
        path: "/suppliers/:id/edit",
        element: <EditSupplierPage />,
      },
      {
        path: "/suppliers/:id/contacts",
        element: <ManageContactsPage />,
      },
      // Purchase Orders Routes
      {
        path: "/purchase-orders",
        element: <PurchaseOrderListPage />,
      },
      {
        path: "/purchase-orders/create",
        element: <CreatePOPage />,
      },
      {
        path: "/purchase-orders/:id",
        element: <PODetailPage />,
      },
      {
        path: "/purchase-orders/:id/receive",
        element: <ReceivePOPage />,
      },
      // POS Routes
      {
        path: "/pos",
        element: <POSPage />,
      },
      // Customers Routes
      {
        path: "/customers",
        element: <CustomersPage />,
      },
      {
        path: "/customers/create",
        element: <CustomerCreatePage />,
      },
      {
        path: "/customers/:id",
        element: <CustomerDetailPage />,
      },
      {
        path: "/customers/:id/edit",
        element: <CustomerEditPage />,
      },
      {
        path: "/customers/:id/purchases",
        element: <CustomerPurchasesPage />,
      },
      // Warranty Routes
      {
        path: "/warranties",
        element: <WarrantiesPage />,
      },
      {
        path: "/warranties/lookup",
        element: <WarrantyLookupPage />,
      },
      {
        path: "/warranties/claim",
        element: <WarrantyClaimPage />,
      },
      {
        path: "/warranties/:id",
        element: <WarrantyDetailPage />,
      },
      // Repairs Routes
      {
        path: "/repairs",
        element: <RepairsPage />,
      },
      // Receipts Routes
      {
        path: "/receipts",
        element: <ReceiptsPage />,
      },
      // Reports Routes
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      {
        path: "/reports/sales",
        element: <SalesReportPage />,
      },
      // Settings Routes
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/settings/shop",
        element: <ShopSettingsPage />,
      },
      {
        path: "/settings/tax",
        element: <TaxSettingsPage />,
      },
      {
        path: "/settings/receipts",
        element: <ReceiptSettingsPage />,
      },
      {
        path: "/settings/printers",
        element: <PrinterSettingsPage />,
      },
      {
        path: "/settings/barcodes",
        element: <BarcodeSettingsPage />,
      },
      {
        path: "/settings/preferences",
        element: <PreferenceSettingsPage />,
      },
      {
        path: "/settings/system",
        element: <SystemSettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
