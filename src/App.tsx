import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  ShoppingCart,
  Truck,
  Navigation,
  Menu,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AuditLogModal } from './components/AuditLogModal';
import { AutomationRulesModal } from './components/AutomationRulesModal';
import { DataImportModal } from './components/DataImportModal';
import { NewTenderModal } from './modules/Tenders/NewTenderModal';
import { RecordPaymentModal } from './modules/Accounts/RecordPaymentModal';

// Modules
import { DashboardModule } from './modules/Dashboard/DashboardModule';
import { TendersModule } from './modules/Tenders/TendersModule';
import { AITenderAssistantModule } from './modules/AITenderAssistant/AITenderAssistantModule';
import { CRMModule } from './modules/CRM/CRMModule';
import { OrdersModule } from './modules/Orders/OrdersModule';
import { SupplyChainModule } from './modules/SupplyChain/SupplyChainModule';
import { LogisticsModule } from './modules/Logistics/LogisticsModule';
import { AccountsModule } from './modules/Accounts/AccountsModule';
import { TasksModule } from './modules/Tasks/TasksModule';
import { EmployeesModule } from './modules/Employees/EmployeesModule';
import { ReportsModule } from './modules/Reports/ReportsModule';
import { AIBusinessAssistantModule } from './modules/AIBusinessAssistant/AIBusinessAssistantModule';
import { DocumentsModule } from './modules/Documents/DocumentsModule';
import { SettingsModule } from './modules/Settings/SettingsModule';

const MainAppContent: React.FC = () => {
  const { tenders, orders, dispatches } = useApp();
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeTendersCount = tenders.filter(
    (t) => !['Won', 'Lost', 'Cancelled'].includes(t.status)
  ).length;
  const activeOrdersCount = orders.filter(
    (o) => !['Delivered', 'Completed', 'Cancelled'].includes(o.status)
  ).length;
  const activeDispatchesCount = dispatches.filter(
    (d) => d.deliveryStatus !== 'Delivered'
  ).length;

  // Global Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isAutomationRulesOpen, setIsAutomationRulesOpen] = useState(false);
  const [isDataImportOpen, setIsDataImportOpen] = useState(false);
  const [isNewTenderOpen, setIsNewTenderOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  // Cross-Navigation Target Record
  const [targetRecordId, setTargetRecordId] = useState<string | undefined>(undefined);

  // Handle global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (module: string, recordId?: string) => {
    setActiveModule(module);
    setTargetRecordId(recordId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={(mod) => {
          if (mod === 'automation') {
            setIsAutomationRulesOpen(true);
          } else {
            setActiveModule(mod);
            setTargetRecordId(undefined);
          }
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        } pl-0`}
      >
        {/* Top Header Navbar */}
        <Navbar
          onToggleMobileMenu={() => setMobileSidebarOpen((prev) => !prev)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
          onOpenDataImport={() => setIsDataImportOpen(true)}
          onNewTender={() => setIsNewTenderOpen(true)}
          onNewCustomer={() => {
            setActiveModule('crm');
            setTargetRecordId(undefined);
          }}
          onRecordPayment={() => setIsRecordPaymentOpen(true)}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />

        {/* Dynamic Module Page */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
          {activeModule === 'dashboard' && (
            <DashboardModule
              onNavigate={handleNavigate}
              onNewTender={() => setIsNewTenderOpen(true)}
            />
          )}

          {activeModule === 'tenders' && (
            <TendersModule
              onNavigateOrder={(ordId) => handleNavigate('orders', ordId)}
              selectedTenderId={targetRecordId}
            />
          )}

          {activeModule === 'ai-tender' && (
            <AITenderAssistantModule onNavigateTenders={() => setActiveModule('tenders')} />
          )}

          {activeModule === 'crm' && (
            <CRMModule
              onNavigateTender={(tId) => handleNavigate('tenders', tId)}
              onNavigateOrder={(ordId) => handleNavigate('orders', ordId)}
            />
          )}

          {activeModule === 'orders' && (
            <OrdersModule
              onNavigateTender={(tId) => handleNavigate('tenders', tId)}
              onNavigateCustomer={(cId) => handleNavigate('crm', cId)}
              onNavigateLogistics={(dispId) => handleNavigate('logistics', dispId)}
              selectedOrderId={targetRecordId}
            />
          )}

          {activeModule === 'supply-chain' && (
            <SupplyChainModule
              onNavigateOrder={(ordId) => handleNavigate('orders', ordId)}
              onNavigateLogistics={(dispId) => handleNavigate('logistics', dispId)}
              selectedProductId={targetRecordId}
            />
          )}

          {activeModule === 'logistics' && (
            <LogisticsModule
              onNavigateOrder={(ordId) => handleNavigate('orders', ordId)}
              selectedDispatchId={targetRecordId}
            />
          )}

          {activeModule === 'accounts' && (
            <AccountsModule
              onNavigateOrder={(ordId) => handleNavigate('orders', ordId)}
              selectedInvoiceId={targetRecordId}
            />
          )}

          {activeModule === 'tasks' && <TasksModule />}

          {activeModule === 'employees' && <EmployeesModule />}

          {activeModule === 'reports' && <ReportsModule />}

          {activeModule === 'ai-assistant' && <AIBusinessAssistantModule />}

          {activeModule === 'documents' && <DocumentsModule />}

          {activeModule === 'settings' && <SettingsModule />}
        </main>

        {/* Mobile Persistent Bottom Quick Navigation Bar */}
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur-md shadow-lg"
        >
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
              activeModule === 'dashboard'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate('tenders')}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
              activeModule === 'tenders'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="h-5 w-5 mb-0.5" />
            <span>Tenders</span>
            {activeTendersCount > 0 && (
              <span className="absolute top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                {activeTendersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavigate('orders')}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
              activeModule === 'orders'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            <span>Orders</span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavigate('logistics')}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
              activeModule === 'logistics'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Navigation className="h-5 w-5 mb-0.5" />
            <span>Logistics</span>
            {activeDispatchesCount > 0 && (
              <span className="absolute top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                {activeDispatchesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <Menu className="h-5 w-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />

      <AuditLogModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      <AutomationRulesModal
        isOpen={isAutomationRulesOpen}
        onClose={() => setIsAutomationRulesOpen(false)}
      />

      <DataImportModal
        isOpen={isDataImportOpen}
        onClose={() => setIsDataImportOpen(false)}
      />

      <NewTenderModal
        isOpen={isNewTenderOpen}
        onClose={() => setIsNewTenderOpen(false)}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
