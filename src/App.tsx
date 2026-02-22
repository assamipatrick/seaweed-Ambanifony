
import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { PERMISSIONS } from './permissions';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for better code splitting
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const SiteManagement = lazy(() => import('./pages/SiteManagement'));
const FarmerCredits = lazy(() => import('./pages/FarmerCredits'));
const SeaweedTypeManagement = lazy(() => import('./pages/SeaweedTypeManagement'));
const ModuleTracking = lazy(() => import('./pages/ModuleTracking').then(m => ({ default: m.ModuleTracking })));
const CultivationCycle = lazy(() => import('./pages/CultivationCycle'));
const HarvestProcessing = lazy(() => import('./pages/HarvestProcessing'));
const DryingPage = lazy(() => import('./pages/DryingPage'));
const BaggingPage = lazy(() => import('./pages/BaggingPage'));
const StockManagement = lazy(() => import('./inventory/on-site-storage'));
const FarmerManagement = lazy(() => import('./pages/FarmerManagement'));
const EmployeeManagement = lazy(() => import('./pages/EmployeeManagement'));
const PressedWarehouse = lazy(() => import('./inventory/pressed-warehouse'));
const Exports = lazy(() => import('./pages/Exports'));
const ServiceProviders = lazy(() => import('./pages/ServiceProviders'));
const FarmerDeliveries = lazy(() => import('./inventory/farmer-deliveries'));
const CuttingOperations = lazy(() => import('./pages/CuttingOperations'));
const SiteTransfers = lazy(() => import('./pages/SiteTransfers'));
const IncidentManagement = lazy(() => import('./pages/IncidentManagement'));
const IncidentTypeManagement = lazy(() => import('./pages/IncidentTypeManagement'));
const IncidentSeverityManagement = lazy(() => import('./pages/IncidentSeverityManagement'));
const DocumentPayments = lazy(() => import('./pages/DocumentPayments'));
const PeriodicTests = lazy(() => import('./pages/PeriodicTests'));
const FarmMap = lazy(() => import('./pages/FarmMap'));
const RoleManagement = lazy(() => import('./pages/RoleManagement'));
const PayrollCalculator = lazy(() => import('./pages/PayrollCalculator'));
const SiteCultivationCycles = lazy(() => import('./pages/SiteCultivationCycles'));
const SeaweedTypeCultivationCycles = lazy(() => import('./pages/SeaweedTypeCultivationCycles'));
const UserManual = lazy(() => import('./pages/UserManual'));
const OperationalCalendar = lazy(() => import('./pages/OperationalCalendar'));
const Reports = lazy(() => import('./pages/Reports'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const CuttingsLedger = lazy(() => import('./pages/CuttingsLedger'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <LocalizationProvider>
        <DataProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </NotificationProvider>
        </DataProvider>
      </LocalizationProvider>
    </SettingsProvider>
  );
};

const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsOfUse />} />
        
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute permission={PERMISSIONS.DASHBOARD_VIEW} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute />}>
             <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route element={<ProtectedRoute permission={PERMISSIONS.SETTINGS_VIEW} />}>
            <Route path="/settings" element={<Navigate to="/settings/general" />} />
            <Route path="/settings/general" element={<Settings />} />
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="/settings/roles" element={<RoleManagement />} />
            <Route path="/settings/incident-types" element={<IncidentTypeManagement />} />
            <Route path="/settings/incident-severities" element={<IncidentSeverityManagement />} />
          </Route>

          <Route element={<ProtectedRoute permission={PERMISSIONS.OPERATIONS_VIEW} />}>
            <Route path="/sites" element={<SiteManagement />} />
            <Route path="/sites/:siteId/cultivation" element={<SiteCultivationCycles />} />
            <Route path="/seaweed-types" element={<SeaweedTypeManagement />} />
            <Route path="/seaweed-types/:typeId/cultivation" element={<SeaweedTypeCultivationCycles />} />
            <Route path="/modules" element={<ModuleTracking />} />
            <Route path="/operations/cutting" element={<CuttingOperations />} />
            {/* FIX: Add the route for the Cuttings Ledger page. */}
            <Route path="/operations/cuttings-ledger" element={<CuttingsLedger />} />
            <Route path="/operations/map" element={<FarmMap />} />
            <Route path="/operations/calendar" element={<OperationalCalendar />} />
            <Route path="/cultivation" element={<CultivationCycle />} />
            <Route path="/harvesting" element={<HarvestProcessing />} />
            <Route path="/drying" element={<DryingPage />} />
            <Route path="/bagging" element={<BaggingPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission={PERMISSIONS.INVENTORY_VIEW} />}>
            <Route path="/inventory/on-site-storage" element={<StockManagement />} />
            <Route path="/inventory/farmer-deliveries" element={<FarmerDeliveries />} />
            <Route path="/inventory/site-transfers" element={<SiteTransfers />} />
            <Route path="/inventory/pressed-warehouse" element={<PressedWarehouse />} />
            <Route path="/exports" element={<Exports />} />
          </Route>

          <Route element={<ProtectedRoute permission={PERMISSIONS.STAKEHOLDERS_VIEW} />}>
            <Route path="/farmers" element={<FarmerManagement />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/providers" element={<ServiceProviders />} />
            <Route path="/farmer-credits" element={<FarmerCredits />} />
            <Route path="/document-payments" element={<DocumentPayments />} />
            <Route path="/payroll-calculator" element={<PayrollCalculator />} />
          </Route>

          <Route element={<ProtectedRoute permission={PERMISSIONS.MONITORING_VIEW} />}>
            <Route path="/monitoring/incidents" element={<IncidentManagement />} />
            <Route path="/monitoring/tests" element={<PeriodicTests />} />
          </Route>
          
          <Route element={<ProtectedRoute permission={PERMISSIONS.REPORTS_VIEW} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* User manual is always accessible for logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/manual" element={<UserManual />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
