import React, { useState } from 'react';
import { X, IndianRupee, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, PaymentRecord } from '../../types';
import { formatINR } from '../../utils/formatters';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInvoiceId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultInvoiceId,
}) => {
  const { invoices, recordPayment } = useApp();

  const [selectedInvId, setSelectedInvId] = useState<string>(
    defaultInvoiceId || invoices[0]?.id || ''
  );
  const targetInvoice = invoices.find((i) => i.id === selectedInvId) || invoices[0];

  const [amount, setAmount] = useState<number>(targetInvoice?.outstandingAmount || 500000);
  const [paymentMode, setPaymentMode] = useState<PaymentRecord['paymentMode']>('PFMS Govt Treasury');
  const [referenceNumber, setReferenceNumber] = useState(`PFMS/UP/2026/${Math.floor(100000 + Math.random() * 900000)}`);
  const [bankName, setBankName] = useState('State Bank of India (Govt Business Branch)');
  const [receivedBy, setReceivedBy] = useState('Neelam Joshi (Sr Accounts Officer)');
  const [notes, setNotes] = useState('Payment realization credited to Geo Digital HDFC Account');

  if (!isOpen || !targetInvoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    recordPayment({
      invoiceId: targetInvoice.id,
      invoiceNumber: targetInvoice.invoiceNumber,
      customerId: targetInvoice.customerId,
      customerName: targetInvoice.customerName,
      amount: Number(amount),
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode,
      referenceNumber,
      bankName,
      receivedBy,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
              ₹
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Treasury / Client Payment</h3>
              <p className="text-xs text-slate-500">Credit payment against commercial invoice</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Invoice</label>
            <select
              value={selectedInvId}
              onChange={(e) => {
                setSelectedInvId(e.target.value);
                const inv = invoices.find((i) => i.id === e.target.value);
                if (inv) setAmount(inv.outstandingAmount);
              }}
              className="w-full rounded-md border border-slate-300 p-2"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.customerName} (Bal: {formatINR(inv.outstandingAmount)})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice Total:</span>
              <span className="font-bold text-slate-900">{formatINR(targetInvoice.invoiceValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Already Received:</span>
              <span className="font-bold text-emerald-700">{formatINR(targetInvoice.amountReceived)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-semibold text-slate-700">Outstanding Balance:</span>
              <span className="font-extrabold text-amber-800">{formatINR(targetInvoice.outstandingAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount Received (₹) *</label>
              <input
                type="number"
                required
                max={targetInvoice.outstandingAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-2 font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full rounded-md border border-slate-300 p-2"
              >
                <option value="PFMS Govt Treasury">PFMS Govt Treasury</option>
                <option value="RTGS">RTGS</option>
                <option value="NEFT">NEFT</option>
                <option value="DD">Demand Draft (DD)</option>
                <option value="Cheque">Govt Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / UTR / Token #</label>
            <input
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-2 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Verified By</label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700 shadow-sm"
            >
              Record Payment Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
