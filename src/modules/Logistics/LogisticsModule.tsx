import React, { useState, useMemo, useEffect } from 'react';
import {
  Truck,
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Download,
  Filter,
  Navigation,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Boxes,
  Phone,
  Calendar,
  Layers,
  Scale,
  Building2,
  DollarSign,
  Send,
  RefreshCw,
  Plus,
  Eye,
  Printer,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DispatchRecord, CourierCarrierOption, PincodeInfo, TrackingEvent } from '../../types';
import { formatINR, formatDate, exportToCSV } from '../../utils/formatters';
import {
  ORIGIN_WAREHOUSES,
  PINCODE_DIRECTORY,
  MACHINERY_PRESETS,
  resolvePincode,
  calculateVolumetricWeight,
  calculateChargeableWeight,
  calculateCarrierRates,
  generateTrackingHistory,
} from '../../utils/logisticsCalculator';

interface LogisticsModuleProps {
  onNavigateOrder?: (orderId: string) => void;
  selectedDispatchId?: string;
  selectedOrderId?: string;
}

export const LogisticsModule: React.FC<LogisticsModuleProps> = ({
  onNavigateOrder,
  selectedDispatchId,
  selectedOrderId,
}) => {
  const { dispatches, orders, customers, createDispatch, updateDispatchStatus } = useApp();

  // Tab State: 'calculator' | 'tracking' | 'serviceability'
  const [activeTab, setActiveTab] = useState<'calculator' | 'tracking' | 'serviceability'>('calculator');

  // Rate Calculator State
  const [selectedOriginHub, setSelectedOriginHub] = useState<string>(ORIGIN_WAREHOUSES[0].id);
  const [destPinCode, setDestPinCode] = useState<string>('226001'); // Lucknow default
  const [deadWeightKg, setDeadWeightKg] = useState<number>(14.0);
  const [lengthCm, setLengthCm] = useState<number>(45);
  const [widthCm, setWidthCm] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(35);
  const [boxCount, setBoxCount] = useState<number>(1);
  const [carrierFilter, setCarrierFilter] = useState<'all' | 'cheapest' | 'fastest' | 'b2b'>('all');

  // Serviceability directory filter state
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [selectedServiceZone, setSelectedServiceZone] = useState<string>('All');

  // Tracking Search & Filter State
  const [trackingSearch, setTrackingSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [carrierCodeFilter, setCarrierCodeFilter] = useState<string>('All');
  const [activeTrackingDispatch, setActiveTrackingDispatch] = useState<DispatchRecord | null>(
    dispatches.find((d) => d.id === selectedDispatchId) || dispatches[0] || null
  );

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCarrierForBooking, setSelectedCarrierForBooking] = useState<CourierCarrierOption | null>(null);
  const [bookingOrderId, setBookingOrderId] = useState<string>(orders[0]?.id || '');
  const [bookingVehicle, setBookingVehicle] = useState<string>('HR 55 AU 9102');
  const [bookingDriverPhone, setBookingDriverPhone] = useState<string>('+91 98100 44219');
  const [bookingNotes, setBookingNotes] = useState<string>('Urgent government tender consignment dispatch');
  const [bookingSuccessToast, setBookingSuccessToast] = useState<{ message: string; dispatchId: string } | null>(null);

  // Proof of Delivery Modal
  const [podModalUrl, setPodModalUrl] = useState<string | null>(null);

  // Thermal AWB Shipping Label Modal
  const [shippingLabelDispatch, setShippingLabelDispatch] = useState<DispatchRecord | null>(null);

  // Cross-Navigation Effects
  useEffect(() => {
    if (selectedDispatchId) {
      const found = dispatches.find((d) => d.id === selectedDispatchId);
      if (found) {
        setActiveTrackingDispatch(found);
        setActiveTab('tracking');
      }
    }
  }, [selectedDispatchId, dispatches]);

  useEffect(() => {
    if (selectedOrderId) {
      const ord = orders.find((o) => o.id === selectedOrderId);
      if (ord) {
        setBookingOrderId(ord.id);
        const cust = customers.find((c) => c.id === ord.customerId);
        if (cust?.state === 'Uttar Pradesh') setDestPinCode('226001');
        else if (cust?.state === 'Karnataka') setDestPinCode('560001');
        else if (cust?.state === 'Bihar') setDestPinCode('800001');
        else if (cust?.state === 'Maharashtra') setDestPinCode('400001');
        else if (cust?.state === 'West Bengal') setDestPinCode('700001');
        else if (cust?.state === 'Tamil Nadu') setDestPinCode('600001');
        else if (cust?.state === 'Telangana') setDestPinCode('500001');
        else if (cust?.state === 'Gujarat') setDestPinCode('380001');
        else if (cust?.state === 'Assam') setDestPinCode('781001');
        else if (cust?.state === 'Jammu & Kashmir') setDestPinCode('190001');

        const existingDisp = dispatches.find((d) => d.orderId === ord.id);
        if (existingDisp) {
          setActiveTrackingDispatch(existingDisp);
          setActiveTab('tracking');
        } else {
          setActiveTab('calculator');
        }
      }
    }
  }, [selectedOrderId, orders, customers, dispatches]);

  // Derived Calculations
  const currentOrigin = ORIGIN_WAREHOUSES.find((w) => w.id === selectedOriginHub) || ORIGIN_WAREHOUSES[0];
  const resolvedDest = useMemo(() => resolvePincode(destPinCode), [destPinCode]);

  const volumetricWeightKg = useMemo(
    () => calculateVolumetricWeight(lengthCm, widthCm, heightCm),
    [lengthCm, widthCm, heightCm]
  );

  const chargeableWeightKg = useMemo(
    () => calculateChargeableWeight(deadWeightKg, volumetricWeightKg, boxCount),
    [deadWeightKg, volumetricWeightKg, boxCount]
  );

  const carrierRates = useMemo(() => {
    return calculateCarrierRates(currentOrigin.pincode, destPinCode, chargeableWeightKg, boxCount);
  }, [currentOrigin.pincode, destPinCode, chargeableWeightKg, boxCount]);

  const filteredCarrierRates = useMemo(() => {
    if (carrierFilter === 'cheapest') {
      return [...carrierRates].sort((a, b) => a.totalCost - b.totalCost);
    }
    if (carrierFilter === 'fastest') {
      return [...carrierRates].sort((a, b) => a.etdDays - b.etdDays);
    }
    if (carrierFilter === 'b2b') {
      return carrierRates.filter((c) => c.carrierCode === 'vrl' || c.carrierCode === 'tci' || c.carrierCode === 'safexpress');
    }
    return carrierRates;
  }, [carrierRates, carrierFilter]);

  // Apply Preset
  const handleApplyPreset = (presetId: string) => {
    const preset = MACHINERY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setDeadWeightKg(preset.deadWeightKg);
    setLengthCm(preset.lengthCm);
    setWidthCm(preset.widthCm);
    setHeightCm(preset.heightCm);
  };

  // Handle Carrier Booking Action
  const handleOpenBooking = (carrier: CourierCarrierOption) => {
    setSelectedCarrierForBooking(carrier);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarrierForBooking) return;

    const ord = orders.find((o) => o.id === bookingOrderId) || orders[0];
    const awbNum = `${selectedCarrierForBooking.carrierCode.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newDispId = createDispatch({
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      customerId: ord.customerId,
      customerName: ord.customerName,
      product: ord.product,
      quantity: ord.quantity,
      transporter: selectedCarrierForBooking.carrierName,
      carrierCode: selectedCarrierForBooking.carrierCode,
      trackingNumber: awbNum,
      vehicleNumber: bookingVehicle,
      lrNumber: `LR-${selectedCarrierForBooking.carrierCode.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      eWayBillNumber: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      originPinCode: currentOrigin.pincode,
      originCity: currentOrigin.city,
      destinationPinCode: destPinCode,
      destinationState: resolvedDest.state,
      destinationDistrict: resolvedDest.district,
      deadWeightKg,
      volumetricWeightKg,
      chargeableWeightKg,
      dimensionsCm: { length: lengthCm, width: widthCm, height: heightCm },
      boxCount,
      freightCost: selectedCarrierForBooking.totalCost,
      driverPhone: bookingDriverPhone,
      deliveryStatus: 'In Transit',
      deliveryNotes: bookingNotes,
      currentGpsLocation: `${currentOrigin.city} Dockyard Linehaul Scanned`,
    });

    setIsBookingModalOpen(false);
    setBookingSuccessToast({
      message: `Shipment booked successfully with ${selectedCarrierForBooking.carrierName}! AWB Tracking: ${awbNum}`,
      dispatchId: newDispId,
    });

    // Switch to tracking tab to show live consignment
    setTimeout(() => {
      const createdDisp = dispatches.find((d) => d.id === newDispId);
      if (createdDisp) {
        setActiveTrackingDispatch(createdDisp);
      }
      setActiveTab('tracking');
    }, 600);
  };

  // Filtered Tracking Dispatches
  const filteredDispatches = useMemo(() => {
    return dispatches.filter((d) => {
      const q = trackingSearch.toLowerCase();
      const matchesSearch =
        d.trackingNumber.toLowerCase().includes(q) ||
        d.orderNumber.toLowerCase().includes(q) ||
        d.transporter.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        d.destinationState.toLowerCase().includes(q) ||
        (d.destinationPinCode && d.destinationPinCode.includes(q)) ||
        d.product.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || d.deliveryStatus === statusFilter;
      const matchesCarrier = carrierCodeFilter === 'All' || d.carrierCode === carrierCodeFilter;

      return matchesSearch && matchesStatus && matchesCarrier;
    });
  }, [dispatches, trackingSearch, statusFilter, carrierCodeFilter]);

  const handleExportConsignments = () => {
    const exportData = filteredDispatches.map((d) => ({
      'Dispatch No': d.dispatchNumber,
      'Order No': d.orderNumber,
      'Transporter': d.transporter,
      'AWB Tracking': d.trackingNumber,
      'E-Way Bill': d.eWayBillNumber,
      'Consignee': d.customerName,
      'Destination State': d.destinationState,
      'Destination Pin': d.destinationPinCode || 'N/A',
      'Product': d.product,
      'Quantity': d.quantity,
      'Chargeable Wt (kg)': d.chargeableWeightKg || 'N/A',
      'Freight Cost (INR)': d.freightCost || 'N/A',
      'Status': d.deliveryStatus,
      'Dispatch Date': d.dispatchDate,
      'Expected Delivery': d.expectedDelivery,
    }));
    exportToCSV(exportData, 'GeoDigital_Logistics_Consignments');
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & LOGISTICS COMMAND BAR */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Logistics & Courier Hub
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Shiprocket B2B Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Volumetric size & weight calculator, multi-carrier rate cards, pin code serviceability check & live GPS tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportConsignments}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden xs:inline">Export</span> Manifest
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs ${
              activeTab === 'calculator'
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Rate Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs ${
              activeTab === 'tracking'
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Live Tracking ({dispatches.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {bookingSuccessToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{bookingSuccessToast.message}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const disp = dispatches.find((d) => d.id === bookingSuccessToast.dispatchId);
                if (disp) setShippingLabelDispatch(disp);
              }}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 text-xs flex items-center gap-1 shadow-xs transition"
            >
              <Printer className="h-3 w-3" />
              <span>Print AWB Shipping Label</span>
            </button>
            <button
              onClick={() => setBookingSuccessToast(null)}
              className="text-emerald-700 font-bold hover:underline ml-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-t-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'calculator'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Multi-Carrier Rate Calculator (Shiprocket B2B)</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'tracking'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Navigation className="h-4 w-4" />
          <span>Live Consignment Tracking & Timeline ({dispatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('serviceability')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'serviceability'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Pin Code Serviceability & Zone Directory</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB 1: SHIPROCKET MULTI-CARRIER RATE CALCULATOR */}
      {/* ======================================================== */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Quick Machinery Presets Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1-Click Machinery Size Presets (USHA Catalogue)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click any model to auto-fill dead weight & dimensions
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {MACHINERY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 px-3 py-1.5 text-left text-xs transition shrink-0 group"
                >
                  <p className="font-bold text-slate-800 group-hover:text-blue-700 truncate max-w-[200px]">
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {preset.deadWeightKg} kg · {preset.lengthCm}×{preset.widthCm}×{preset.heightCm} cm
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Grid: Route (Pin codes) + Dimensions / Weight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 cols): Route & Package Dimensions Input */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>1. Pickup & Delivery Pin Codes</span>
                </h3>

                {/* Origin Hub */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Origin Warehouse / Dock</label>
                  <select
                    value={selectedOriginHub}
                    onChange={(e) => setSelectedOriginHub(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                  >
                    {ORIGIN_WAREHOUSES.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.city} ({w.pincode}) - {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Pincode Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Destination Delivery Pin Code</span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase">
                      {resolvedDest.zone}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 226001, 560001, 800001..."
                      value={destPinCode}
                      onChange={(e) => setDestPinCode(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setDestPinCode('226001')}
                      className="rounded bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 shrink-0"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Quick Hubs:</span>
                    {[
                      { pin: '226001', label: 'Lucknow' },
                      { pin: '560001', label: 'Bengaluru' },
                      { pin: '800001', label: 'Patna' },
                      { pin: '400001', label: 'Mumbai' },
                      { pin: '700001', label: 'Kolkata' },
                      { pin: '600001', label: 'Chennai' },
                      { pin: '500001', label: 'Hyderabad' },
                      { pin: '302001', label: 'Jaipur' },
                      { pin: '781001', label: 'Guwahati' },
                      { pin: '190001', label: 'Srinagar' },
                    ].map((item) => (
                      <button
                        key={item.pin}
                        type="button"
                        onClick={() => setDestPinCode(item.pin)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono transition ${
                          destPinCode === item.pin
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title={`Quick set ${item.label} (${item.pin})`}
                      >
                        {item.label} ({item.pin})
                      </button>
                    ))}
                  </div>

                  {/* Destination Info Card */}
                  <div className="mt-2 rounded-lg bg-blue-50/70 border border-blue-100 p-2.5 text-xs text-blue-950">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900">{resolvedDest.city}, {resolvedDest.state}</span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                        Serviceable
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 mt-0.5 truncate">
                      Hub: {resolvedDest.hubName}
                    </p>
                  </div>
                </div>

                {/* Dimensions & Weight Input */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pt-2 pb-2 flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-indigo-600" />
                  <span>2. Weight & Package Dimensions</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Actual Dead Wt (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={deadWeightKg}
                      onChange={(e) => setDeadWeightKg(Math.max(0.1, Number(e.target.value)))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Number of Boxes</label>
                    <input
                      type="number"
                      min="1"
                      value={boxCount}
                      onChange={(e) => setBoxCount(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Dimensions (L x W x H) */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Dimensions in cm (L × W × H)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Length</span>
                      <input
                        type="number"
                        min="1"
                        value={lengthCm}
                        onChange={(e) => setLengthCm(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Width</span>
                      <input
                        type="number"
                        min="1"
                        value={widthCm}
                        onChange={(e) => setWidthCm(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Height</span>
                      <input
                        type="number"
                        min="1"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Shiprocket Volumetric Weight Formula Card */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-indigo-950 font-bold">
                    <span>Volumetric Calculation:</span>
                    <span className="font-mono text-indigo-700">{volumetricWeightKg} kg / box</span>
                  </div>
                  <p className="text-[10px] text-indigo-600 font-mono">
                    Formula: ({lengthCm} × {widthCm} × {heightCm}) ÷ 5000 = {volumetricWeightKg} kg
                  </p>
                  <div className="border-t border-indigo-200/60 pt-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Chargeable Weight ({boxCount} {boxCount === 1 ? 'box' : 'boxes'}):
                    </span>
                    <span className="font-extrabold text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      {chargeableWeightKg} kg
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    * Billed on whichever is higher: Dead Wt ({deadWeightKg * boxCount} kg) vs Volumetric Wt ({volumetricWeightKg * boxCount} kg)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Shiprocket-Style Multi-Carrier Rate Cards */}
            <div className="lg:col-span-7 space-y-4">
              {/* Carrier Filter Tabs & Summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Available Carrier Quotes ({filteredCarrierRates.length})
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {(['all', 'cheapest', 'fastest', 'b2b'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setCarrierFilter(filterKey)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                        carrierFilter === filterKey
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filterKey === 'all'
                        ? 'All Couriers'
                        : filterKey === 'cheapest'
                        ? 'Lowest Rate'
                        : filterKey === 'fastest'
                        ? 'Fastest ETA'
                        : 'Heavy B2B'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrier Rate Cards List */}
              <div className="space-y-3">
                {filteredCarrierRates.map((carrier) => (
                  <div
                    key={carrier.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3"
                  >
                    {/* Top Row: Carrier Header, Badges, ETA & Price */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{carrier.carrierName}</h4>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                            {carrier.mode}
                          </span>
                          {carrier.isCheapest && (
                            <span className="rounded bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                              ★ Lowest Price
                            </span>
                          )}
                          {carrier.isFastest && (
                            <span className="rounded bg-amber-100 px-2 py-0.2 text-[10px] font-bold text-amber-800">
                              ⚡ Fastest Delivery
                            </span>
                          )}
                          {carrier.isBestB2B && (
                            <span className="rounded bg-purple-100 px-2 py-0.2 text-[10px] font-bold text-purple-800">
                              Heavy Machinery Choice
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            {carrier.etdDays} {carrier.etdDays === 1 ? 'Day' : 'Days'} ETA
                          </span>
                          <span>·</span>
                          <span className="text-slate-600">
                            Expected: <strong className="text-slate-800">{carrier.estimatedDeliveryDate}</strong>
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-amber-600">
                            {carrier.rating} ★ ({carrier.onTimeRate}% on-time SLA)
                          </span>
                        </div>
                      </div>

                      {/* Price & Book Button */}
                      <div className="sm:text-right shrink-0 pt-1 sm:pt-0">
                        <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                          {formatINR(carrier.totalCost)}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          ₹{carrier.baseRatePerKg}/kg · Incl. GST & Docket
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Features & Pickup Cutoff */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {carrier.carrierFeatures.map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-600"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Same-day pickup cutoff: <strong className="text-slate-700">{carrier.pickupCutoffTime}</strong>
                      </div>
                    </div>

                    {/* Bottom Row: Detailed Price Breakdown & Book Action */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
                      <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
                        <span>Freight: <strong>{formatINR(carrier.freightCharge)}</strong></span>
                        <span>·</span>
                        <span>Fuel (12%): <strong>{formatINR(carrier.fuelSurcharge)}</strong></span>
                        <span>·</span>
                        <span>Docket: <strong>{formatINR(carrier.docketFee)}</strong></span>
                        <span>·</span>
                        <span>GST (18%): <strong>{formatINR(carrier.gstAmount)}</strong></span>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(carrier)}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 transition shadow-xs flex items-center gap-1.5"
                      >
                        <span>Select & Book Consignment</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB 2: LIVE SHIPMENT TRACKING & CONSIGNMENT HISTORY */}
      {/* ======================================================== */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          {/* Tracking Filter & Search Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search AWB, order ID, transporter, customer, district..."
                  value={trackingSearch}
                  onChange={(e) => setTrackingSearch(e.target.value)}
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
                  <option value="Packed">Packed</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Carrier:</span>
                <select
                  value={carrierCodeFilter}
                  onChange={(e) => setCarrierCodeFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
                >
                  <option value="All">All Carriers</option>
                  <option value="delhivery">Delhivery</option>
                  <option value="bluedart">Blue Dart</option>
                  <option value="vrl">VRL Logistics</option>
                  <option value="tci">TCI Freight</option>
                  <option value="safexpress">Safexpress</option>
                </select>
              </div>
            </div>
          </div>

          {/* Consignments List & Interactive Journey Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Consignments Table / Cards List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Consignment Dispatches ({filteredDispatches.length})
                </h3>
                <span className="text-xs text-slate-400">Click any card to inspect full tracking</span>
              </div>

              {filteredDispatches.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                  No shipments match the specified search or filter criteria.
                </div>
              ) : (
                filteredDispatches.map((disp) => {
                  const isSelected = activeTrackingDispatch?.id === disp.id;
                  return (
                    <div
                      key={disp.id}
                      onClick={() => setActiveTrackingDispatch(disp)}
                      className={`rounded-xl border p-4 transition cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/20 shadow-md ring-1 ring-blue-500/20'
                          : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                      }`}
                    >
                      {/* Top Row: AWB Number, Transporter, Status Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700">
                            {disp.trackingNumber}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                            {disp.transporter}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            disp.deliveryStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : disp.deliveryStatus === 'In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {disp.deliveryStatus}
                        </span>
                      </div>

                      {/* Middle Row: Product, Consignee & Route */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {disp.customerName}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                          <span>
                            {disp.product} (Qty: {disp.quantity})
                          </span>
                          <span>·</span>
                          <span className="font-medium text-slate-700">
                            To: {disp.destinationDistrict}, {disp.destinationState} ({disp.destinationPinCode || '226001'})
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: E-Way bill, Vehicle, ETA & Action */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Vehicle: <strong className="text-slate-700">{disp.vehicleNumber}</strong></span>
                          <span>·</span>
                          <span>E-Way: <strong className="text-slate-700 font-mono">{disp.eWayBillNumber}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShippingLabelDispatch(disp);
                            }}
                            className="text-[11px] font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 transition"
                            title="Print / View AWB Courier Label"
                          >
                            <Printer className="h-3 w-3 text-slate-500" />
                            <span>AWB Label</span>
                          </button>
                          <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                            <span>Timeline</span>
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Consignment Detail & Live Timeline Drawer (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {activeTrackingDispatch ? (
                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4 sticky top-20">
                  {/* Card Header */}
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Consignment Tracking Dossier
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activeTrackingDispatch.deliveryStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activeTrackingDispatch.deliveryStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {activeTrackingDispatch.trackingNumber}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Carrier: <strong className="text-slate-800">{activeTrackingDispatch.transporter}</strong>
                    </p>
                  </div>

                  {/* Consignment Specs Quick Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Consignee</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {activeTrackingDispatch.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {activeTrackingDispatch.destinationDistrict}, {activeTrackingDispatch.destinationState}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle & Fleet</span>
                      <span className="font-semibold text-slate-800 block">
                        {activeTrackingDispatch.vehicleNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Driver: {activeTrackingDispatch.driverPhone || '+91 98100 44219'}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Consignment Goods</span>
                      <span className="font-semibold text-slate-800 block truncate">
                        {activeTrackingDispatch.product}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Quantity: {activeTrackingDispatch.quantity} units
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">GST E-Way Bill</span>
                      <span className="font-semibold font-mono text-slate-800 block">
                        {activeTrackingDispatch.eWayBillNumber}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">Valid & Active</span>
                    </div>
                  </div>

                  {/* Live GPS Telemetry Checkpoint */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900">
                      <Navigation className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                      <span>Live GPS Telemetry Checkpoint</span>
                    </div>
                    <p className="text-[11px] text-blue-800 font-medium">
                      {activeTrackingDispatch.currentGpsLocation || 'Highway Transit - NH-19 Corridor'}
                    </p>
                    <p className="text-[10px] text-blue-600">
                      Last scan timestamp: {formatDate(activeTrackingDispatch.dispatchDate)} · Transponder active
                    </p>
                  </div>

                  {/* Visual Milestone Timeline */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Consignment Milestone Journey
                    </h4>

                    <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                      {(
                        activeTrackingDispatch.trackingHistory ||
                        generateTrackingHistory(
                          activeTrackingDispatch.originCity || 'Gurugram',
                          activeTrackingDispatch.destinationDistrict || 'Lucknow',
                          activeTrackingDispatch.deliveryStatus,
                          activeTrackingDispatch.dispatchDate,
                          activeTrackingDispatch.transporter,
                          activeTrackingDispatch.vehicleNumber
                        )
                      ).map((event, idx) => (
                        <div key={idx} className="relative pl-4 space-y-0.5">
                          {/* Dot indicator */}
                          <div
                            className={`absolute -left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                              event.completed
                                ? 'bg-blue-600 ring-2 ring-blue-100'
                                : 'bg-slate-300'
                            }`}
                          />
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{event.status}</span>
                            <span className="text-[10px] text-slate-400">{event.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-blue-700 font-medium">{event.location}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proof of Delivery (POD) Slip Button */}
                  {activeTrackingDispatch.deliveryStatus === 'Delivered' && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Proof of Delivery (POD) Acknowledged</span>
                        </span>
                        <span className="text-[10px] text-emerald-700">Signed & Stamped</span>
                      </div>
                      <button
                        onClick={() =>
                          setPodModalUrl(
                            activeTrackingDispatch.proofOfDeliveryUrl ||
                              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
                          )
                        }
                        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 text-xs font-bold shadow-xs transition"
                      >
                        View Official Signed POD Slip
                      </button>
                    </div>
                  )}

                  {/* Print AWB Shipping Label Button */}
                  <button
                    onClick={() => setShippingLabelDispatch(activeTrackingDispatch)}
                    className="w-full rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Printer className="h-4 w-4 text-blue-600" />
                    <span>Print Official AWB Shipping Label & Barcode</span>
                  </button>

                  {/* Status Toggle Quick Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Update Status:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateDispatchStatus(activeTrackingDispatch.id, 'In Transit')}
                        className={`rounded px-2 py-1 text-[11px] font-semibold transition ${
                          activeTrackingDispatch.deliveryStatus === 'In Transit'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        In Transit
                      </button>
                      <button
                        onClick={() => updateDispatchStatus(activeTrackingDispatch.id, 'Delivered')}
                        className={`rounded px-2 py-1 text-[11px] font-semibold transition ${
                          activeTrackingDispatch.deliveryStatus === 'Delivered'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                  Select a consignment to view tracking details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB 3: PIN CODE SERVICEABILITY & ZONE DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'serviceability' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Pan-India Pin Code Logistics Serviceability & Postal Zones</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Government delivery hubs, transport nagar depot reach, remote tribal block access, and carrier compatibility
                </p>
              </div>

              {/* Search & Zone Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pin code, city, state, hub..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-44 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  />
                  {serviceSearch && (
                    <button onClick={() => setServiceSearch('')} className="text-slate-400 hover:text-slate-600">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedServiceZone}
                  onChange={(e) => setSelectedServiceZone(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="All">All Postal Zones</option>
                  <option value="Zone A">Zone A (Intra-City)</option>
                  <option value="Zone B">Zone B (Regional / Intra-State)</option>
                  <option value="Zone C">Zone C (Metro-to-Metro)</option>
                  <option value="Zone D">Zone D (Rest of India)</option>
                  <option value="Zone E">Zone E (Special / Remote / NE / J&K)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(PINCODE_DIRECTORY)
                .filter((pinInfo) => {
                  const q = serviceSearch.toLowerCase().trim();
                  const matchesSearch =
                    !q ||
                    pinInfo.pincode.includes(q) ||
                    pinInfo.city.toLowerCase().includes(q) ||
                    pinInfo.state.toLowerCase().includes(q) ||
                    pinInfo.hubName.toLowerCase().includes(q);
                  const matchesZone =
                    selectedServiceZone === 'All' ||
                    pinInfo.zone.toLowerCase().includes(selectedServiceZone.toLowerCase());
                  return matchesSearch && matchesZone;
                })
                .map((pinInfo) => (
                  <div
                    key={pinInfo.pincode}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2 hover:bg-white hover:border-blue-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {pinInfo.pincode} · {pinInfo.city}
                      </span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                        100% Serviceable
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{pinInfo.state}</h5>
                      <p className="text-[11px] text-slate-500 truncate">{pinInfo.hubName}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                      <span className="font-bold text-blue-900">{pinInfo.zone}</span>
                      <button
                        onClick={() => {
                          setDestPinCode(pinInfo.pincode);
                          setActiveTab('calculator');
                        }}
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5"
                      >
                        <span>Check Rates</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: BOOK COURIER CONSIGNMENT DIALOG */}
      {/* ======================================================== */}
      {isBookingModalOpen && selectedCarrierForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3.5 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Book Shipment with {selectedCarrierForBooking.carrierName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generate AWB docket, assign truck fleet & commit dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleConfirmBooking} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {/* Cost & Transit Summary Banner */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 block">Selected Carrier</span>
                  <span className="text-sm font-bold text-blue-950">{selectedCarrierForBooking.carrierName}</span>
                  <span className="text-[11px] text-blue-700 block mt-0.5">
                    ETA: {selectedCarrierForBooking.etdDays} Days ({selectedCarrierForBooking.estimatedDeliveryDate})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Freight Cost</span>
                  <span className="text-base font-extrabold text-blue-900">{formatINR(selectedCarrierForBooking.totalCost)}</span>
                  <span className="text-[10px] text-blue-600 block">
                    Chargeable Wt: {chargeableWeightKg} kg
                  </span>
                </div>
              </div>

              {/* Link to Project Order */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Link to Active Project Order</label>
                <select
                  value={bookingOrderId}
                  onChange={(e) => setBookingOrderId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 outline-none"
                >
                  {orders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.orderNumber} - {ord.customerName} ({ord.product}, Qty: {ord.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Assigned Vehicle / Fleet Number</label>
                  <input
                    type="text"
                    value={bookingVehicle}
                    onChange={(e) => setBookingVehicle(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Driver Contact Mobile</label>
                  <input
                    type="text"
                    value={bookingDriverPhone}
                    onChange={(e) => setBookingDriverPhone(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Dispatch Notes / Institutional Delivery Instructions</label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Generate Docket & Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: PROOF OF DELIVERY (POD) PREVIEW */}
      {/* ======================================================== */}
      {podModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">Signed Proof of Delivery (POD) Slip</h4>
              </div>
              <button onClick={() => setPodModalUrl(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-96 flex items-center justify-center">
              <img
                src={podModalUrl}
                alt="Proof of Delivery Slip"
                className="w-full h-auto object-cover max-h-96"
              />
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Official seal of receiving department with receiver signature and delivery token stamp.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL: OFFICIAL AWB SHIPPING LABEL & BARCODE PREVIEW */}
      {/* ======================================================== */}
      {shippingLabelDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Official Courier Shipping Label & AWB Manifest
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Standard 4×6 inch format ready for thermal / laser print
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShippingLabelDispatch(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Thermal Courier Shipping Label */}
            <div className="rounded-xl border-2 border-dashed border-slate-400 bg-white p-4 font-mono text-xs text-slate-900 space-y-3 shadow-sm">
              {/* Carrier & Mode Banner */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <div>
                  <span className="font-extrabold text-sm uppercase text-slate-950 tracking-wider">
                    {shippingLabelDispatch.transporter}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-sans">
                    Shiprocket B2B Enterprise Network
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-slate-950 text-white px-2 py-0.5 rounded uppercase">
                    SURFACE / B2B CARGO
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    PREPAID · GE-DIRECT
                  </span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="text-center py-2.5 bg-slate-50 rounded-lg border border-slate-300 space-y-1">
                <div className="flex justify-center items-center gap-[2.5px] h-12 px-4">
                  {[4, 2, 5, 2, 6, 3, 2, 4, 6, 2, 5, 3, 2, 4, 6, 2, 5, 3, 4, 2, 6, 3, 2, 5, 4, 2, 6, 3, 2, 5, 3, 2, 4, 6].map(
                    (w, i) => (
                      <span
                        key={i}
                        className="bg-slate-950 h-full inline-block rounded-xs"
                        style={{ width: `${w}px` }}
                      />
                    )
                  )}
                </div>
                <div className="text-xs font-bold tracking-widest text-slate-950">
                  AWB #{shippingLabelDispatch.trackingNumber}
                </div>
              </div>

              {/* Routing Depot & E-Way Bill */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-300 pb-2">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Routing Gateway</span>
                  <span className="font-extrabold text-slate-950">
                    {shippingLabelDispatch.destinationDistrict.toUpperCase()} / TRANSIT-01
                  </span>
                  <span className="text-[10px] text-blue-700 font-sans block">
                    Hub: {shippingLabelDispatch.destinationState}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">GST E-Way Bill Number</span>
                  <span className="font-extrabold text-slate-950 font-mono">
                    {shippingLabelDispatch.eWayBillNumber}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-sans block font-semibold">
                    Verified GST Compliant
                  </span>
                </div>
              </div>

              {/* Consignor vs Consignee Addresses */}
              <div className="grid grid-cols-2 gap-3 border-b border-slate-300 pb-2.5 text-[10px]">
                <div className="space-y-0.5">
                  <span className="font-bold uppercase text-slate-500 block">SHIP FROM (CONSIGNOR):</span>
                  <p className="font-bold text-slate-950 font-sans">Geo Digital OS (Central OEM Depot)</p>
                  <p className="text-slate-600 leading-tight font-sans">Plot 44, Udyog Vihar Phase-IV</p>
                  <p className="text-slate-600 leading-tight font-sans">Gurugram, Haryana - 122001</p>
                  <p className="text-slate-700 font-sans">GSTIN: 06AABCU9603R1ZM</p>
                </div>

                <div className="space-y-0.5">
                  <span className="font-bold uppercase text-slate-500 block">SHIP TO (CONSIGNEE):</span>
                  <p className="font-bold text-slate-950 font-sans truncate">
                    {shippingLabelDispatch.customerName}
                  </p>
                  <p className="text-slate-600 leading-tight font-sans">
                    {shippingLabelDispatch.destinationDistrict}, {shippingLabelDispatch.destinationState}
                  </p>
                  <p className="font-bold text-slate-950 text-xs">
                    PIN: {shippingLabelDispatch.destinationPinCode || '226001'}
                  </p>
                  <p className="text-slate-600 font-sans">
                    Contact: {shippingLabelDispatch.driverPhone || '+91 98100 44219'}
                  </p>
                </div>
              </div>

              {/* Package & Weight Specifications */}
              <div className="flex items-center justify-between text-[10px] pt-1 border-b border-slate-300 pb-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-950 block font-sans truncate max-w-[260px]">
                    Item: {shippingLabelDispatch.product}
                  </span>
                  <span className="text-slate-600 font-sans">
                    Order Ref: {shippingLabelDispatch.orderNumber} · Vehicle: {shippingLabelDispatch.vehicleNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-950 block text-xs">
                    Wt: {shippingLabelDispatch.chargeableWeightKg || 14} KG
                  </span>
                  <span className="text-slate-500">
                    LR: {shippingLabelDispatch.lrNumber}
                  </span>
                </div>
              </div>

              {/* Security & Verification Footer */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 font-sans pt-1">
                <span>Certified by Geo Digital Logistics Hub</span>
                <span>Date: {formatDate(shippingLabelDispatch.dispatchDate)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                AWB manifests are recorded into institutional audit logs
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShippingLabelDispatch(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Label</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
