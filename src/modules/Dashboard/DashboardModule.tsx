import React, { useState, useEffect, useRef } from 'react';
import {
  FileSpreadsheet,
  Award,
  ShoppingCart,
  Truck,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Package,
  Layers,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Boxes,
  Building2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Wrench,
  Navigation,
  Compass,
  HeartHandshake,
  Route,
  Shield,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR, getDaysRemaining, formatDate } from '../../utils/formatters';

interface DashboardModuleProps {
  onNavigate: (module: string, recordId?: string) => void;
  onNewTender: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigate,
  onNewTender,
}) => {
  const { tenders, orders, invoices, products, tasks, dateFilter, setDateFilter } = useApp();

  // Metrics calculation
  const activeTenders = tenders.filter((t) => !['Won', 'Lost', 'Cancelled'].includes(t.status));
  const closingSoonTenders = activeTenders.filter((t) => {
    const days = getDaysRemaining(t.submissionDeadline);
    return !days.isOverdue && days.days <= 7;
  });
  const submittedTenders = tenders.filter((t) => ['Submitted', 'Under Evaluation'].includes(t.status));
  const wonTenders = tenders.filter((t) => t.status === 'Won');
  const lostTenders = tenders.filter((t) => t.status === 'Lost');
  const totalDecided = wonTenders.length + lostTenders.length;
  const winRate = totalDecided > 0 ? Math.round((wonTenders.length / totalDecided) * 100) : 75;

  const totalTenderPipelineValue = activeTenders.reduce((acc, t) => acc + t.estimatedValue, 0);
  const totalWonValue = wonTenders.reduce((acc, t) => acc + t.estimatedValue, 0);

  // Orders
  const activeOrders = orders.filter((o) => !['Delivered', 'Completed', 'Cancelled'].includes(o.status));
  const awaitingProcurementOrders = orders.filter((o) => o.status === 'Procurement Pending');
  const readyDispatchOrders = orders.filter((o) => o.status === 'Ready for Dispatch');
  const inTransitOrders = orders.filter((o) => o.status === 'In Transit');
  const deliveredOrders = orders.filter((o) => ['Delivered', 'Completed'].includes(o.status));
  const totalOrderValue = orders.reduce((acc, o) => acc + o.totalValue, 0);

  // Accounts & Cashflow
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.invoiceValue, 0);
  const totalReceived = invoices.reduce((acc, inv) => acc + inv.amountReceived, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);
  const overdueInvoices = invoices.filter((inv) => inv.paymentStatus === 'Overdue');
  const overdueAmount = overdueInvoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);

  // Inventory
  const lowStockProducts = products.filter(
    (p) => p.stockStatus === 'Low Stock' || p.quantityAvailable <= p.minimumStock
  );
  const totalStockUnits = products.reduce((acc, p) => acc + p.quantityAvailable, 0);
  const totalReservedUnits = products.reduce((acc, p) => acc + p.reservedQuantity, 0);

  // Tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const overdueTasks = tasks.filter((t) => t.status === 'Overdue');

  // Slider State & Swipe Handling
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = 10;
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped left -> Next
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    } else if (distance < -50) {
      // Swiped right -> Prev
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const slideTitles = [
    'Operations & Velocity',
    'PFMS Treasury',
    'USHA Factory Supply',
    'Flagship Tenders',
    'GeM Portal Command',
    'Pan-India Footprint',
    'Fleet & GPS Logistics',
    'PM-Vishwakarma Missions',
    'Warranty & SLA Network',
    'Statutory Vault',
  ];

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. TOP INTERACTIVE EXECUTIVE SLIDER / CAROUSEL SHOWCASE */}
      {/* ======================================================== */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg transition-all"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Top Progress Bar */}
        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Subtle Decorative Backdrop Elements */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Top Slider Control Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-300 truncate">
              Executive Briefing Slider
            </span>
            <span className="text-white/30 hidden xs:inline">|</span>
            <span className="text-[11px] sm:text-xs text-slate-300">
              {currentSlide + 1} / {totalSlides}
            </span>
            <span className="text-white/30 hidden md:inline">·</span>
            <span className="text-xs text-blue-200 font-medium hidden md:inline">
              {slideTitles[currentSlide]}
            </span>
          </div>

          {/* Quick Date Range Filter & Play/Pause & Arrows */}
          <div className="flex items-center gap-2">
            {/* Quick Period Selector (hidden on smallest screens to preserve space) */}
            <div className="hidden md:flex rounded-lg bg-white/10 p-0.5 backdrop-blur-xs text-[11px]">
              {(['This month', 'This quarter', 'This year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setDateFilter(period)}
                  className={`rounded-md px-2.5 py-1 font-medium transition ${
                    dateFilter === period
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Auto-Play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
              title={isAutoPlaying ? 'Pause Auto-Advance' : 'Resume Auto-Advance'}
            >
              {isAutoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            {/* Prev Arrow */}
            <button
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
              title="Previous Section"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
              title="Next Section"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Slide Content Container */}
        <div className="relative z-10 p-5 sm:p-7 min-h-[290px] flex flex-col justify-between">
          {/* SLIDE 0: Live Telemetry & Bidding Velocity */}
          {currentSlide === 0 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-300 uppercase">
                      Core Operations Telemetry
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Operational Command & Tender Velocity
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Central operating pipeline powering tender discovery, USHA straight-stitch & computerized machine supply, door-step distribution and treasury realization across 12 States.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={onNewTender}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>+ New Tender Bid</span>
                  </button>
                  <button
                    onClick={() => onNavigate('tenders')}
                    className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/25 transition backdrop-blur-xs"
                  >
                    <span>View Pipeline ({tenders.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Responsive Highlight Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tender Win Rate</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-400">{winRate}%</div>
                  <span className="text-[11px] text-slate-300 block">{wonTenders.length} Won · {lostTenders.length} Lost</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Bids Pipeline</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-blue-300">
                    {formatINR(totalTenderPipelineValue, true)}
                  </div>
                  <span className="text-[11px] text-slate-300 block">{activeTenders.length} active opportunities</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Project Orders</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-indigo-300">
                    {formatINR(totalOrderValue, true)}
                  </div>
                  <span className="text-[11px] text-slate-300 block">{activeOrders.length} orders in fulfillment</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Consignments In Transit</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-300">
                    {inTransitOrders.length + readyDispatchOrders.length} Fleets
                  </div>
                  <span className="text-[11px] text-slate-300 block">VRL, TCI & Safechem Carriers</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: PFMS Treasury Liquidity & Cashflow */}
          {currentSlide === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                      Financial Health & Liquidity
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">Zero Default Rate</span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Government Treasury & PFMS Cashflow Engine
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Commercial invoices linked with signed Proof of Delivery (POD) and state treasury token vouchers for uninterrupted liquidity and working capital stability.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('accounts')}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                  >
                    <IndianRupee className="h-4 w-4" />
                    <span>Open Accounts & Invoices</span>
                  </button>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoiced</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-white">
                    {formatINR(totalBilled, true)}
                  </div>
                  <span className="text-[11px] text-slate-300 block">{invoices.length} commercial bills</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Receipts Realized</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-400">
                    {formatINR(totalReceived, true)}
                  </div>
                  <span className="text-[11px] text-emerald-300 font-semibold block">
                    {Math.round((totalReceived / (totalBilled || 1)) * 100)}% realization rate
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Outstanding Receivables</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-300">
                    {formatINR(totalOutstanding, true)}
                  </div>
                  <span className="text-[11px] text-slate-300 block">Current PFMS bills</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-rose-300 block">30+ Days Overdue</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-rose-400">
                    {formatINR(overdueAmount, true)}
                  </div>
                  <span className="text-[11px] text-rose-300 font-medium block">{overdueInvoices.length} invoices under follow-up</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: USHA Factory & Supply Chain */}
          {currentSlide === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                      OEM Logistics & Warehouse Hubs
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">Bhiwandi & Gurugram Hubs</span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    USHA International OEM Factory Bridge
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Direct electronic data bridge for OEM Purchase Orders. Automated warehouse stock reservations ensure zero stockouts on mission-critical government deliveries.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('supply-chain')}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-500 transition"
                  >
                    <Boxes className="h-4 w-4" />
                    <span>Manage Inventory & POs</span>
                  </button>
                </div>
              </div>

              {/* Supply Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Warehouse Stock</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-white">
                    {totalStockUnits} Units
                  </div>
                  <span className="text-[11px] text-slate-300 block">{products.length} active machinery SKUs</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reserved for Orders</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-300">
                    {totalReservedUnits} Units
                  </div>
                  <span className="text-[11px] text-slate-300 block">Committed to active state bids</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Factory POs</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-400">
                    1,140 Units
                  </div>
                  <span className="text-[11px] text-slate-300 block">PO #PO-USHA-2026-091 in production</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Low-Stock Priority Alerts</span>
                  <div className="mt-1 text-xl sm:text-2xl font-extrabold text-rose-400">
                    {lowStockProducts.length} Items
                  </div>
                  <span className="text-[11px] text-rose-300 block">Umbrella 95T & Overlock 747D</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Flagship High-Impact Tenders */}
          {currentSlide === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-300 uppercase">
                      Flagship Opportunities
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold">Tenders &gt; ₹1.0 Crore</span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    High-Value State Government Flagship Tenders
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Mega tenders in active bidding and technical qualification stages across Uttar Pradesh, Maharashtra, Karnataka, and Jharkhand.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('ai-tender')}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Run AI Eligibility Check</span>
                  </button>
                </div>
              </div>

              {/* 4 Flagship Contracts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-300 font-bold">GEM/894012</span>
                    <span className="rounded bg-purple-400/20 px-1.5 py-0.2 text-[9px] font-bold text-purple-200">Ready</span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">UPSRLM Mission Shakti</h4>
                  <p className="text-[11px] text-slate-300">2,500 Tailor Deluxe + Toolkits</p>
                  <p className="text-sm font-extrabold text-emerald-400 pt-1">₹1.86 Crores</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">KSWDC/019</span>
                    <span className="rounded bg-emerald-400/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-200">Won & Order</span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">Karnataka Stree Shakti</h4>
                  <p className="text-[11px] text-slate-300">1,200 Umbrella High-Speed Units</p>
                  <p className="text-sm font-extrabold text-emerald-400 pt-1">₹1.64 Crores</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-300 font-bold">DVET/MH/044</span>
                    <span className="rounded bg-rose-400/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-200">3d Left</span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">DVET 75 Govt ITIs</h4>
                  <p className="text-[11px] text-slate-300">450 Computerized Allure DLX</p>
                  <p className="text-sm font-extrabold text-blue-300 pt-1">₹69.30 Lakhs</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-300 font-bold">JSLPS/77</span>
                    <span className="rounded bg-blue-400/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-200">Drafting</span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">Jharkhand Palash Apparel</h4>
                  <p className="text-[11px] text-slate-300">1,250 Umbrella Units</p>
                  <p className="text-sm font-extrabold text-indigo-300 pt-1">₹1.52 Crores</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: GeM Portal Direct & L1 Bidding Command */}
          {currentSlide === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-300 uppercase">
                      GeM Government Portal
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> 4.9 / 5.0 Seller Rating
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    GeM Direct Procurement & L1 Price Leadership
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Direct custom bid participation on Government e-Marketplace (GeM) with automated OEM authorization mapping and reverse-auction competitive pricing.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('tenders')}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Explore GeM Opportunities</span>
                  </button>
                </div>
              </div>

              {/* GeM Portal Telemetry */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Seller Scorecard</span>
                  <div className="mt-1 text-xl font-extrabold text-emerald-400">4.9 / 5.0 ★</div>
                  <span className="text-[11px] text-slate-300 block">100% On-Time Delivery score</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">L1 Price Compliance</span>
                  <div className="mt-1 text-xl font-extrabold text-blue-300">99.4%</div>
                  <span className="text-[11px] text-slate-300 block">Automated BOQ tariff parity</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active GeM Custom Bids</span>
                  <div className="mt-1 text-xl font-extrabold text-purple-300">₹1.42 Cr</div>
                  <span className="text-[11px] text-slate-300 block">5 bids under technical review</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GeM Incident Record</span>
                  <div className="mt-1 text-xl font-extrabold text-emerald-400">0 Flags</div>
                  <span className="text-[11px] text-emerald-300 block font-semibold">100% Clean Audit Status</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Pan-India State Footprint & Rural Missions */}
          {currentSlide === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-purple-300 uppercase">
                      National Reach
                    </span>
                    <span className="text-xs text-purple-300 font-semibold">12 Indian States</span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Pan-India Distribution & Rural Livelihood Footprint
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Supplying authorized USHA sewing machines and vocational toolkits to state departments, SHGs, and vocational polytechnics from Kashmir to Karnataka.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('crm')}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-500 transition"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>View Institutional Clients</span>
                  </button>
                </div>
              </div>

              {/* State Footprint Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Uttar Pradesh</span>
                  <div className="mt-1 text-xl font-extrabold text-white">₹2.44 Crores</div>
                  <span className="text-[11px] text-slate-300 block">UPSRLM & Mission Shakti</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Karnataka</span>
                  <div className="mt-1 text-xl font-extrabold text-white">₹1.64 Crores</div>
                  <span className="text-[11px] text-slate-300 block">KSWDC Stree Shakti Units</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bihar</span>
                  <div className="mt-1 text-xl font-extrabold text-white">₹1.34 Crores</div>
                  <span className="text-[11px] text-slate-300 block">JEEViKA Rural Hubs</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Maharashtra</span>
                  <div className="mt-1 text-xl font-extrabold text-white">₹1.06 Crores</div>
                  <span className="text-[11px] text-slate-300 block">DVET ITI Training Labs</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: Consignment Logistics, Fleets & Real-Time GPS Tracker */}
          {currentSlide === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                      Logistics & Fleets
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Route className="h-3.5 w-3.5" /> 8 Dedicated Fleets En Route
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Consignment Logistics, E-Way Bills & GPS Fleet Tracking
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Direct integration with VRL Logistics, TCI Express, and Safechem with automated E-Way Bill generation, district depot gate passes, and signed Proof of Delivery (POD).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('logistics')}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Shiprocket Logistics Hub</span>
                  </button>
                  <button
                    onClick={() => onNavigate('supply-chain')}
                    className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-semibold text-white transition"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Fleet Dispatches</span>
                  </button>
                </div>
              </div>

              {/* Fleet Telemetry */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GST E-Way Bills</span>
                  <div className="mt-1 text-xl font-extrabold text-emerald-400">100% Active</div>
                  <span className="text-[11px] text-slate-300 block">Zero transit hold / compliance check</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">In-Transit Fleets</span>
                  <div className="mt-1 text-xl font-extrabold text-amber-300">{inTransitOrders.length + readyDispatchOrders.length} Fleets</div>
                  <span className="text-[11px] text-slate-300 block">VRL, TCI & Safechem carriers</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pan-India Transit SLA</span>
                  <div className="mt-1 text-xl font-extrabold text-blue-300">3.2 Days Avg</div>
                  <span className="text-[11px] text-slate-300 block">Factory to district collectorate</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Digital POD Status</span>
                  <div className="mt-1 text-xl font-extrabold text-emerald-400">99.1% Verified</div>
                  <span className="text-[11px] text-slate-300 block">Immediate treasury billing cycle</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: PM-Vishwakarma & Vocational Skill Missions */}
          {currentSlide === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-rose-300 uppercase">
                      Social Impact & Livelihood
                    </span>
                    <span className="text-xs text-rose-300 font-semibold flex items-center gap-1">
                      <HeartHandshake className="h-3.5 w-3.5" /> 14,250+ Beneficiaries
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    PM-Vishwakarma & Women SHG Tailoring Skill Missions
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Empowering traditional craftsmen, women self-help groups, and vocational students with ISI-standard USHA sewing machines and industrial tooling kits.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('crm')}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 transition"
                  >
                    <Users className="h-4 w-4" />
                    <span>Review Beneficiary Records</span>
                  </button>
                </div>
              </div>

              {/* Beneficiary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Artisan Toolkits Distributed</span>
                  <div className="mt-1 text-xl font-extrabold text-rose-300">14,250+ Kits</div>
                  <span className="text-[11px] text-slate-300 block">PM-Vishwakarma certified</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Districts Covered</span>
                  <div className="mt-1 text-xl font-extrabold text-white">48 Districts</div>
                  <span className="text-[11px] text-slate-300 block">Tier 2 & Tier 3 rural centers</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">On-Site Demonstration</span>
                  <div className="mt-1 text-xl font-extrabold text-emerald-400">100% Complete</div>
                  <span className="text-[11px] text-slate-300 block">Hands-on training provided</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Upcoming Handover Camps</span>
                  <div className="mt-1 text-xl font-extrabold text-amber-300">4 Camps</div>
                  <span className="text-[11px] text-slate-300 block">Varanasi, Gorakhpur, Hubballi, Ranchi</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: USHA Authorized On-Site Warranty & SLA Service Network */}
          {currentSlide === 8 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-teal-300 uppercase">
                      Quality & Service Guarantee
                    </span>
                    <span className="text-xs text-teal-300 font-semibold flex items-center gap-1">
                      <Wrench className="h-3.5 w-3.5" /> 1-Year Comprehensive Warranty
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    USHA Authorized On-Site Warranty & SLA Service Network
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Nationwide dedicated technician network providing 24-hour on-site maintenance, genuine USHA OEM spares replacement, and quarterly preventive checkups.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('tasks')}
                    className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-500 transition"
                  >
                    <Wrench className="h-4 w-4" />
                    <span>Manage Support & Service SLA</span>
                  </button>
                </div>
              </div>

              {/* Service SLA Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Warranty Coverage</span>
                  <div className="mt-1 text-xl font-extrabold text-teal-300">12 Months</div>
                  <span className="text-[11px] text-slate-300 block">Full on-site parts & labor</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">24-Hr SLA Resolution</span>
                  <div className="mt-1 text-xl font-extrabold text-emerald-400">98.4%</div>
                  <span className="text-[11px] text-slate-300 block">Average repair time &lt; 18 hours</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Field Service Engineers</span>
                  <div className="mt-1 text-xl font-extrabold text-white">42 Engineers</div>
                  <span className="text-[11px] text-slate-300 block">USHA certified service team</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Genuine Parts Buffer</span>
                  <div className="mt-1 text-xl font-extrabold text-teal-300">100% Stocked</div>
                  <span className="text-[11px] text-slate-300 block">Bhiwandi & Gurugram central hubs</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 9: Statutory Compliance & Master Documents Vault */}
          {currentSlide === 9 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-300 uppercase">
                      Risk & Governance
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> 100% Audit Verified
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Verified Statutory Compliance & Zero Disqualification
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Zero technical rejections on state and GeM portals. Real-time expiry monitoring for USHA OEM MAF, CA UDIN turnover certificates, and Bank Guarantees.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => onNavigate('documents')}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-500 transition"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Open Documents Vault</span>
                  </button>
                </div>
              </div>

              {/* Statutory Safeguards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">OEM Agreement</span>
                  <div className="mt-1 text-base font-bold text-white">USHA Corporate</div>
                  <span className="text-[11px] text-emerald-400 block font-semibold">Valid till Mar 2027</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Solvency</span>
                  <div className="mt-1 text-base font-bold text-white">₹2.50 Crores</div>
                  <span className="text-[11px] text-slate-300 block">HDFC Bank Scheduled Cert</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GST Compliance</span>
                  <div className="mt-1 text-base font-bold text-white">07AAACG8899K1Z4</div>
                  <span className="text-[11px] text-emerald-400 block font-semibold">GSTR-3B Nil Arrears</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">MSME Udyam</span>
                  <div className="mt-1 text-base font-bold text-white">Medium Enterprise</div>
                  <span className="text-[11px] text-slate-300 block">UDYAM-DL-03-0044812</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Slider Dots / Section Navigation Bar */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 space-y-2">
            {/* Mobile Touch Pagination Dots */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 py-0.5">
              {slideTitles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/30'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Scrollable Pill Tabs for Quick Section Jump */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1 sm:mx-0 sm:px-0 flex-1">
                {slideTitles.map((title, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`rounded-lg px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap shrink-0 transition ${
                      currentSlide === idx
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {idx + 1}. {title}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 hidden lg:block shrink-0">
                Swipe or use arrows to navigate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PRIMARY KPI SUMMARY GRID (4 RESPONSIVE TILES) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Tenders Card */}
        <div
          onClick={() => onNavigate('tenders')}
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tenders</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{activeTenders.length}</span>
            <span className="text-xs font-medium text-slate-500">
              ({formatINR(totalTenderPipelineValue, true)} pipe)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
            <span className="text-amber-700 font-medium">{closingSoonTenders.length} closing &le; 7 days</span>
            <span className="text-blue-600 font-semibold flex items-center">
              View <ArrowRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Win Rate & Won Bids Card */}
        <div
          onClick={() => onNavigate('tenders')}
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tender Win Rate</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{winRate}%</span>
            <span className="text-xs font-semibold text-emerald-700">
              {wonTenders.length} Won ({lostTenders.length} Lost)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
            <span>Won Value: <strong className="text-slate-800">{formatINR(totalWonValue, true)}</strong></span>
            <span className="text-emerald-600 font-semibold flex items-center">
              Funnel <ArrowRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Active Orders & Supply Chain Card */}
        <div
          onClick={() => onNavigate('orders')}
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-indigo-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Orders</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{activeOrders.length}</span>
            <span className="text-xs font-medium text-slate-500">
              ({formatINR(totalOrderValue, true)} book)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
            <span>{awaitingProcurementOrders.length} Proc · {inTransitOrders.length} Transit</span>
            <span className="text-indigo-600 font-semibold flex items-center">
              Fulfill <ArrowRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Receivables & Cashflow Card */}
        <div
          onClick={() => onNavigate('accounts')}
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-amber-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Treasury Receivables</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {formatINR(totalOutstanding, true)}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              +{formatINR(totalReceived, true)} rec'd
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
            <span className={overdueAmount > 0 ? 'text-rose-700 font-semibold' : 'text-slate-500'}>
              {formatINR(overdueAmount, true)} overdue
            </span>
            <span className="text-amber-600 font-semibold flex items-center">
              Invoices <ArrowRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONNECTED SUPPLY-CHAIN VELOCITY PIPELINE */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Connected Supply-Chain Velocity
            </h3>
            <p className="text-xs text-slate-500">
              Live status across USHA OEM procurement, warehouse packaging, dispatch transit & govt delivery
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> All systems automated
            </span>
          </div>
        </div>

        {/* Workflow Visual Steps (Responsive Grid with clean wrap on mobile) */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            onClick={() => onNavigate('tenders')}
            className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 hover:bg-blue-50 cursor-pointer transition"
          >
            <div className="text-[10px] font-bold uppercase text-blue-700">1. Tenders Ready / Won</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900">{wonTenders.length} Won</div>
            <p className="text-[11px] text-slate-500 mt-1">{submittedTenders.length} Under Evaluation</p>
          </div>

          <div
            onClick={() => onNavigate('orders')}
            className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 hover:bg-indigo-50 cursor-pointer transition"
          >
            <div className="text-[10px] font-bold uppercase text-indigo-700">2. Orders Created</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900">{orders.length} Total</div>
            <p className="text-[11px] text-slate-500 mt-1">{activeOrders.length} In Execution</p>
          </div>

          <div
            onClick={() => onNavigate('supply-chain')}
            className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 hover:bg-amber-50 cursor-pointer transition"
          >
            <div className="text-[10px] font-bold uppercase text-amber-700">3. Procurement & Stock</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900">
              {awaitingProcurementOrders.length} Pending PO
            </div>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              {lowStockProducts.length} Low-Stock alerts
            </p>
          </div>

          <div
            onClick={() => onNavigate('supply-chain')}
            className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 hover:bg-purple-50 cursor-pointer transition"
          >
            <div className="text-[10px] font-bold uppercase text-purple-700">4. Dispatch & Fleet</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900">
              {readyDispatchOrders.length} Packed
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{inTransitOrders.length} In Transit (VRL/TCI)</p>
          </div>

          <div
            onClick={() => onNavigate('accounts')}
            className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 hover:bg-emerald-50 cursor-pointer transition col-span-2 sm:col-span-1"
          >
            <div className="text-[10px] font-bold uppercase text-emerald-700">5. Treasury & Invoices</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900">
              {invoices.length} Invoiced
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{deliveredOrders.length} Delivered</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TWO COLUMN OPERATIONAL DETAILS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Urgent Deadlines & Low Stock Alert */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tenders Closing Soon Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Tenders Approaching Deadline (&le; 7 Days)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tenders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View Pipeline &rarr;
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100 overflow-x-auto">
              {closingSoonTenders.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No active bids expiring in the next 7 days.
                </div>
              ) : (
                closingSoonTenders.slice(0, 4).map((tender) => {
                  const days = getDaysRemaining(tender.submissionDeadline);
                  return (
                    <div
                      key={tender.id}
                      onClick={() => onNavigate('tenders', tender.id)}
                      className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-blue-700">{tender.tenderNumber}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                            {tender.tenderSource}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                          {tender.organization}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {tender.product} (Qty: {tender.quantity})
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            days.days <= 3
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {days.label}
                        </span>
                        <div className="text-xs font-bold text-slate-900 mt-1">
                          {formatINR(tender.estimatedValue, true)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Warehouse Low Stock & Procurement Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Critical Warehouse & Inventory Alerts
                </h3>
              </div>
              <button
                onClick={() => onNavigate('supply-chain')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Manage Stock &rarr;
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products
                .filter((p) => p.stockStatus === 'Low Stock' || p.quantityAvailable <= p.minimumStock)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-rose-700">{prod.sku}</span>
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                        Low Stock
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{prod.name}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <span>In Stock: <strong className="text-slate-900">{prod.quantityAvailable}</strong></span>
                      <span>Reserved: <strong className="text-amber-800">{prod.reservedQuantity}</strong></span>
                      <span>Min: <strong className="text-slate-500">{prod.minimumStock}</strong></span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate('supply-chain', prod.id)}
                        className="w-full rounded-lg bg-rose-600 py-1 text-center text-[11px] font-bold text-white hover:bg-rose-700"
                      >
                        Issue Procurement PO &rarr;
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Overdue Tasks & Department Health */}
        <div className="space-y-6">
          {/* Overdue & Pending Tasks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Urgent Employee Tasks
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                All Tasks ({pendingTasks.length}) &rarr;
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100 space-y-2">
              {pendingTasks.slice(0, 4).map((tsk) => (
                <div key={tsk.id} className="pt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        tsk.status === 'Overdue' ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {tsk.status === 'Overdue' ? '⚠️ Overdue' : `Due: ${tsk.dueDate}`}
                    </span>
                    <span className="text-slate-400">{tsk.department}</span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-800 mt-1 line-clamp-2">
                    {tsk.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned: <strong className="text-slate-700">{tsk.assignedEmployeeName}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance Matrix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Department Operations Matrix
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Tender Bidding (Win Rate)</span>
                  <span className="font-bold text-slate-900">{winRate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${winRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Supply Chain Fulfillment</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Accounts Realization (Payment Collections)</span>
                  <span className="font-bold text-slate-900">
                    {Math.round((totalReceived / (totalBilled || 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.round((totalReceived / (totalBilled || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Institutional CRM Retention</span>
                  <span className="font-bold text-slate-900">96%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
