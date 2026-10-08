import React from 'react';
import {
  X,
  ShoppingCart,
  Building2,
  Package,
  Truck,
  ReceiptIndianRupee,
  Clock,
  CheckCircle2,
  ArrowRight,
  Boxes,
  FileSpreadsheet,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
  onNavigateTender?: (tenderId: string) => void;
  onNavigateCustomer?: (customerId: string) => void;
  onNavigateLogistics?: (dispatchId?: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
  onNavigateTender,
  onNavigateCustomer,
  onNavigateLogistics,
}) => {
  const { orders, updateOrderStatus, dispatches, invoices, procurement } = useApp();

  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const linkedDispatch = dispatches.find((d) => d.orderId === order.id);
  const linkedInvoice = invoices.find((inv) => inv.orderId === order.id);
  const linkedProcurement = procurement.find((p) => p.orderId === order.id);

  const statuses: OrderStatus[] = [
    'New',
    'Confirmed',
    'Procurement Pending',
    'Ready for Dispatch',
    'Dispatched',
    'In Transit',
    'Delivered',
    'Completed',
    'Cancelled',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-700">{order.orderNumber}</span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                Tender Ref: {order.tenderNumber}
              </span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                {order.status}
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900">{order.customerName}</h3>
            <p className="text-xs text-slate-500">
              {order.department} · {order.state} · Required Delivery: {formatDate(order.requiredDeliveryDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                className="font-bold text-slate-900 outline-none cursor-pointer bg-transparent"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white px-6 py-3 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Order Value</span>
            <p className="font-extrabold text-slate-900 text-sm">{formatINR(order.totalValue)}</p>
            <span className="text-[10px] text-slate-500">Unit: ₹{order.unitPrice.toLocaleString('en-IN')}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Order Quantity</span>
            <p className="font-extrabold text-slate-900 text-sm">{order.quantity} Units</p>
            <span className="text-[10px] text-slate-500 truncate block">{order.product}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Procurement Status</span>
            <p className="font-semibold text-slate-800">{order.procurementStatus}</p>
            <span className="text-[10px] text-slate-500">Reserved: {order.inventoryReserved || 0} units</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Invoice & Payment</span>
            <p className="font-semibold text-slate-800">{order.invoiceStatus}</p>
            <span className="text-[10px] text-slate-500">{order.paymentStatus}</span>
          </div>
        </div>

        {/* Complete Cross-Module Connected Map */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section: Linked Tender & Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between text-blue-700">
                <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="h-4 w-4" /> Originating Tender
                </span>
                {onNavigateTender && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTender(order.tenderId);
                    }}
                    className="font-bold text-blue-600 hover:underline flex items-center text-[10px]"
                  >
                    View Bid <ArrowRight className="h-3 w-3 ml-0.5" />
                  </button>
                )}
              </div>
              <p className="font-mono font-bold text-slate-800">{order.tenderNumber}</p>
              <p className="text-slate-500 text-[11px]">
                Awarded bid that spawned this delivery order through the OS automation engine.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between text-purple-700">
                <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> Customer CRM Entity
                </span>
                {onNavigateCustomer && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateCustomer(order.customerId);
                    }}
                    className="font-bold text-purple-600 hover:underline flex items-center text-[10px]"
                  >
                    360 Profile <ArrowRight className="h-3 w-3 ml-0.5" />
                  </button>
                )}
              </div>
              <p className="font-bold text-slate-800">{order.customerName}</p>
              <p className="text-slate-500 text-[11px]">{order.department} · {order.state}</p>
            </div>
          </div>

          {/* Section: Supply Chain & Procurement Link */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-amber-700 flex items-center gap-1.5">
              <Boxes className="h-4 w-4" /> Supply Chain & OEM Procurement Flow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Inventory Reserved</span>
                <span className="font-bold text-slate-800">{order.inventoryReserved || 0} Units</span>
                <span className="text-[10px] text-slate-500 block">From Gurugram / Bhiwandi</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">OEM PO Number</span>
                <span className="font-bold text-slate-800">{linkedProcurement?.poNumber || 'PO-USHA-2026-091'}</span>
                <span className="text-[10px] text-slate-500 block">USHA International Ltd</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Factory Status</span>
                <span className="font-bold text-slate-800">{order.procurementStatus}</span>
                <span className="text-[10px] text-slate-500 block">Delivery to Central Hub</span>
              </div>
            </div>
          </div>

          {/* Section: Dispatch, Transporter & LR Tracking */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-700 flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> Logistics, Vehicle & Delivery Tracking
              </h4>
              {onNavigateLogistics && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateLogistics(linkedDispatch?.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <Navigation className="h-3 w-3" />
                  <span>Open in Logistics Hub</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {linkedDispatch ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Transporter</span>
                  <span className="font-bold text-slate-800">{linkedDispatch.transporter}</span>
                  <span className="text-[10px] text-slate-500 block">Tracking: {linkedDispatch.trackingNumber}</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle & LR</span>
                  <span className="font-bold text-slate-800">{linkedDispatch.vehicleNumber}</span>
                  <span className="text-[10px] text-slate-500 block">LR: {linkedDispatch.lrNumber}</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">E-Way Bill #</span>
                  <span className="font-bold text-slate-800">{linkedDispatch.eWayBillNumber}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">GST Compliant</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Status</span>
                  <span className="font-bold text-slate-800">{linkedDispatch.deliveryStatus}</span>
                  <span className="text-[10px] text-slate-500 block">ETA: {linkedDispatch.expectedDelivery}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-blue-50/70 border border-blue-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-blue-900 text-xs">
                  <p className="font-bold">No active courier docket created yet for this order.</p>
                  <p className="text-[11px] text-blue-700">Calculate multi-carrier rates by pin code, box volume, and weight using the Shiprocket Logistics engine.</p>
                </div>
                {onNavigateLogistics && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateLogistics();
                    }}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>Calculate Rates & Ship</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section: Accounts, Invoicing & Receivables */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-700 flex items-center gap-1.5">
              <ReceiptIndianRupee className="h-4 w-4" /> Treasury Invoicing & Collections
            </h4>
            {linkedInvoice ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Invoice Number</span>
                  <span className="font-mono font-bold text-slate-800">{linkedInvoice.invoiceNumber}</span>
                  <span className="text-[10px] text-slate-500 block">Date: {linkedInvoice.invoiceDate}</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Invoiced</span>
                  <span className="font-bold text-slate-800">{formatINR(linkedInvoice.invoiceValue)}</span>
                  <span className="text-[10px] text-slate-500 block">Due: {linkedInvoice.dueDate}</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Status</span>
                  <span className="font-bold text-slate-800">{linkedInvoice.paymentStatus}</span>
                  <span className="text-[10px] text-amber-700 block">
                    Outstanding: {formatINR(linkedInvoice.outstandingAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-[11px] p-2 bg-slate-50 rounded-lg">
                Invoice generation scheduled upon physical delivery certification to {order.customerName}.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
          <span>Assigned Officer: <strong className="text-slate-800">{order.assignedEmployeeName}</strong></span>
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
