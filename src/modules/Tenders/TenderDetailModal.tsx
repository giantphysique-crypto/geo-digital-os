import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Calendar,
  IndianRupee,
  Shield,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  Upload,
  UserCheck,
  Check,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tender, TenderStatus, TenderDocumentItem } from '../../types';
import { formatINR, formatDate, getDaysRemaining } from '../../utils/formatters';

interface TenderDetailModalProps {
  tenderId: string;
  onClose: () => void;
  onNavigateOrder?: (orderId: string) => void;
}

export const TenderDetailModal: React.FC<TenderDetailModalProps> = ({
  tenderId,
  onClose,
  onNavigateOrder,
}) => {
  const { tenders, updateTenderStatus, updateTender, orders, tasks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'tasks' | 'history'>('overview');
  const [statusConfirmModal, setStatusConfirmModal] = useState<TenderStatus | null>(null);

  const tender = tenders.find((t) => t.id === tenderId);
  if (!tender) return null;

  const deadline = getDaysRemaining(tender.submissionDeadline);
  const linkedOrder = tender.orderId ? orders.find((o) => o.id === tender.orderId) : null;
  const relatedTasks = tasks.filter((t) => t.relatedId === tender.id);

  const statuses: TenderStatus[] = [
    'New',
    'Under Review',
    'Eligible',
    'Not Eligible',
    'Preparing',
    'Ready for Submission',
    'Submitted',
    'Under Evaluation',
    'Won',
    'Lost',
    'Cancelled',
  ];

  const handleStatusSelect = (newStatus: TenderStatus) => {
    if (newStatus === 'Won') {
      setStatusConfirmModal('Won');
    } else {
      updateTenderStatus(tender.id, newStatus);
    }
  };

  const handleConfirmWon = () => {
    updateTenderStatus(tender.id, 'Won', 'Awarded to Geo Digital');
    setStatusConfirmModal(null);
  };

  const toggleDocumentStatus = (docId: string) => {
    const updatedDocs = (tender.documentChecklist || []).map((doc) => {
      if (doc.id === docId) {
        const nextStatus: TenderDocumentItem['verificationStatus'] =
          doc.verificationStatus === 'Verified' ? 'Missing' : 'Verified';
        return {
          ...doc,
          verificationStatus: nextStatus,
          isAvailable: nextStatus === 'Verified',
        };
      }
      return doc;
    });

    updateTender({ ...tender, documentChecklist: updatedDocs });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-xs font-bold text-blue-700">{tender.tenderNumber}</span>
              <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                {tender.tenderSource}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tender.status === 'Won'
                    ? 'bg-emerald-100 text-emerald-800'
                    : tender.status === 'Lost'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tender.status}
              </span>
            </div>
            <h3 className="mt-1 text-sm sm:text-base font-bold text-slate-900 line-clamp-1">{tender.title}</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
              {tender.organization} · {tender.state}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Status Change Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 sm:px-2.5 py-1 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={tender.status}
                onChange={(e) => handleStatusSelect(e.target.value as TenderStatus)}
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

        {/* Won Banner with Link to Auto-Created Order */}
        {tender.status === 'Won' && tender.orderId && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Tender Won!</strong> Automated business flow generated Project Order{' '}
                <strong>#{linkedOrder?.orderNumber || tender.orderId}</strong>.
              </span>
            </div>
            {onNavigateOrder && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateOrder(tender.orderId!);
                }}
                className="flex items-center gap-1 font-bold text-emerald-800 hover:underline shrink-0 self-end sm:self-auto"
              >
                <span>View Order Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Tab Navigation (with horizontal scroll on mobile) */}
        <div className="flex border-b border-slate-200 bg-white px-3 sm:px-6 overflow-x-auto">
          {(['overview', 'documents', 'tasks', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold capitalize border-b-2 transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'documents'
                ? `Checklist (${tender.documentChecklist?.length || 0})`
                : tab === 'tasks'
                ? `Tasks (${relatedTasks.length})`
                : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs">
              {/* Financial & Deadline Highlight Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Estimated Value</span>
                  <div className="mt-1 text-base font-extrabold text-slate-900">
                    {formatINR(tender.estimatedValue)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    ~₹{Math.round(tender.estimatedValue / (tender.quantity || 1)).toLocaleString('en-IN')}/unit
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">EMD Required</span>
                  <div className="mt-1 text-base font-extrabold text-slate-900">
                    {formatINR(tender.emdAmount)}
                  </div>
                  <span className="text-[10px] text-slate-500">Fee: ₹{tender.tenderFee || '0'}</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Quantity & Product</span>
                  <div className="mt-1 text-base font-extrabold text-slate-900">
                    {tender.quantity} Units
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">{tender.product}</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Deadline Countdown</span>
                  <div
                    className={`mt-1 text-base font-extrabold ${
                      deadline.isOverdue
                        ? 'text-rose-600'
                        : deadline.days <= 3
                        ? 'text-amber-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {deadline.label}
                  </div>
                  <span className="text-[10px] text-slate-500">{formatDate(tender.submissionDeadline)}</span>
                </div>
              </div>

              {/* Specifications & Criteria Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-700">
                    Eligibility & Financial Requirements
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{tender.eligibilityRequirements}</p>
                  <div className="pt-1 text-slate-500">
                    <strong>Financial Criteria: </strong>
                    {tender.financialRequirements}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-indigo-700">
                    Technical Specifications
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{tender.technicalRequirements}</p>
                  <div className="pt-1 text-slate-500">
                    <strong>Assigned Bidder: </strong>
                    <span className="font-semibold text-slate-800">{tender.assignedEmployeeName}</span>
                  </div>
                </div>
              </div>

              {/* Portal & Official Link */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Tender Portal Link</span>
                  <p className="text-slate-500">{tender.tenderUrl}</p>
                </div>
                <a
                  href={tender.tenderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Internal Notes */}
              {tender.notes && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">Internal Strategy Notes</span>
                  <p className="mt-1 text-amber-900">{tender.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">
                  Ensure all statutory, financial, and USHA OEM authorization documents are uploaded and verified prior to bid submission.
                </p>
                <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                  {tender.documentChecklist?.filter((d) => d.verificationStatus === 'Verified').length} /{' '}
                  {tender.documentChecklist?.length} Verified
                </span>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {(tender.documentChecklist || []).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3.5 hover:bg-slate-50">
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{doc.title}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                          {doc.category}
                        </span>
                        {doc.isRequired && (
                          <span className="text-[10px] font-bold text-rose-600 uppercase">*Required</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                        <span>Person: {doc.responsiblePerson}</span>
                        {doc.expiryDate && <span>Expires: {doc.expiryDate}</span>}
                        {doc.uploadedFile && (
                          <span className="text-blue-600 font-medium">📎 {doc.uploadedFile}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDocumentStatus(doc.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                        doc.verificationStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {doc.verificationStatus === 'Verified' ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Mark Verified</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3 text-xs">
              {relatedTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No pending tasks linked to this tender.
                </div>
              ) : (
                relatedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{t.title}</span>
                      <p className="text-[11px] text-slate-500">
                        Assigned: {t.assignedEmployeeName} · Due: {t.dueDate}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              {(tender.history || []).map((h) => (
                <div key={h.id} className="flex items-start gap-3 border-l-2 border-blue-500 pl-3 py-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{h.user}</span>
                      <span className="text-[11px] text-slate-400">{h.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{h.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Modal when Marking as WON */}
        {statusConfirmModal === 'Won' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Mark Tender as WON?</h4>
                  <p className="text-xs text-slate-500">Trigger Connected Business Pipeline</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Marking tender <strong>{tender.tenderNumber}</strong> as WON will automatically:
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <li>Create Project Order for {tender.quantity} units ({tender.product})</li>
                <li>Transfer customer and department details to CRM</li>
                <li>Check warehouse inventory and reserve available stock</li>
                <li>Auto-generate Procurement PO if warehouse inventory is insufficient</li>
                <li>Assign fulfillment tasks to Supply Chain & Accounts teams</li>
                <li>Update management win rate & revenue reports</li>
              </ul>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setStatusConfirmModal(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmWon}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Confirm & Execute Workflow
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
          <span>Tender ID: <strong className="font-mono text-slate-800">{tender.id}</strong></span>
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
