import React, { useState } from 'react';
import { X, FileSpreadsheet, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, TenderStatus } from '../../types';

interface NewTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTenderModal: React.FC<NewTenderModalProps> = ({ isOpen, onClose }) => {
  const { addTender, customers, employees, products } = useApp();

  const [tenderNumber, setTenderNumber] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('Rural Development');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('');
  const [tenderSource, setTenderSource] = useState<'GeM' | 'CPP Portal' | 'State e-Procurement' | 'Direct Institutional'>('GeM');
  const [tenderPortal, setTenderPortal] = useState('gem.gov.in');
  const [tenderUrl, setTenderUrl] = useState('');
  const [product, setProduct] = useState('USHA Tailor Deluxe + Geo Master Toolkit');
  const [quantity, setQuantity] = useState(500);
  const [estimatedValue, setEstimatedValue] = useState(3725000);
  const [emdAmount, setEmdAmount] = useState(74500);
  const [tenderFee, setTenderFee] = useState(2000);
  const [submissionDeadline, setSubmissionDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [openingDate, setOpeningDate] = useState(
    new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('EMP-003');
  const [priority, setPriority] = useState<Priority>('High');
  const [status, setStatus] = useState<TenderStatus>('New');
  const [eligibilityRequirements, setEligibilityRequirements] = useState(
    'Average turnover > ₹2.5 Cr; OEM Authorization from USHA International; 3 years govt supply track record.'
  );
  const [technicalRequirements, setTechnicalRequirements] = useState(
    'IS:1610 certified sewing machine with stand, table, and 32-piece master vocational toolkit.'
  );
  const [financialRequirements, setFinancialRequirements] = useState(
    'EMD 2% via Bank Guarantee; CA certified turnover statement.'
  );
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenderNumber || !title || !organization) return;

    const assignedEmp = employees.find((e) => e.id === assignedEmployeeId);

    addTender({
      tenderNumber,
      title,
      department,
      organization,
      state,
      district: district || 'Central',
      tenderSource,
      tenderPortal,
      tenderUrl: tenderUrl || `https://${tenderPortal}`,
      product,
      quantity: Number(quantity),
      estimatedValue: Number(estimatedValue),
      emdAmount: Number(emdAmount),
      tenderFee: Number(tenderFee),
      issueDate: new Date().toISOString().slice(0, 10),
      submissionDeadline: submissionDeadline || new Date().toISOString(),
      openingDate: openingDate || new Date().toISOString(),
      eligibilityRequirements,
      technicalRequirements,
      financialRequirements,
      assignedEmployeeId,
      assignedEmployeeName: assignedEmp?.name || 'Amit Verma',
      priority,
      status,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Tender Opportunity</h3>
              <p className="text-xs text-slate-500">
                Register a new tender opportunity into the Geo Digital bidding pipeline
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tender Number / Bid ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. GEM/2026/B/901284 or NIT-088"
                value={tenderNumber}
                onChange={(e) => setTenderNumber(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tender Portal *</label>
              <div className="flex gap-2">
                <select
                  value={tenderSource}
                  onChange={(e) => {
                    const src = e.target.value as any;
                    setTenderSource(src);
                    setTenderPortal(
                      src === 'GeM'
                        ? 'gem.gov.in'
                        : src === 'CPP Portal'
                        ? 'eprocure.gov.in'
                        : 'state-tenders.gov.in'
                    );
                  }}
                  className="rounded-md border border-slate-300 p-2 text-xs"
                >
                  <option value="GeM">GeM Portal</option>
                  <option value="CPP Portal">CPP Portal</option>
                  <option value="State e-Procurement">State e-Procurement</option>
                  <option value="Direct Institutional">Direct Institutional</option>
                </select>
                <input
                  type="text"
                  placeholder="Portal URL"
                  value={tenderPortal}
                  onChange={(e) => setTenderPortal(e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 p-2 text-xs"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Tender Title / Work Description *</label>
              <input
                type="text"
                required
                placeholder="Supply of USHA Sewing Machines & Toolkits for..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Purchasing Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. UP State Rural Livelihoods Mission"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target District(s)</label>
              <input
                type="text"
                placeholder="e.g. Lucknow, Kanpur, All Districts"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Product Model</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Quantity (Units)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  setQuantity(q);
                  setEstimatedValue(q * 7450);
                  setEmdAmount(Math.round(q * 7450 * 0.02));
                }}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Estimated Tender Value (₹)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">EMD Value (₹)</label>
              <input
                type="number"
                value={emdAmount}
                onChange={(e) => setEmdAmount(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Submission Deadline *</label>
              <input
                type="datetime-local"
                required
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assigned Tender Specialist</label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              >
                {employees
                  .filter((emp) => emp.department === 'Tender' || emp.department === 'Management')
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-slate-300 p-2 text-xs"
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Eligible">Eligible</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready for Submission">Ready for Submission</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Internal Notes & Strategy</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Check USHA Lucknow regional stock availability..."
              className="w-full rounded-md border border-slate-300 p-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              Create Tender Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
