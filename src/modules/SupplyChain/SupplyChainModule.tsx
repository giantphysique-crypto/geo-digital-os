import React, { useState } from 'react';
import {
  Truck,
  Boxes,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Calendar,
  ExternalLink,
  Upload,
  ReceiptIndianRupee,
  ShieldCheck,
  Check,
  X,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductInventory, ProcurementItem, DispatchRecord } from '../../types';
import { formatINR, formatDate, exportToCSV } from '../../utils/formatters';

interface SupplyChainModuleProps {
  onNavigateOrder?: (orderId: string) => void;
  onNavigateLogistics?: (dispatchId?: string) => void;
  selectedProductId?: string;
}

export const SupplyChainModule: React.FC<SupplyChainModuleProps> = ({
  onNavigateOrder,
  onNavigateLogistics,
  selectedProductId,
}) => {
  const {
    products,
    stockMovements,
    procurement,
    dispatches,
    orders,
    adjustStock,
    createProcurementPO,
    receiveProcurement,
    createDispatch,
    updateDispatchStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'procurement' | 'dispatch'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [adjustProdId, setAdjustProdId] = useState(products[0]?.id || '');
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustType, setAdjustType] = useState<'Inward' | 'Outward'>('Inward');
  const [adjustNotes, setAdjustNotes] = useState('Routine warehouse count check');

  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [poProdId, setPoProdId] = useState(products[0]?.id || '');
  const [poQty, setPoQty] = useState(100);
  const [poCost, setPoCost] = useState(4950);
  const [poSupplier, setPoSupplier] = useState('USHA International Ltd (OEM)');

  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [dispatchOrderId, setDispatchOrderId] = useState(orders[0]?.id || '');
  const [dispatchTransporter, setDispatchTransporter] = useState('VRL Logistics Ltd');
  const [dispatchVehicle, setDispatchVehicle] = useState('UP 32 GC 4812');
  const [dispatchLR, setDispatchLR] = useState('LR-VRL-99014');
  const [dispatchEway, setDispatchEway] = useState('241890124810');

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcurement = procurement.filter(
    (p) =>
      p.purchaseRequirementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDispatches = dispatches.filter(
    (d) =>
      d.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.transporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdjustStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustStock(adjustProdId, Number(adjustQty), adjustType, adjustNotes);
    setIsStockAdjustOpen(false);
  };

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === poProdId);
    createProcurementPO({
      productId: poProdId,
      product: prod?.name || 'USHA Tailor Deluxe',
      quantity: Number(poQty),
      costPerUnit: Number(poCost),
      supplier: poSupplier,
      expectedDelivery: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    });
    setIsNewPOOpen(false);
  };

  const handleCreateDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ord = orders.find((o) => o.id === dispatchOrderId);
    if (!ord) return;

    createDispatch({
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      customerId: ord.customerId,
      customerName: ord.customerName,
      product: ord.product,
      quantity: ord.quantity,
      transporter: dispatchTransporter,
      vehicleNumber: dispatchVehicle,
      lrNumber: dispatchLR,
      eWayBillNumber: dispatchEway,
      destinationState: ord.state,
    });
    setIsNewDispatchOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Supply Chain & Inventory</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              Centralized Logistics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            USHA sewing machine stock, factory OEM procurement, warehouse reservation, and carrier dispatches
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'inventory' && (
            <button
              onClick={() => setIsStockAdjustOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Adjust Stock</span>
            </button>
          )}

          {activeTab === 'procurement' && (
            <button
              onClick={() => setIsNewPOOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
            >
              <Plus className="h-4 w-4" />
              <span>Issue OEM PO</span>
            </button>
          )}

          {activeTab === 'dispatch' && (
            <div className="flex items-center gap-2">
              {onNavigateLogistics && (
                <button
                  onClick={() => onNavigateLogistics()}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 px-3 py-1.5 text-xs font-bold transition shadow-xs"
                >
                  <Navigation className="h-4 w-4 text-purple-600" />
                  <span>Shiprocket Rates Hub</span>
                </button>
              )}
              <button
                onClick={() => setIsNewDispatchOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                <span>Create Dispatch</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-t-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Warehouse Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('procurement')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'procurement'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Procurement & POs ({procurement.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'dispatch'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Dispatch Logistics ({dispatches.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={`Search in ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => {
              const freeStock = prod.quantityAvailable - prod.reservedQuantity;
              const isLow = prod.stockStatus === 'Low Stock' || freeStock <= prod.minimumStock;

              return (
                <div
                  key={prod.id}
                  className={`rounded-xl border p-4 shadow-xs transition bg-white flex flex-col justify-between ${
                    isLow ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-700">{prod.sku}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLow ? '⚠️ Low Stock' : 'In Stock'}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{prod.location}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Qty</span>
                        <span className="font-extrabold text-slate-900">{prod.quantityAvailable}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reserved</span>
                        <span className="font-extrabold text-amber-700">{prod.reservedQuantity}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Free Stock</span>
                        <span className={`font-extrabold ${freeStock <= prod.minimumStock ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {freeStock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Unit Price</span>
                      <p className="font-bold text-slate-900">₹{prod.unitPrice.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      onClick={() => {
                        setAdjustProdId(prod.id);
                        setIsStockAdjustOpen(true);
                      }}
                      className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Adjust Qty
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stock Movement Audit Log */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Warehouse Stock Movement Audit History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Movement Type</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Reference Document</th>
                    <th className="py-2.5 px-3">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockMovements.slice(0, 6).map((sm) => (
                    <tr key={sm.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{sm.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{sm.productName}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            sm.type === 'Inward'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sm.type === 'Reserved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {sm.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sm.quantity} Units</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{sm.referenceId}</td>
                      <td className="py-2.5 px-3 text-slate-500">{sm.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROCUREMENT */}
      {activeTab === 'procurement' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="py-3 px-4">Requirement & PO #</th>
                  <th className="py-3 px-4">Supplier (OEM)</th>
                  <th className="py-3 px-4">Product & Qty</th>
                  <th className="py-3 px-4">Total Cost</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProcurement.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-800">{item.purchaseRequirementNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.poNumber || 'Draft PO'}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">{item.supplier}</td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{item.product}</div>
                      <span className="text-[11px] font-bold text-slate-600">{item.quantity} Units</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{formatINR(item.totalCost)}</div>
                      <div className="text-[10px] text-slate-400">₹{item.costPerUnit}/unit</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>{formatDate(item.expectedDelivery)}</div>
                      {item.actualDelivery && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Delivered: {item.actualDelivery}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.status === 'Received at Warehouse'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {item.status !== 'Received at Warehouse' ? (
                        <button
                          onClick={() => receiveProcurement(item.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-700 shadow-xs"
                        >
                          Receive Inward
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Stocked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCH & LOGISTICS */}
      {activeTab === 'dispatch' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="py-3 px-4">Dispatch # & Order</th>
                  <th className="py-3 px-4">Customer & Destination</th>
                  <th className="py-3 px-4">Product & Quantity</th>
                  <th className="py-3 px-4">Transporter, LR & Vehicle</th>
                  <th className="py-3 px-4">E-Way Bill Number</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDispatches.map((disp) => (
                  <tr key={disp.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-purple-800">{disp.dispatchNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Order: {disp.orderNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 max-w-[180px] truncate">{disp.customerName}</div>
                      <div className="text-[10px] text-slate-500">
                        {disp.destinationDistrict}, {disp.destinationState}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{disp.product}</div>
                      <span className="text-[11px] font-bold text-slate-700">{disp.quantity} Units</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{disp.transporter}</div>
                      <div className="text-[10px] text-slate-500">
                        {disp.vehicleNumber} · LR: {disp.lrNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {disp.eWayBillNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          disp.deliveryStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : disp.deliveryStatus === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {disp.deliveryStatus}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">ETA: {disp.expectedDelivery}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {onNavigateLogistics && (
                          <button
                            onClick={() => onNavigateLogistics(disp.id)}
                            className="rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 text-xs font-bold flex items-center gap-1 transition"
                            title="View in Logistics & Courier Tracking Hub"
                          >
                            <Navigation className="h-3 w-3" />
                            <span>Track</span>
                          </button>
                        )}
                        {disp.deliveryStatus !== 'Delivered' && (
                          <button
                            onClick={() => updateDispatchStatus(disp.id, 'Delivered', 'Delivered & signed POD received')}
                            className="rounded-lg bg-purple-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-purple-700 shadow-xs"
                          >
                            Mark Delivered
                          </button>
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

      {/* Adjust Stock Modal */}
      {isStockAdjustOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Adjust Warehouse Stock</h3>
              <button onClick={() => setIsStockAdjustOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAdjustStockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product</label>
                <select
                  value={adjustProdId}
                  onChange={(e) => setAdjustProdId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Movement Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  >
                    <option value="Inward">Inward (Add)</option>
                    <option value="Outward">Outward (Deduct)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustOpen(false)}
                  className="rounded-lg border px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white">
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New PO Modal */}
      {isNewPOOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Issue Purchase Order to USHA OEM</h3>
              <button onClick={() => setIsNewPOOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreatePOSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={poSupplier}
                  onChange={(e) => setPoSupplier(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product</label>
                <select
                  value={poProdId}
                  onChange={(e) => {
                    setPoProdId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) setPoCost(Math.round(prod.unitPrice * 0.82));
                  }}
                  className="w-full rounded-md border border-slate-300 p-2"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={poQty}
                    onChange={(e) => setPoQty(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">OEM Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={poCost}
                    onChange={(e) => setPoCost(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-slate-700 font-semibold">
                Total Purchase Order Value: {formatINR(poQty * poCost)}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPOOpen(false)}
                  className="rounded-lg border px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-amber-600 px-5 py-2 font-bold text-white">
                  Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Dispatch Modal */}
      {isNewDispatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create Dispatch & Carrier Consignment</h3>
              <button onClick={() => setIsNewDispatchOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Order to Dispatch</label>
                <select
                  value={dispatchOrderId}
                  onChange={(e) => setDispatchOrderId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.customerName} ({o.quantity} units)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transporter</label>
                <input
                  type="text"
                  value={dispatchTransporter}
                  onChange={(e) => setDispatchTransporter(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={dispatchVehicle}
                    onChange={(e) => setDispatchVehicle(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lorry Receipt (LR) #</label>
                  <input
                    type="text"
                    value={dispatchLR}
                    onChange={(e) => setDispatchLR(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-Way Bill Number</label>
                <input
                  type="text"
                  value={dispatchEway}
                  onChange={(e) => setDispatchEway(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchOpen(false)}
                  className="rounded-lg border px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-purple-600 px-5 py-2 font-bold text-white">
                  Dispatch Goods
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
