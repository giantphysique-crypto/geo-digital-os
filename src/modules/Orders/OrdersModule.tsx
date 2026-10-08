import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Download,
  ArrowRight,
  PackageCheck,
  Truck,
  IndianRupee,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatINR, formatDate, exportToCSV } from '../../utils/formatters';
import { OrderDetailModal } from './OrderDetailModal';

interface OrdersModuleProps {
  onNavigateTender?: (tenderId: string) => void;
  onNavigateCustomer?: (customerId: string) => void;
  onNavigateLogistics?: (dispatchId?: string) => void;
  selectedOrderId?: string;
}

export const OrdersModule: React.FC<OrdersModuleProps> = ({
  onNavigateTender,
  onNavigateCustomer,
  onNavigateLogistics,
  selectedOrderId,
}) => {
  const { orders, updateOrderStatus, createOrder, customers, products } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(selectedOrderId || null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New Order Form state
  const [newOrderCust, setNewOrderCust] = useState(customers[0]?.id || '');
  const [newOrderProduct, setNewOrderProduct] = useState(products[0]?.name || 'USHA Tailor Deluxe');
  const [newOrderQty, setNewOrderQty] = useState(100);
  const [newOrderPrice, setNewOrderPrice] = useState(7450);
  const [newOrderDeliveryDate, setNewOrderDeliveryDate] = useState(
    new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );

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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newOrderCust) || customers[0];

    createOrder({
      customerId: cust.id,
      customerName: cust.organizationName,
      department: cust.department,
      state: cust.state,
      product: newOrderProduct,
      quantity: Number(newOrderQty),
      unitPrice: Number(newOrderPrice),
      totalValue: Number(newOrderQty) * Number(newOrderPrice),
      requiredDeliveryDate: newOrderDeliveryDate,
      status: 'New',
    });

    setIsNewOrderModalOpen(false);
  };

  const handleExport = () => {
    const exportData = filteredOrders.map((o) => ({
      'Order Number': o.orderNumber,
      'Tender Number': o.tenderNumber,
      'Customer': o.customerName,
      'State': o.state,
      'Product': o.product,
      'Quantity': o.quantity,
      'Total Value (INR)': o.totalValue,
      'Order Date': o.orderDate,
      'Delivery Due Date': o.requiredDeliveryDate,
      'Order Status': o.status,
      'Procurement Status': o.procurementStatus,
      'Dispatch Status': o.dispatchStatus,
      'Invoice Status': o.invoiceStatus,
    }));
    exportToCSV(exportData, 'GeoDigital_Orders_Master');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Management & Fulfillment</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
              {filteredOrders.length} Project Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-spawned from Won Tenders or direct contracts; links procurement, warehouse and dispatches
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
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>+ Manual Project Order</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search order ID, tender number, department, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                <th className="py-3 px-4">Order Number & Tender</th>
                <th className="py-3 px-4">Customer & State</th>
                <th className="py-3 px-4">Product & Quantity</th>
                <th className="py-3 px-4">Contract Value</th>
                <th className="py-3 px-4">Delivery Due Date</th>
                <th className="py-3 px-4">Procurement & Dispatch</th>
                <th className="py-3 px-4">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders match the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setActiveOrderId(order.id)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-indigo-700">{order.orderNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                        Ref: {order.tenderNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 max-w-[200px] truncate" title={order.customerName}>
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{order.state}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 max-w-[180px] truncate" title={order.product}>
                        {order.product}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {order.quantity.toLocaleString('en-IN')} Units
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{formatINR(order.totalValue)}</div>
                      <div className="text-[10px] text-slate-400">₹{order.unitPrice.toLocaleString('en-IN')}/unit</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{formatDate(order.requiredDeliveryDate)}</div>
                      <div className="text-[10px] text-slate-400">Booked: {order.orderDate}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[11px]">
                        <span className="font-semibold text-slate-700">Proc: </span>
                        <span className="text-amber-800 font-medium">{order.procurementStatus}</span>
                      </div>
                      <div className="text-[11px] mt-0.5">
                        <span className="font-semibold text-slate-700">Disp: </span>
                        <span className="text-purple-800 font-medium">{order.dispatchStatus}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setActiveOrderId(order.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs ml-1"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderId && (
        <OrderDetailModal
          orderId={activeOrderId}
          onClose={() => setActiveOrderId(null)}
          onNavigateTender={onNavigateTender}
          onNavigateCustomer={onNavigateCustomer}
          onNavigateLogistics={onNavigateLogistics}
        />
      )}

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Create Direct Project Order</h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Organization *</label>
                <select
                  value={newOrderCust}
                  onChange={(e) => setNewOrderCust(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.organizationName} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Scope *</label>
                <input
                  type="text"
                  value={newOrderProduct}
                  onChange={(e) => setNewOrderProduct(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    value={newOrderQty}
                    onChange={(e) => setNewOrderQty(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={newOrderPrice}
                    onChange={(e) => setNewOrderPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Delivery Date</label>
                <input
                  type="date"
                  value={newOrderDeliveryDate}
                  onChange={(e) => setNewOrderDeliveryDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
