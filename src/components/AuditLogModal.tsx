import React, { useState } from 'react';
import { X, Search, Filter, History, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/formatters';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  if (!isOpen) return null;

  const modules = ['All', 'Tenders', 'Orders', 'Procurement', 'Dispatch', 'Accounts', 'Inventory', 'Tasks', 'CRM', 'System Security'];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  const handleExport = () => {
    exportToCSV(filteredLogs as any, 'GeoDigital_Audit_Logs');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">System Audit Trail & Compliance Log</h3>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all tender updates, status transitions, and payments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Controls Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, tender or order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 outline-none"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User & Role</th>
                <th className="py-2.5 px-4">Module</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Record Subject</th>
                <th className="py-2.5 px-4">Previous Value</th>
                <th className="py-2.5 px-4">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{log.user}</div>
                      <div className="text-[10px] text-slate-400">{log.role}</div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800 truncate max-w-[200px]" title={log.recordTitle}>
                        {log.recordTitle}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{log.recordId}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 max-w-[140px] truncate" title={log.previousValue || '-'}>
                      {log.previousValue || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-blue-700 max-w-[140px] truncate" title={log.newValue || '-'}>
                      {log.newValue || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-2.5 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredLogs.length} audit logs</span>
          <span className="text-[11px] text-slate-400">SOC-2 & ISO 9001 Compliant Audit Log Engine</span>
        </div>
      </div>
    </div>
  );
};
