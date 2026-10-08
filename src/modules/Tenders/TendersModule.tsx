import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Download,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tender, TenderStatus, Priority } from '../../types';
import { formatINR, formatDate, getDaysRemaining, exportToCSV } from '../../utils/formatters';
import { TenderDetailModal } from './TenderDetailModal';
import { NewTenderModal } from './NewTenderModal';

interface TendersModuleProps {
  onNavigateOrder?: (orderId: string) => void;
  selectedTenderId?: string;
}

export const TendersModule: React.FC<TendersModuleProps> = ({
  onNavigateOrder,
  selectedTenderId,
}) => {
  const { tenders, updateTenderStatus } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [activeTenderId, setActiveTenderId] = useState<string | null>(selectedTenderId || null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filtered tenders
  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      t.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesState = stateFilter === 'All' || t.state === stateFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesState && matchesPriority;
  });

  const states = Array.from(new Set(tenders.map((t) => t.state))).sort();

  const kanbanColumns: { status: TenderStatus; label: string; color: string }[] = [
    { status: 'New', label: 'New / Discovered', color: 'border-slate-300 bg-slate-50' },
    { status: 'Under Review', label: 'Under Review', color: 'border-amber-300 bg-amber-50/40' },
    { status: 'Eligible', label: 'Eligible', color: 'border-blue-300 bg-blue-50/40' },
    { status: 'Preparing', label: 'Bid Preparation', color: 'border-indigo-300 bg-indigo-50/40' },
    { status: 'Ready for Submission', label: 'Ready for Submission', color: 'border-purple-300 bg-purple-50/40' },
    { status: 'Submitted', label: 'Submitted', color: 'border-cyan-300 bg-cyan-50/40' },
    { status: 'Under Evaluation', label: 'Under Evaluation', color: 'border-orange-300 bg-orange-50/40' },
    { status: 'Won', label: 'Won (Auto-Orders)', color: 'border-emerald-300 bg-emerald-50/40' },
    { status: 'Lost', label: 'Lost / Closed', color: 'border-rose-300 bg-rose-50/40' },
  ];

  const handleExport = () => {
    const exportData = filteredTenders.map((t) => ({
      'Tender Number': t.tenderNumber,
      'Title': t.title,
      'Organization': t.organization,
      'State': t.state,
      'Portal': t.tenderPortal,
      'Product': t.product,
      'Quantity': t.quantity,
      'Estimated Value (INR)': t.estimatedValue,
      'EMD Amount (INR)': t.emdAmount,
      'Submission Deadline': t.submissionDeadline,
      'Status': t.status,
      'Assigned Specialist': t.assignedEmployeeName,
    }));
    exportToCSV(exportData, 'GeoDigital_Tenders_Pipeline');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tender Management</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              {filteredTenders.length} Bids Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            GeM, CPP Portal & State e-Procurement pipeline for USHA sewing machines & toolkits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Export</span> CSV
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>+ Create Tender</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search tender number, title, customer, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Eligible">Eligible</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Submission">Ready for Submission</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">State:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Table or Kanban */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="py-3 px-4">Tender Number & Portal</th>
                  <th className="py-3 px-4">Organization & Department</th>
                  <th className="py-3 px-4">Product & Quantity</th>
                  <th className="py-3 px-4">Est. Value & EMD</th>
                  <th className="py-3 px-4">Deadline & Countdown</th>
                  <th className="py-3 px-4">Assigned Bidder</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No tenders match the specified filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTenders.map((tender) => {
                    const days = getDaysRemaining(tender.submissionDeadline);
                    return (
                      <tr
                        key={tender.id}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        onClick={() => setActiveTenderId(tender.id)}
                      >
                        {/* Number & Portal */}
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-blue-700 flex items-center gap-1.5">
                            {tender.tenderNumber}
                            {tender.priority === 'Critical' && (
                              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" title="Critical Priority" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{tender.tenderSource}</span>
                            <span>·</span>
                            <span>{tender.tenderPortal}</span>
                          </div>
                        </td>

                        {/* Org & Dept */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 max-w-[220px] truncate" title={tender.organization}>
                            {tender.organization}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{tender.state}</span>
                            <span>·</span>
                            <span className="truncate max-w-[120px]">{tender.department}</span>
                          </div>
                        </td>

                        {/* Product & Qty */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 max-w-[200px] truncate" title={tender.product}>
                            {tender.product}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                            {tender.quantity.toLocaleString('en-IN')} Units
                          </div>
                        </td>

                        {/* Value & EMD */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{formatINR(tender.estimatedValue)}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            EMD: {formatINR(tender.emdAmount)}
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                              days.isOverdue
                                ? 'bg-slate-200 text-slate-700'
                                : days.days <= 3
                                ? 'bg-rose-100 text-rose-800'
                                : days.days <= 7
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {days.label}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {formatDate(tender.submissionDeadline)}
                          </div>
                        </td>

                        {/* Assigned */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{tender.assignedEmployeeName}</div>
                          <div className="text-[10px] text-slate-400">Tender Specialist</div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                                tender.status === 'Won'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : tender.status === 'Lost'
                                  ? 'bg-rose-100 text-rose-800'
                                  : tender.status === 'Submitted'
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {tender.status}
                            </span>
                            <button
                              onClick={() => setActiveTenderId(tender.id)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline Board */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colTenders = filteredTenders.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="w-72 shrink-0 rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-xs text-slate-800">{col.label}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                    {colTenders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colTenders.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400">
                      No bids in this stage
                    </div>
                  ) : (
                    colTenders.map((tender) => {
                      const days = getDaysRemaining(tender.submissionDeadline);
                      return (
                        <div
                          key={tender.id}
                          onClick={() => setActiveTenderId(tender.id)}
                          className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-blue-400 hover:shadow-sm transition cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-blue-700">
                              {tender.tenderNumber}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                                days.days <= 3 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {days.label}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                            {tender.organization}
                          </h4>

                          <p className="text-[11px] text-slate-500 truncate">
                            {tender.product} (Qty: {tender.quantity})
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                            <span className="font-extrabold text-slate-900">
                              {formatINR(tender.estimatedValue, true)}
                            </span>
                            <span className="text-[10px] text-slate-500">{tender.state}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tender Details Drawer Modal */}
      {activeTenderId && (
        <TenderDetailModal
          tenderId={activeTenderId}
          onClose={() => setActiveTenderId(null)}
          onNavigateOrder={onNavigateOrder}
        />
      )}

      {/* New Tender Modal */}
      {isNewModalOpen && (
        <NewTenderModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      )}
    </div>
  );
};
