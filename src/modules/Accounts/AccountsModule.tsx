import React, { useState } from 'react';
import {
  IndianRupee,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Clock,
  ArrowRight,
  Receipt,
  FileText,
  Building2,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, PaymentRecord } from '../../types';
import { formatINR, formatDate, exportToCSV } from '../../utils/formatters';
import { RecordPaymentModal } from './RecordPaymentModal';

interface AccountsModuleProps {
  onNavigateOrder?: (orderId: string) => void;
  selectedInvoiceId?: string;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({
  onNavigateOrder,
  selectedInvoiceId,
}) => {
  const { invoices, payments, customers, addAuditLog } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'aging'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [targetInvoiceId, setTargetInvoiceId] = useState<string | undefined>(selectedInvoiceId);

  // Reminders simulation state
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Accounts metrics
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.invoiceValue, 0);
  const totalReceived = invoices.reduce((acc, inv) => acc + inv.amountReceived, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);

  const overdueInvoices = invoices.filter((inv) => inv.paymentStatus === 'Overdue');
  const overdueTotal = overdueInvoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);

  const dueThisWeekInvoices = invoices.filter((inv) => {
    if (inv.paymentStatus === 'Paid') return false;
    const diff = Math.ceil((new Date(inv.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    return diff >= 0 && diff <= 7;
  });
  const dueThisWeekTotal = dueThisWeekInvoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (inv: Invoice) => {
    addAuditLog('Sent Payment Reminder', 'Accounts', inv.id, inv.invoiceNumber, `Reminders: ${inv.remindersCount}`, `Reminders: ${inv.remindersCount + 1}`);
    setReminderToast(`Formal payment reminder issued to ${inv.customerName} for ${inv.invoiceNumber} (${formatINR(inv.outstandingAmount)})!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handleExport = () => {
    const exportData = invoices.map((inv) => ({
      'Invoice Number': inv.invoiceNumber,
      'Order Number': inv.orderNumber,
      'Customer': inv.customerName,
      'Invoice Date': inv.invoiceDate,
      'Due Date': inv.dueDate,
      'Invoice Value (INR)': inv.invoiceValue,
      'Amount Received (INR)': inv.amountReceived,
      'Outstanding (INR)': inv.outstandingAmount,
      'GST Component': inv.gstAmount,
      'Payment Status': inv.paymentStatus,
    }));
    exportToCSV(exportData, 'GeoDigital_Invoices_Ledger');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Accounts & Receivables</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Government Billing & Treasury
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Commercial invoices, GST filings, PFMS government payment realization & receivables aging
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Export</span> CSV
          </button>

          <button
            onClick={() => {
              setTargetInvoiceId(undefined);
              setIsPaymentModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <span className="font-bold text-sm">₹</span>
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Toast alert when reminder sent */}
      {reminderToast && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <Bell className="h-4 w-4 text-blue-600" />
            <span>{reminderToast}</span>
          </div>
          <button onClick={() => setReminderToast(null)} className="text-blue-500 hover:text-blue-800">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Billed Volume</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{formatINR(totalBilled, true)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">{invoices.length} commercial bills</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Collected (Bank)</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-700">{formatINR(totalReceived, true)}</div>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
            {Math.round((totalReceived / (totalBilled || 1)) * 100)}% realization rate
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Outstanding</span>
          <div className="mt-1 text-2xl font-extrabold text-amber-800">{formatINR(totalOutstanding, true)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across active accounts</span>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-rose-700">Overdue (&gt; 30 Days)</span>
          <div className="mt-1 text-2xl font-extrabold text-rose-800">{formatINR(overdueTotal, true)}</div>
          <span className="text-[11px] text-rose-700 font-medium mt-1 block">
            {overdueInvoices.length} invoices require liaison
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-t-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'invoices'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Commercial Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'payments'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Receipts Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('aging')}
          className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'aging'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Outstanding Aging
        </button>
      </div>

      {/* Filter and Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search invoice number, client department, order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {activeTab === 'invoices' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
              >
                <option value="All">All Invoices</option>
                <option value="Invoiced">Invoiced (Pending)</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid in Full</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'invoices' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="py-3 px-4">Invoice # & Order</th>
                  <th className="py-3 px-4">Customer & Department</th>
                  <th className="py-3 px-4">Invoice Date & Due</th>
                  <th className="py-3 px-4">Total Billed</th>
                  <th className="py-3 px-4">Amount Received</th>
                  <th className="py-3 px-4">Outstanding</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-800">{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Order: {inv.orderNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 max-w-[200px] truncate" title={inv.customerName}>
                        {inv.customerName}
                      </div>
                      <div className="text-[10px] text-slate-500">{inv.department}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>{formatDate(inv.invoiceDate)}</div>
                      <div className="text-[10px] text-slate-400">Due: {formatDate(inv.dueDate)}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">{formatINR(inv.invoiceValue)}</td>

                    <td className="py-3 px-4 font-bold text-emerald-700">{formatINR(inv.amountReceived)}</td>

                    <td className="py-3 px-4">
                      <div
                        className={`font-extrabold ${
                          inv.outstandingAmount > 0 ? 'text-amber-800' : 'text-slate-400'
                        }`}
                      >
                        {formatINR(inv.outstandingAmount)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            inv.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.paymentStatus === 'Overdue'
                              ? 'bg-rose-100 text-rose-800'
                              : inv.paymentStatus === 'Partially Paid'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>

                        {inv.outstandingAmount > 0 && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setTargetInvoiceId(inv.id);
                                setIsPaymentModalOpen(true);
                              }}
                              className="rounded bg-emerald-600 px-2 py-1 font-bold text-white hover:bg-emerald-700 text-[11px]"
                            >
                              Receive
                            </button>
                            <button
                              onClick={() => handleSendReminder(inv)}
                              className="rounded border border-slate-300 p-1 text-slate-600 hover:bg-slate-100"
                              title="Send Formal Payment Reminder"
                            >
                              <Bell className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RECEIPTS */}
      {activeTab === 'payments' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Invoice Ref</th>
                  <th className="py-3 px-4">Amount Realized</th>
                  <th className="py-3 px-4">Payment Mode & Ref</th>
                  <th className="py-3 px-4">Bank & Officer</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{p.receiptNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.customerName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700 text-sm">+{formatINR(p.amount)}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.paymentMode}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.referenceNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{p.bankName}</div>
                      <div className="text-[10px] text-slate-400">By: {p.receivedBy}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatDate(p.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AGING BREAKDOWN */}
      {activeTab === 'aging' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">Current (0 - 30 Days)</span>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{formatINR(totalOutstanding - overdueTotal)}</p>
              <p className="text-[11px] text-slate-500 mt-1">Normal government processing cycle</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <span className="text-[10px] font-bold uppercase text-amber-700">Due This Week</span>
              <p className="mt-1 text-xl font-extrabold text-amber-900">{formatINR(dueThisWeekTotal)}</p>
              <p className="text-[11px] text-amber-800 mt-1">{dueThisWeekInvoices.length} invoices</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
              <span className="text-[10px] font-bold uppercase text-rose-700">Overdue (&gt; 30 Days)</span>
              <p className="mt-1 text-xl font-extrabold text-rose-900">{formatINR(overdueTotal)}</p>
              <p className="text-[11px] text-rose-800 mt-1">Action required by State Nodal Officers</p>
            </div>
          </div>

          {/* Customer list breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Customer-Wise Outstanding Balances
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {customers
                .map((c) => {
                  const custInvs = invoices.filter((i) => i.customerId === c.id);
                  const bal = custInvs.reduce((sum, i) => sum + i.outstandingAmount, 0);
                  return { customer: c, balance: bal, invoicesCount: custInvs.length };
                })
                .filter((item) => item.balance > 0)
                .map((item) => (
                  <div key={item.customer.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{item.customer.organizationName}</p>
                      <p className="text-[11px] text-slate-500">{item.customer.state} · {item.invoicesCount} open invoices</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-amber-800 text-sm">{formatINR(item.balance)}</span>
                      <button
                        onClick={() => {
                          const firstInv = invoices.find((i) => i.customerId === item.customer.id && i.outstandingAmount > 0);
                          setTargetInvoiceId(firstInv?.id);
                          setIsPaymentModalOpen(true);
                        }}
                        className="block text-[11px] text-emerald-700 font-semibold hover:underline mt-0.5"
                      >
                        Record Payment Receipt &rarr;
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          defaultInvoiceId={targetInvoiceId}
        />
      )}
    </div>
  );
};
