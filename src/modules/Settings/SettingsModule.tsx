import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Database,
  Link,
  Shield,
  Bell,
  RefreshCw,
  CheckCircle2,
  Download,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsModule: React.FC = () => {
  const { activeRole } = useApp();
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleBackupExport = () => {
    const backup = {
      tenders: localStorage.getItem('gd_tenders'),
      orders: localStorage.getItem('gd_orders'),
      products: localStorage.getItem('gd_products'),
      invoices: localStorage.getItem('gd_invoices'),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoDigital_OS_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Integrations</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise configuration, government portal endpoints, data backups & security controls
        </p>
      </div>

      {/* Company Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-xs">
            GD
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Geo Digital Private Limited</h2>
            <p className="text-xs text-slate-500">
              Authorized Institutional Partner for USHA International Ltd · Sewing & Vocational Toolkits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Principal Place of Business</span>
            <p className="font-semibold text-slate-800">Plot 42, Udyog Vihar Phase IV, Gurugram, Haryana - 122016</p>
            <p className="text-slate-500">Central Logistics Hub: Bhiwandi Complex, Mumbai, Maharashtra</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Taxation & Compliance</span>
            <p className="font-semibold text-slate-800">GSTIN: 07AAACG8899K1Z4</p>
            <p className="text-slate-500">MSME Udyam: UDYAM-DL-03-0044812 · ISO 9001:2015</p>
          </div>
        </div>
      </div>

      {/* Future API Integrations Architecture */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Enterprise Integration Gateways (Ready for Production Backend)
        </h3>
        <p className="text-xs text-slate-500">
          The application service layer is designed with unified repository adapters. Connect API tokens below to sync with live government systems.
        </p>

        <div className="space-y-3 text-xs">
          {[
            {
              title: 'Government e-Marketplace (GeM API)',
              desc: 'Bi-directional bid synchronization, order punch-out, and auto-ingest of GeM contract orders.',
              status: 'Configured (Staging)',
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              title: 'Central Public Procurement (CPP Portal eProcure)',
              desc: 'Scrapes and monitors State and Central tender corrigendums, technical criteria, and bid opening results.',
              status: 'Connected',
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              title: 'Public Financial Management System (PFMS / Treasury)',
              desc: 'Real-time reconciliation of state treasury bill processing, token generations, and RTGS credit confirmations.',
              status: 'Ready for Token',
              color: 'text-amber-800 bg-amber-50 border-amber-200',
            },
            {
              title: 'USHA International Ltd OEM EDI Gateway',
              desc: 'Direct electronic data interchange for Purchase Order release, dispatch schedule, and factory inventory reservations.',
              status: 'Connected (Live EDI)',
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              title: 'WhatsApp Business API & Logistics Tracking',
              desc: 'Dispatches automated consignment tracking links with LR number and expected delivery dates to client nodal officers.',
              status: 'Webhook Ready',
              color: 'text-purple-700 bg-purple-50 border-purple-200',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-slate-500 mt-0.5 text-[11px]">{item.desc}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shrink-0 ml-3 ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Database & Backup Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Data Management & State Reset
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={handleBackupExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Export Complete JSON Database</span>
          </button>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-100"
            >
              <RefreshCw className="h-4 w-4 text-rose-600" />
              <span>Reset to Clean Demo State</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-rose-700 font-bold">Confirm factory reset?</span>
              <button
                onClick={handleResetData}
                className="rounded-lg bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-700"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="rounded-lg border px-3 py-1.5 font-semibold text-slate-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
