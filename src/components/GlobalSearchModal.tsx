import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FileSpreadsheet,
  Users,
  ShoppingCart,
  ReceiptIndianRupee,
  Package,
  Contact,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string, recordId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { tenders, customers, orders, invoices, products, employees, dispatches } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingTenders = q
    ? tenders.filter(
        (t) =>
          t.tenderNumber.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.organization.toLowerCase().includes(q) ||
          t.product.toLowerCase().includes(q) ||
          t.state.toLowerCase().includes(q)
      )
    : tenders.slice(0, 3);

  const matchingCustomers = q
    ? customers.filter(
        (c) =>
          c.organizationName.toLowerCase().includes(q) ||
          c.contactPerson.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
      )
    : customers.slice(0, 2);

  const matchingOrders = q
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q)
      )
    : orders.slice(0, 2);

  const matchingInvoices = q
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.orderNumber.toLowerCase().includes(q)
      )
    : invoices.slice(0, 2);

  const matchingProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q)
      )
    : products.slice(0, 2);

  const matchingEmployees = q
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      )
    : employees.slice(0, 2);

  const matchingDispatches = q
    ? dispatches.filter(
        (d) =>
          d.trackingNumber.toLowerCase().includes(q) ||
          d.transporter.toLowerCase().includes(q) ||
          d.orderNumber.toLowerCase().includes(q) ||
          d.customerName.toLowerCase().includes(q) ||
          (d.destinationPinCode && d.destinationPinCode.includes(q)) ||
          d.destinationDistrict.toLowerCase().includes(q)
      )
    : dispatches.slice(0, 2);

  const totalResults =
    matchingTenders.length +
    matchingCustomers.length +
    matchingOrders.length +
    matchingInvoices.length +
    matchingDispatches.length +
    matchingProducts.length +
    matchingEmployees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tender number, department, order ID, invoice, product SKU, staff..."
            className="w-full bg-transparent px-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-700">No matching records found</p>
              <p className="text-xs text-slate-400">
                Try searching for "USHA", "UPSRLM", "ORD-GD", or an invoice number.
              </p>
            </div>
          ) : (
            <>
              {/* Tenders Section */}
              {matchingTenders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Tenders ({matchingTenders.length})</span>
                    <FileSpreadsheet className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingTenders.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onClose();
                          onNavigate('tenders', t.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-blue-50/70 cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-blue-700">{t.tenderNumber}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                              {t.status}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-800 font-medium">{t.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{t.organization} · {t.state}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-900">{formatINR(t.estimatedValue, true)}</span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {matchingOrders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Orders ({matchingOrders.length})</span>
                    <ShoppingCart className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          onClose();
                          onNavigate('orders', o.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-emerald-50/70 cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-emerald-700">{o.orderNumber}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                              {o.status}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-800 font-medium">{o.customerName}</p>
                          <p className="text-[11px] text-slate-500">{o.product} (Qty: {o.quantity})</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-900">{formatINR(o.totalValue, true)}</span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Section */}
              {matchingCustomers.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Customers / Departments ({matchingCustomers.length})</span>
                    <Users className="h-3.5 w-3.5 text-purple-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          onNavigate('crm', c.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-purple-50/70 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900">{c.organizationName}</p>
                          <p className="text-[11px] text-slate-500">
                            {c.contactPerson} ({c.designation}) · {c.state}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Section */}
              {matchingInvoices.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Invoices ({matchingInvoices.length})</span>
                    <ReceiptIndianRupee className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          onClose();
                          onNavigate('accounts', inv.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-amber-50/70 cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-amber-700">{inv.invoiceNumber}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                              {inv.paymentStatus}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-800">{inv.customerName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-900">{formatINR(inv.invoiceValue, true)}</span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-600 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logistics & Dispatches Section */}
              {matchingDispatches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Logistics & Courier Consignments ({matchingDispatches.length})</span>
                    <Navigation className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingDispatches.map((disp) => (
                      <div
                        key={disp.id}
                        onClick={() => {
                          onClose();
                          onNavigate('logistics', disp.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-blue-50/70 cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-blue-700 font-mono">
                              AWB: {disp.trackingNumber}
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 font-bold">
                              {disp.transporter}
                            </span>
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                                disp.deliveryStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {disp.deliveryStatus}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-800 font-medium">
                            To: {disp.customerName} ({disp.destinationDistrict}, {disp.destinationState})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {disp.product} · E-Way: {disp.eWayBillNumber}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-semibold text-slate-700 block">
                            ETA: {disp.expectedDelivery}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {matchingProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Inventory Products ({matchingProducts.length})</span>
                    <Package className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onNavigate('supply-chain', p.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-indigo-50/70 cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold text-xs text-indigo-700">{p.sku}</span>
                          <p className="truncate text-xs text-slate-800">{p.name}</p>
                          <p className="text-[11px] text-slate-500">Stock: {p.quantityAvailable} units</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-slate-700">₹{p.unitPrice.toLocaleString('en-IN')}/unit</span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Employees Section */}
              {matchingEmployees.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>Employees ({matchingEmployees.length})</span>
                    <Contact className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    {matchingEmployees.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onClose();
                          onNavigate('employees', e.id);
                        }}
                        className="group flex items-center justify-between rounded-lg p-2.5 transition hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={e.avatar}
                            alt={e.name}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{e.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {e.role} · {e.department}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="rounded border bg-white px-1">ESC</kbd> to close</span>
            <span>·</span>
            <span>Jump to any module or detail record</span>
          </div>
          <span className="font-medium text-slate-600">Geo Digital OS Universal Search</span>
        </div>
      </div>
    </div>
  );
};
