import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Shield,
  FileSpreadsheet,
  Upload,
  Clock,
  ChevronDown,
  User,
  Sparkles,
  Menu,
  Truck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenAuditLogs: () => void;
  onOpenDataImport: () => void;
  onNewTender: () => void;
  onNewCustomer: () => void;
  onRecordPayment: () => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenSearch,
  onOpenNotifications,
  onOpenRoleSwitcher,
  onOpenAuditLogs,
  onOpenDataImport,
  onNewTender,
  onNewCustomer,
  onRecordPayment,
  activeModule,
  setActiveModule,
}) => {
  const { activeRole, notifications, dateFilter, setDateFilter } = useApp();
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => !n.read && n.priority === 'Critical').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Hamburger menu toggle (mobile) & Search Trigger */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="flex lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            title="Toggle Menu Drawer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
        >
          <Search className="h-4 w-4 text-slate-400" />
          <span className="truncate text-left text-xs sm:text-sm">Search tenders, orders, invoices...</span>
          <kbd className="hidden rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Global Date Filter Selector */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Period:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="cursor-pointer bg-transparent font-medium text-slate-800 outline-none hover:text-blue-600"
          >
            <option value="Today">Today</option>
            <option value="This week">This week</option>
            <option value="This month">This month (Oct 2026)</option>
            <option value="This quarter">This quarter (Q3 FY26-27)</option>
            <option value="This year">This year (FY 2026-27)</option>
            <option value="Custom range">Custom range</option>
          </select>
        </div>
      </div>

      {/* Right: Actions, Notifications, Role, User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick New Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Action</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {quickMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setQuickMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setQuickMenuOpen(false);
                  onNewTender();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                <span>+ Create New Tender</span>
              </button>
              <button
                onClick={() => {
                  setQuickMenuOpen(false);
                  onNewCustomer();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <User className="h-4 w-4 text-emerald-600" />
                <span>+ Add Customer / Dept</span>
              </button>
              <button
                onClick={() => {
                  setQuickMenuOpen(false);
                  onRecordPayment();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex h-4 w-4 items-center justify-center font-bold text-amber-600 text-xs">₹</span>
                <span>Record Invoice Payment</span>
              </button>
              <button
                onClick={() => {
                  setQuickMenuOpen(false);
                  setActiveModule('logistics');
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <Truck className="h-4 w-4 text-purple-600" />
                <span>Logistics & Courier Hub</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setQuickMenuOpen(false);
                  onOpenDataImport();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
              >
                <Upload className="h-3.5 w-3.5 text-slate-400" />
                <span>Import Excel / CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Quick Button */}
        <button
          onClick={() => setActiveModule('ai-assistant')}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            activeModule === 'ai-assistant'
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600'
          }`}
          title="Open AI Business Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>

        {/* Audit Log Trigger */}
        <button
          onClick={onOpenAuditLogs}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          title="View Audit Trail"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Audit Log</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          title="Notification Center"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
                criticalCount > 0 ? 'bg-rose-600' : 'bg-blue-600'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Role Switcher Pill */}
        <button
          onClick={onOpenRoleSwitcher}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-700"
          title="Switch Active Access Role"
        >
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden sm:inline text-slate-500 font-normal">Role:</span>
          <span className="font-semibold text-slate-800">{activeRole}</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>
    </header>
  );
};
