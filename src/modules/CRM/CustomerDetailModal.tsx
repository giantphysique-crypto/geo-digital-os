import React, { useState } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  ShoppingCart,
  Truck,
  IndianRupee,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';

interface CustomerDetailModalProps {
  customerId: string;
  onClose: () => void;
  onNavigateTender?: (tenderId: string) => void;
  onNavigateOrder?: (orderId: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customerId,
  onClose,
  onNavigateTender,
  onNavigateOrder,
}) => {
  const { customers, tenders, orders, dispatches, invoices, payments, tasks } = useApp();
  const [activeTab, setActiveTab] = useState<'timeline' | 'tenders' | 'orders' | 'invoices' | 'notes'>('timeline');
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    '2026-10-02: State Nodal Officer Suresh Patel met Mission Director regarding block delivery schedule.',
    '2026-09-25: Acknowledged receipt of 1,000 Tailor Deluxe units with zero damages.',
  ]);

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;

  // Interconnected relationships
  const customerTenders = tenders.filter(
    (t) => t.customerId === customer.id || t.organization.toLowerCase().includes(customer.organizationName.toLowerCase())
  );
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerInvoices = invoices.filter((inv) => inv.customerId === customer.id);
  const customerPayments = payments.filter((p) => p.customerId === customer.id);
  const customerDispatches = dispatches.filter((d) => d.customerId === customer.id);

  const totalWonValue = customerTenders
    .filter((t) => t.status === 'Won')
    .reduce((acc, t) => acc + t.estimatedValue, 0);

  const totalOutstanding = customerInvoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    setNotesList([`${dateStr}: ${newNote}`, ...notesList]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-lg shadow-xs">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-700">{customer.id}</span>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {customer.customerType}
                </span>
                <span className="text-xs text-slate-400 font-mono">GST: {customer.gstNumber}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{customer.organizationName}</h3>
              <p className="text-xs text-slate-500">
                {customer.department} · {customer.district}, {customer.state}
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

        {/* Contact Info Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white px-6 py-3 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Nodal Officer</span>
            <p className="font-semibold text-slate-800">{customer.contactPerson}</p>
            <span className="text-[10px] text-slate-500">{customer.designation}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Phone & Email</span>
            <p className="font-semibold text-slate-800">{customer.phone}</p>
            <p className="text-[10px] text-blue-600 truncate">{customer.email}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Tenders Won Value</span>
            <p className="font-extrabold text-slate-900">{formatINR(totalWonValue || customer.totalTenderValue)}</p>
            <span className="text-[10px] text-slate-500">{customerTenders.length} total bids</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Outstanding Invoices</span>
            <p className={`font-extrabold ${totalOutstanding > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {formatINR(totalOutstanding)}
            </p>
            <span className="text-[10px] text-slate-500">{customerOrders.length} active orders</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          {(['timeline', 'tenders', 'orders', 'invoices', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-xs font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'timeline'
                ? 'Full Lifecycle Timeline'
                : tab === 'tenders'
                ? `Tenders (${customerTenders.length})`
                : tab === 'orders'
                ? `Orders (${customerOrders.length})`
                : tab === 'invoices'
                ? `Invoices & Payments (${customerInvoices.length})`
                : `Liaison Notes (${notesList.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {/* 360-Degree Lifecycle Timeline: Tender → Order → Delivery → Invoice → Payment → Follow-up */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5">
                <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider">
                  Chronological Business Lifecycle
                </h4>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  End-to-end journey from initial GeM/tender bidding down to final PFMS treasury receipt and customer relationship follow-up.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Step 1: Tender Discovery & Bidding */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    1
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700">Tender Bidding & Award</span>
                      <span className="text-[10px] text-slate-400">Tenders: {customerTenders.length}</span>
                    </div>
                    {customerTenders.map((t) => (
                      <div key={t.id} className="pt-1 flex items-center justify-between text-slate-700">
                        <span>{t.tenderNumber} - {t.product} ({t.quantity} units)</span>
                        <span className="font-bold">{formatINR(t.estimatedValue, true)} ({t.status})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Order Generation */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    2
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700">Project Order Execution</span>
                      <span className="text-[10px] text-slate-400">{customerOrders.length} orders</span>
                    </div>
                    {customerOrders.map((o) => (
                      <div key={o.id} className="pt-1 flex items-center justify-between text-slate-700">
                        <span>{o.orderNumber}: {o.quantity} units of {o.product}</span>
                        <span className="font-semibold text-indigo-800">{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Dispatch & Delivery */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white text-[10px] font-bold">
                    3
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700">Warehouse Dispatch & Logistics</span>
                      <span className="text-[10px] text-slate-400">{customerDispatches.length} consignments</span>
                    </div>
                    {customerDispatches.map((d) => (
                      <div key={d.id} className="pt-1 flex items-center justify-between text-slate-700">
                        <span>{d.dispatchNumber} via {d.transporter} ({d.vehicleNumber})</span>
                        <span className="font-semibold text-emerald-700">{d.deliveryStatus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 4: Invoicing & Payment */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    4
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700">Govt Invoicing & Payment Realization</span>
                      <span className="text-[10px] text-slate-400">{customerInvoices.length} invoices</span>
                    </div>
                    {customerInvoices.map((inv) => (
                      <div key={inv.id} className="pt-1 flex items-center justify-between text-slate-700">
                        <span>{inv.invoiceNumber} - Total {formatINR(inv.invoiceValue)}</span>
                        <span className="font-bold text-slate-800">
                          Rec'd: {formatINR(inv.amountReceived)} ({inv.paymentStatus})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tenders List */}
          {activeTab === 'tenders' && (
            <div className="space-y-3">
              {customerTenders.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onNavigateTender && onNavigateTender(t.id)}
                  className="rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">{t.tenderNumber}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px]">{t.status}</span>
                    </div>
                    <p className="font-semibold text-slate-900 mt-1">{t.title}</p>
                    <p className="text-[11px] text-slate-500">{t.product} · Qty: {t.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{formatINR(t.estimatedValue)}</span>
                    <span className="block text-[10px] text-slate-400">Deadline: {formatDate(t.submissionDeadline)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Orders List */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {customerOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => onNavigateOrder && onNavigateOrder(o.id)}
                  className="rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700">{o.orderNumber}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px]">{o.status}</span>
                    </div>
                    <p className="font-semibold text-slate-900 mt-1">{o.product}</p>
                    <p className="text-[11px] text-slate-500">Required: {o.requiredDeliveryDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{formatINR(o.totalValue)}</span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">{o.dispatchStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Invoices & Payments */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Invoices ({customerInvoices.length})</h4>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {customerInvoices.map((inv) => (
                  <div key={inv.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <span className="font-mono font-bold text-amber-700">{inv.invoiceNumber}</span>
                      <p className="text-[11px] text-slate-500">Date: {inv.invoiceDate} · Due: {inv.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatINR(inv.invoiceValue)}</span>
                      <p className="text-[11px] text-amber-700">Outstanding: {formatINR(inv.outstandingAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-slate-800 pt-2">Receipts Received ({customerPayments.length})</h4>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {customerPayments.map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <span className="font-mono font-bold text-emerald-700">{p.receiptNumber}</span>
                      <p className="text-[11px] text-slate-500">{p.paymentMode} · Ref: {p.referenceNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">+{formatINR(p.amount)}</span>
                      <p className="text-[10px] text-slate-400">{p.paymentDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Follow-up */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record customer communication or official follow-up notes..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 p-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
                >
                  Add Note
                </button>
              </form>

              <div className="space-y-2">
                {notesList.map((note, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
          <span>Customer Records Verified</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
