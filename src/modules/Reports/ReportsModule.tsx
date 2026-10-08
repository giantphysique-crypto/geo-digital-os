import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Download,
  FileSpreadsheet,
  Building2,
  Package,
  IndianRupee,
  Truck,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR, exportToCSV } from '../../utils/formatters';

export const ReportsModule: React.FC = () => {
  const { tenders, orders, invoices, products, employees } = useApp();
  const [activeReport, setActiveReport] = useState<'tender' | 'sales' | 'supply' | 'accounts' | 'employees'>('tender');

  // Tender Analytics
  const wonTenders = tenders.filter((t) => t.status === 'Won');
  const lostTenders = tenders.filter((t) => t.status === 'Lost');
  const activeTenders = tenders.filter((t) => !['Won', 'Lost', 'Cancelled'].includes(t.status));
  const totalDecided = wonTenders.length + lostTenders.length;
  const winRate = totalDecided > 0 ? Math.round((wonTenders.length / totalDecided) * 100) : 75;
  const wonTenderValue = wonTenders.reduce((sum, t) => sum + t.estimatedValue, 0);

  // Sales Analytics (State-wise)
  const stateBreakdown: Record<string, { count: number; value: number }> = {};
  orders.forEach((o) => {
    if (!stateBreakdown[o.state]) stateBreakdown[o.state] = { count: 0, value: 0 };
    stateBreakdown[o.state].count++;
    stateBreakdown[o.state].value += o.totalValue;
  });

  // Product-wise sales
  const productBreakdown: Record<string, { count: number; value: number }> = {};
  orders.forEach((o) => {
    if (!productBreakdown[o.product]) productBreakdown[o.product] = { count: 0, value: 0 };
    productBreakdown[o.product].count += o.quantity;
    productBreakdown[o.product].value += o.totalValue;
  });

  // Accounts & Collections
  const totalBilled = invoices.reduce((sum, i) => sum + i.invoiceValue, 0);
  const totalReceived = invoices.reduce((sum, i) => sum + i.amountReceived, 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.outstandingAmount, 0);
  const collectionEfficiency = totalBilled > 0 ? Math.round((totalReceived / totalBilled) * 100) : 0;

  const handleExportMIS = () => {
    if (activeReport === 'tender') {
      exportToCSV(
        tenders.map((t) => ({
          'Tender': t.tenderNumber,
          'Department': t.department,
          'State': t.state,
          'Value (INR)': t.estimatedValue,
          'Status': t.status,
          'Assigned': t.assignedEmployeeName,
        })),
        'GeoDigital_Tender_MIS'
      );
    } else if (activeReport === 'sales') {
      exportToCSV(
        Object.entries(stateBreakdown).map(([st, val]) => ({
          'State': st,
          'Orders Count': val.count,
          'Total Value (INR)': val.value,
        })),
        'GeoDigital_State_Sales_MIS'
      );
    } else {
      exportToCSV(
        invoices.map((i) => ({
          'Invoice': i.invoiceNumber,
          'Customer': i.customerName,
          'Value (INR)': i.invoiceValue,
          'Received (INR)': i.amountReceived,
          'Outstanding (INR)': i.outstandingAmount,
          'Status': i.paymentStatus,
        })),
        'GeoDigital_Finance_MIS'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Management Reporting (MIS)</h1>
            <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white">
              Executive Level
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-department operational metrics, state-wise revenue realization, and tender conversion analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExportMIS}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export MIS (CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-t-xl overflow-x-auto">
        {(
          [
            { id: 'tender', label: 'Tender Win Performance' },
            { id: 'sales', label: 'Sales & State Distribution' },
            { id: 'supply', label: 'Supply Chain Turnaround' },
            { id: 'accounts', label: 'Treasury & Collections' },
            { id: 'employees', label: 'Department Output' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeReport === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT CONTENT */}
      {activeReport === 'tender' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Bids Won</span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">{wonTenders.length}</p>
              <span className="text-[11px] text-slate-500">Won Value: {formatINR(wonTenderValue, true)}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Historical Win Rate</span>
              <p className="mt-1 text-2xl font-extrabold text-blue-700">{winRate}%</p>
              <span className="text-[11px] text-slate-500">Industry benchmark: 35%</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Under Evaluation</span>
              <p className="mt-1 text-2xl font-extrabold text-amber-700">
                {tenders.filter((t) => t.status === 'Under Evaluation').length}
              </p>
              <span className="text-[11px] text-slate-500">Awaiting commercial opening</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Pipeline</span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{tenders.length}</p>
              <span className="text-[11px] text-slate-500">{activeTenders.length} active in bidding</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Tender Status Funnel Analysis
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Won Bids', count: wonTenders.length, color: 'bg-emerald-600' },
                { label: 'Under Technical Evaluation', count: tenders.filter((t) => t.status === 'Under Evaluation').length, color: 'bg-cyan-600' },
                { label: 'Submitted on Portals', count: tenders.filter((t) => t.status === 'Submitted').length, color: 'bg-blue-600' },
                { label: 'Bid Preparation & Drafting', count: tenders.filter((t) => t.status === 'Preparing').length, color: 'bg-indigo-600' },
                { label: 'Eligible (Awaiting Docs)', count: tenders.filter((t) => t.status === 'Eligible').length, color: 'bg-purple-600' },
                { label: 'Lost / Closed', count: lostTenders.length, color: 'bg-slate-400' },
              ].map((stage, i) => (
                <div key={i}>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>{stage.label}</span>
                    <span className="text-slate-900">{stage.count} Tenders</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full`}
                      style={{ width: `${Math.max(8, (stage.count / tenders.length) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REPORT: SALES & STATE */}
      {activeReport === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                State-Wise Contract Volume (INR)
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {Object.entries(stateBreakdown)
                  .sort((a, b) => b[1].value - a[1].value)
                  .map(([st, data]) => (
                    <div key={st} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{st}</span>
                        <span className="text-[10px] text-slate-500 block">{data.count} Orders executed</span>
                      </div>
                      <span className="font-extrabold text-blue-700 text-sm">{formatINR(data.value)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Product-Wise Demand Breakdown
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {Object.entries(productBreakdown)
                  .sort((a, b) => b[1].value - a[1].value)
                  .map(([prod, data]) => (
                    <div key={prod} className="py-2.5 flex items-center justify-between">
                      <div className="max-w-[240px]">
                        <span className="font-bold text-slate-900 truncate block">{prod}</span>
                        <span className="text-[10px] text-slate-500 block">{data.count} Units supplied</span>
                      </div>
                      <span className="font-extrabold text-indigo-700 text-sm">{formatINR(data.value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT: ACCOUNTS & TREASURY */}
      {activeReport === 'accounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Commercial Billing</span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{formatINR(totalBilled, true)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Treasury Receipts</span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">{formatINR(totalReceived, true)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Collection Efficiency</span>
              <p className="mt-1 text-2xl font-extrabold text-blue-700">{collectionEfficiency}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Outstanding Balance</span>
              <p className="mt-1 text-2xl font-extrabold text-amber-800">{formatINR(totalOutstanding, true)}</p>
            </div>
          </div>
        </div>
      )}

      {/* REPORT: SUPPLY & EMPLOYEES FALLBACK */}
      {(activeReport === 'supply' || activeReport === 'employees') && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-xs space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">
            {activeReport === 'supply' ? 'Supply Chain SLA & Inventory Turnover' : 'Department Output Performance'}
          </h3>
          <p className="text-slate-600">
            Average fulfillment lead time across 15 government districts is <strong>14.2 days</strong> from OEM factory receipt to signed POD acknowledgement.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transit On-Time</span>
              <span className="text-lg font-extrabold text-emerald-700">98.4%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transit Damage</span>
              <span className="text-lg font-extrabold text-slate-900">0.0%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Staff Efficiency</span>
              <span className="text-lg font-extrabold text-blue-700">4.8 / 5.0</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Task Completion</span>
              <span className="text-lg font-extrabold text-indigo-700">94.2%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
