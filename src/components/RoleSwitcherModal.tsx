import React from 'react';
import { X, Shield, Check, Lock, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { activeRole, setActiveRole, addAuditLog } = useApp();

  if (!isOpen) return null;

  const roles: {
    role: UserRole;
    title: string;
    description: string;
    allowedModules: string[];
    restrictedData: string[];
  }[] = [
    {
      role: 'Management',
      title: 'Executive Management (CEO/COO)',
      description: 'Full strategic visibility across all company modules, executive MIS, analytics, and final sign-offs.',
      allowedModules: ['All Modules', 'Executive MIS', 'Financial Statements', 'Tender Approval', 'System Settings'],
      restrictedData: ['None - Unrestricted View'],
    },
    {
      role: 'Admin',
      title: 'System Administrator',
      description: 'Total configuration rights, automation rules, database maintenance, user roles, and security audit logs.',
      allowedModules: ['All Modules', 'Automation Engine', 'Audit Logs', 'Data Import/Export', 'Settings'],
      restrictedData: ['None - Full System Control'],
    },
    {
      role: 'Tender Team',
      title: 'Tender & Bidding Specialist',
      description: 'Tender discovery, bid preparation, document checklist, AI tender analysis, portal submission tracking.',
      allowedModules: ['Tender Management', 'AI Tender Assistant', 'Tender Documents', 'Customer CRM (Read-Only)'],
      restrictedData: ['Accounts Profit Margins', 'Employee Compensation / HR Records'],
    },
    {
      role: 'Supply Chain',
      title: 'Supply Chain & Logistics',
      description: 'Order fulfillment, USHA OEM procurement, warehouse inventory reservation, truck dispatches, and LR tracking.',
      allowedModules: ['Orders', 'Inventory Management', 'Procurement POs', 'Dispatch & Fleet', 'Transporter Tracking'],
      restrictedData: ['Financial Cashflow', 'HR Salaries', 'Sensitive Tender Pricing Strategy'],
    },
    {
      role: 'Accounts',
      title: 'Finance & Accounts (CFO/Accounts Team)',
      description: 'Govt invoicing, PFMS/treasury tracking, GST reconciliation, receivables aging, and payment recording.',
      allowedModules: ['Accounts & Invoices', 'Payment Receipts', 'Receivables Aging', 'Financial Reports'],
      restrictedData: ['HR Employee Grievances / Internal Appraisals'],
    },
    {
      role: 'CRM',
      title: 'Institutional CRM & State Liaison',
      description: 'State government departments, mission directors, customer follow-up notes, and delivery satisfaction.',
      allowedModules: ['Customers / CRM', 'Order Status (Read)', 'Delivery Proofs', 'Tender Pipeline View'],
      restrictedData: ['Supplier Cost Breakdowns', 'Internal HR Data'],
    },
    {
      role: 'Data Management',
      title: 'Data & Documentation Executive',
      description: 'Master document renewals (GST, PAN, MSME, ISO, CA Certificates), spreadsheet bulk data imports, and compliance archiving.',
      allowedModules: ['Central Documents', 'Data Import / Export', 'Tender Document Verification'],
      restrictedData: ['Executive Financial Analytics', 'Payroll'],
    },
    {
      role: 'HR',
      title: 'Human Resources & Administration',
      description: 'Staff directory, employee task distribution, attendance logs, department headcounts, and organizational records.',
      allowedModules: ['Employee / HR', 'Task Assignments', 'Department Organization'],
      restrictedData: ['Commercial Tender Bids', 'Bank Balances & Invoices'],
    },
  ];

  const handleSelectRole = (newRole: UserRole) => {
    const oldRole = activeRole;
    setActiveRole(newRole);
    addAuditLog('Switched User Role', 'System Security', 'RBAC', `Switched from ${oldRole} to ${newRole}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-500">
                Switch your active persona to verify role-specific permissions and views
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="max-h-[70vh] overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {roles.map((item) => {
            const isSelected = activeRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => handleSelectRole(item.role)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{item.role}</span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Click to switch</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-slate-600">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5 text-emerald-700">
                    <Eye className="h-3 w-3 shrink-0 mt-0.5" />
                    <span className="truncate">{item.allowedModules.slice(0, 3).join(', ')}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-400">
                    <Lock className="h-3 w-3 shrink-0 mt-0.5" />
                    <span className="truncate">{item.restrictedData.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <span>Active Role: <strong className="text-slate-800">{activeRole}</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 font-medium text-white hover:bg-slate-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
