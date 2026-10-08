import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Sparkles,
  Users,
  ShoppingCart,
  Truck,
  IndianRupee,
  CheckSquare,
  Contact,
  BarChart3,
  Bot,
  FolderArchive,
  Zap,
  Settings,
  Package,
  Layers,
  ChevronRight,
  Navigation,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  onOpenRoleSwitcher: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
  onOpenRoleSwitcher,
}) => {
  const { tenders, orders, tasks, products, dispatches, activeRole } = useApp();

  const activeTendersCount = tenders.filter(
    (t) => !['Won', 'Lost', 'Cancelled'].includes(t.status)
  ).length;

  const activeOrdersCount = orders.filter(
    (o) => !['Delivered', 'Completed', 'Cancelled'].includes(o.status)
  ).length;

  const activeDispatchesCount = dispatches.filter(
    (d) => d.deliveryStatus !== 'Delivered'
  ).length;

  const overdueTasksCount = tasks.filter((t) => t.status === 'Overdue').length;
  const lowStockCount = products.filter(
    (p) => p.stockStatus === 'Low Stock' || p.quantityAvailable <= p.minimumStock
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      badge: null,
      section: 'OVERVIEW',
    },
    {
      id: 'tenders',
      label: 'Tender Management',
      icon: FileSpreadsheet,
      badge: activeTendersCount > 0 ? activeTendersCount : null,
      badgeColor: 'bg-blue-100 text-blue-700',
      section: 'TENDERS & DEALS',
    },
    {
      id: 'ai-tender',
      label: 'AI Tender Assistant',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold',
      section: 'TENDERS & DEALS',
    },
    {
      id: 'crm',
      label: 'CRM & Customers',
      icon: Users,
      badge: null,
      section: 'TENDERS & DEALS',
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingCart,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      section: 'OPERATIONS',
    },
    {
      id: 'supply-chain',
      label: 'Supply Chain & Inventory',
      icon: Truck,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      section: 'OPERATIONS',
    },
    {
      id: 'logistics',
      label: 'Logistics & Couriers',
      icon: Navigation,
      badge: activeDispatchesCount > 0 ? `${activeDispatchesCount} active` : null,
      badgeColor: 'bg-blue-100 text-blue-800 font-semibold',
      section: 'OPERATIONS',
    },
    {
      id: 'accounts',
      label: 'Accounts & Invoices',
      icon: IndianRupee,
      badge: null,
      section: 'FINANCE',
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: CheckSquare,
      badge: overdueTasksCount > 0 ? `${overdueTasksCount} overdue` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
      section: 'ORGANIZATION',
    },
    {
      id: 'employees',
      label: 'Employee / HR',
      icon: Contact,
      badge: null,
      section: 'ORGANIZATION',
    },
    {
      id: 'documents',
      label: 'Central Documents',
      icon: FolderArchive,
      badge: null,
      section: 'ORGANIZATION',
    },
    {
      id: 'reports',
      label: 'MIS & Reports',
      icon: BarChart3,
      badge: null,
      section: 'INTELLIGENCE',
    },
    {
      id: 'ai-assistant',
      label: 'AI Business Assistant',
      icon: Bot,
      badge: 'Live',
      badgeColor: 'bg-purple-100 text-purple-700',
      section: 'INTELLIGENCE',
    },
    {
      id: 'automation',
      label: 'Automation Engine',
      icon: Zap,
      badge: null,
      section: 'SYSTEM',
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      badge: null,
      section: 'SYSTEM',
    },
  ];

  const handleSelectModule = (id: string) => {
    setActiveModule(id);
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          {!collapsed || mobileOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-base">Geo Digital</span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[10px] font-bold text-blue-700 tracking-wider">
                    OS
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 truncate max-w-[140px]">
                  USHA Institutional Supply
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold shadow-md">
              <Package className="h-5 w-5" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Layers className="h-4 w-4" />
            </button>

            {/* Mobile Close Button */}
            {setMobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="flex lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Close Menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const prevItem = navItems[index - 1];
            const showSectionHeading =
              (!collapsed || mobileOpen) && (!prevItem || prevItem.section !== item.section);

            return (
              <React.Fragment key={item.id}>
                {showSectionHeading && (
                  <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 tracking-wider">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => handleSelectModule(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={item.label}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {(!collapsed || mobileOpen) && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-none ${
                            item.badgeColor || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

      {/* Role and User Footer */}
      <div className="border-t border-slate-200 p-3">
        {!collapsed ? (
          <div
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold text-xs shadow-xs">
              GD
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-semibold text-slate-800">Geo Digital Admin</p>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="truncate text-[11px] text-blue-600 font-medium">Role: {activeRole}</p>
            </div>
          </div>
        ) : (
          <div
            onClick={onOpenRoleSwitcher}
            className="flex h-9 w-9 mx-auto items-center justify-center rounded-lg bg-slate-900 text-white font-semibold text-xs cursor-pointer shadow-xs"
            title={`Active Role: ${activeRole} (Click to switch)`}
          >
            GD
          </div>
        )}
      </div>
    </aside>
  </>
);
};
