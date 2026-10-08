import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ShieldAlert,
  ListTodo,
  FileCheck,
  ArrowRight,
  Info,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const AITenderAssistantModule: React.FC<{ onNavigateTenders: () => void }> = ({
  onNavigateTenders,
}) => {
  const { addTender, addTask } = useApp();

  const [documentText, setDocumentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAction, setActiveAction] = useState<string>('Analyze Tender');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Realistic sample tenders for 1-click test
  const sampleTenders = [
    {
      label: 'Sample 1: UP SRLM 2,500 Sewing Machines NIT',
      text: `GOVERNMENT OF UTTAR PRADESH
DEPARTMENT OF RURAL DEVELOPMENT
UTTAR PRADESH STATE RURAL LIVELIHOODS MISSION (UPSRLM)
Notice Inviting Tender (NIT) Ref No: GEM/2026/B/894012
Date of Issue: 10 September 2026

1. SCOPE OF WORK:
Supply, testing and door-step distribution of 2,500 Units of heavy-duty Domestic / Semi-Industrial Straight Stitch Sewing Machines complete with cast iron stand, wooden table, foot drive assembly, and 32-piece master vocational tailoring toolkit for Self Help Groups under Mission Shakti across 15 districts of Uttar Pradesh.

2. ESTIMATED CONTRACT VALUE:
Estimated Contract Value: ₹1,86,25,000/- (Rupees One Crore Eighty Six Lakhs Twenty Five Thousand only).
Earnest Money Deposit (EMD): ₹3,72,500/- (2% of tender value) through Bank Guarantee in favour of Mission Director UPSRLM or e-Challan on GeM. Tender Fee: ₹5,000/-.

3. CRITICAL DATES:
Bid Submission Deadline: 12 October 2026 at 15:00 Hours IST.
Technical Bid Opening: 12 October 2026 at 16:00 Hours IST.

4. ELIGIBILITY CRITERIA:
- The bidder must be an OEM or Authorized Dealer/Partner holding valid Manufacturer Authorization Form (MAF) from USHA International Ltd.
- Average annual turnover of the bidder during the last 3 financial years (FY 2023-24, FY 2024-25, FY 2025-26) must not be less than ₹3.00 Crores certified by practicing Chartered Accountant with UDIN.
- Minimum 3 years experience in supply of vocational tailoring equipment to State/Central Government agencies.

5. TECHNICAL SPECIFICATIONS:
- Machine must strictly conform to IS:1610 / IS:1611 Bureau of Indian Standards (BIS marked).
- High-grade cast iron head with link type thread take-up lever, auto tripping bobbin winder.
- Vocational toolkit must include 10" brass shears, measuring tape, 24 bobbins, drafting curves in lockable metal container.

6. STATUTORY DOCUMENTS:
- GST Registration Certificate and latest GSTR-3B filing.
- PAN Card & MSME Udyam Registration Certificate.
- Solvency Certificate of minimum ₹1.00 Crore from Scheduled Commercial Bank.
- Non-blacklisting affidavit on ₹100 non-judicial stamp paper.

7. DELIVERY SCHEDULE & PENALTIES:
Complete consignment must be delivered within 30 days from Letter of Acceptance. Liquidated damages of 0.5% per week subject to maximum 10% for delay.`,
    },
    {
      label: 'Sample 2: Maharashtra DVET 450 Computerized Machines RFP',
      text: `GOVERNMENT OF MAHARASHTRA
DIRECTORATE OF VOCATIONAL EDUCATION & TRAINING (DVET)
Tender Notice No: DVET/MH/SEW-IT/2026/044
e-Procurement Portal: mahatenders.gov.in

Tender for supply of 450 Units Computerized Automatic Zigzag Sewing Machines (USHA Janome Model Allure DLX or equivalent approved) for modernization of 75 Government Industrial Training Institutes (ITIs) in Maharashtra.
Estimated Value: ₹69,30,000. EMD: ₹1,38,600.
Submission Closing: 08 October 2026 at 17:00 Hrs.
Mandatory Requirements:
- Valid USHA Janome OEM Authorization Certificate.
- On-site training of ITI craft instructors for 2 days.
- Minimum 2 years on-site comprehensive warranty.`,
    },
    {
      label: 'Sample 3: MP Tribal Affairs 1,500 Units Tender',
      text: `TRIBAL AFFAIRS DEPARTMENT, GOVT OF MADHYA PRADESH
Tender Ref: MP-TRIBAL-VOC/2026/112
Portal: mptenders.gov.in
Supply of 1,500 Sets of Vocational Sewing Units with Electric Motors for tribal ashram schools in 12 districts.
Estimated Budget: ₹1,33,50,000/-. EMD: ₹2,67,000/-.
Closing Date: 06 October 2026 at 15:00 Hrs.
Delivery across interior blocks of Mandla, Dindori, Jhabua and Alirajpur within 45 days.`,
    },
  ];

  const handleRunAction = async (action: string) => {
    if (!documentText.trim()) return;

    setActiveAction(action);
    setIsAnalyzing(true);
    setSaveSuccessMessage(null);

    try {
      const response = await fetch('/api/ai/tender-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          actionType: action,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error('Failed to analyze:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAsTender = () => {
    if (!analysisResult) return;

    const id = addTender({
      tenderNumber: analysisResult.tenderNumber || `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`,
      title: analysisResult.summary?.slice(0, 80) || `Supply of ${analysisResult.products || 'USHA Machines'}`,
      department: 'Rural Development / Vocational Training',
      organization: analysisResult.organization || 'Government Department',
      state: analysisResult.location?.includes('Pradesh') ? 'Uttar Pradesh' : 'Maharashtra',
      district: 'Central District',
      tenderSource: 'GeM',
      tenderPortal: 'gem.gov.in',
      tenderUrl: 'https://gem.gov.in',
      product: analysisResult.products || 'USHA Tailor Deluxe',
      quantity: Number(analysisResult.quantity) || 500,
      estimatedValue: Number(analysisResult.estimatedValue) || 3725000,
      emdAmount: Number(analysisResult.emdAmount) || 74500,
      tenderFee: Number(analysisResult.tenderFee) || 2000,
      issueDate: new Date().toISOString().slice(0, 10),
      submissionDeadline: analysisResult.submissionDeadline || new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
      openingDate: analysisResult.openingDate || new Date(Date.now() + 11 * 24 * 3600 * 1000).toISOString(),
      eligibilityRequirements: Array.isArray(analysisResult.eligibilityCriteria)
        ? analysisResult.eligibilityCriteria.join('; ')
        : String(analysisResult.eligibilityCriteria || ''),
      technicalRequirements: Array.isArray(analysisResult.technicalRequirements)
        ? analysisResult.technicalRequirements.join('; ')
        : String(analysisResult.technicalRequirements || ''),
      financialRequirements: Array.isArray(analysisResult.financialRequirements)
        ? analysisResult.financialRequirements.join('; ')
        : String(analysisResult.financialRequirements || ''),
      assignedEmployeeId: 'EMP-003',
      assignedEmployeeName: 'Amit Verma',
      priority: 'High',
      status: 'Under Review',
      notes: `Extracted via AI Tender Assistant. Summary: ${analysisResult.summary}`,
    });

    setSaveSuccessMessage(`Tender record #${analysisResult.tenderNumber} created and added to bidding pipeline!`);
  };

  const handleCreateAITasks = () => {
    if (!analysisResult) return;

    addTask({
      title: `Obtain USHA OEM MAF for Tender ${analysisResult.tenderNumber}`,
      assignedEmployeeId: 'EMP-003',
      assignedEmployeeName: 'Amit Verma',
      department: 'Tender',
      priority: 'Critical',
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      status: 'Pending',
      relatedType: 'Tender',
      relatedName: analysisResult.tenderNumber,
    });

    addTask({
      title: `Arrange EMD Bank Guarantee of ${formatINR(analysisResult.emdAmount || 74500)} with SBI`,
      assignedEmployeeId: 'EMP-012',
      assignedEmployeeName: 'Harish Bansal',
      department: 'Accounts',
      priority: 'High',
      dueDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      status: 'Pending',
      relatedType: 'Tender',
      relatedName: analysisResult.tenderNumber,
    });

    setSaveSuccessMessage(`Created 2 high-priority bidding tasks in Task Management!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-6 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              AI Document Intelligence
            </span>
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight">
            AI Tender Document Assistant
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Upload or paste Government Tender NIT, RFP, or GeM bid specifications. Gemini AI extracts products, quantities, EMD, eligibility rules, and compliance checklists.
          </p>
        </div>

        {/* Human Verification Notice */}
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200 max-w-xs backdrop-blur-xs flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <p className="leading-snug">
            <strong>Mandatory Verification:</strong> AI extracted parameters must be verified by the assigned Tender Specialist before official submission.
          </p>
        </div>
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Input & Quick Samples */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tender Document Text / NIT Snippet
              </h3>
              <span className="text-[11px] text-slate-400">{documentText.length} characters</span>
            </div>

            {/* Quick Sample Selector */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Quick Test Samples:</span>
              <div className="mt-1.5 space-y-1.5">
                {sampleTenders.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDocumentText(s.text);
                      setAnalysisResult(null);
                    }}
                    className="w-full text-left rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/60 transition truncate"
                  >
                    📄 {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={9}
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                placeholder="Paste tender RFP notice, GeM bid document text, eligibility terms, or technical criteria here..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons Toolbar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Execute AI Actions
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  disabled={!documentText || isAnalyzing}
                  onClick={() => handleRunAction('Analyze Tender')}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAnalyzing && activeAction === 'Analyze Tender' ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  <span>Analyze Tender</span>
                </button>

                <button
                  type="button"
                  disabled={!documentText || isAnalyzing}
                  onClick={() => handleRunAction('Check Eligibility')}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Check Eligibility</span>
                </button>

                <button
                  type="button"
                  disabled={!documentText || isAnalyzing}
                  onClick={() => handleRunAction('Generate Checklist')}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ListTodo className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Generate Checklist</span>
                </button>

                <button
                  type="button"
                  disabled={!documentText || isAnalyzing}
                  onClick={() => handleRunAction('Identify Risks')}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Identify Risks</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Structured Extracted Intelligence */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Tender Intelligence
                </h3>
                <p className="text-xs text-slate-500">
                  {analysisResult ? 'Structured data extracted by Gemini model' : 'Waiting for document input...'}
                </p>
              </div>

              {analysisResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateAITasks}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <ListTodo className="h-3.5 w-3.5 text-blue-600" />
                    <span>Create Tasks</span>
                  </button>
                  <button
                    onClick={handleSaveAsTender}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Save as Live Tender</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification if saved */}
            {saveSuccessMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{saveSuccessMessage}</span>
                </div>
                <button
                  onClick={onNavigateTenders}
                  className="font-bold text-emerald-900 underline"
                >
                  Open in Tenders &rarr;
                </button>
              </div>
            )}

            {/* Empty State */}
            {!analysisResult && !isAnalyzing && (
              <div className="py-20 text-center space-y-2">
                <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
                <h4 className="text-sm font-bold text-slate-700">No Document Analyzed Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click one of the sample tenders on the left or paste your RFP text, then click "Analyze Tender" to extract structured fields.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin" />
                <h4 className="text-sm font-bold text-slate-800">Analyzing Document with Gemini AI...</h4>
                <p className="text-xs text-slate-400">
                  Parsing technical specs, turnover clauses, EMD rules, and required documents
                </p>
              </div>
            )}

            {/* Structured Results Display */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200">
                {/* Executive Summary */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider">
                    Executive Summary
                  </span>
                  <p className="mt-1 text-slate-800 leading-relaxed font-medium">
                    {analysisResult.summary}
                  </p>
                  {analysisResult.recommendedAction && (
                    <div className="mt-2 text-blue-800 text-[11px] font-semibold flex items-center gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Recommended Action: {analysisResult.recommendedAction}</span>
                    </div>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tender Number</span>
                    <div className="mt-0.5 font-mono font-bold text-blue-700 truncate">
                      {analysisResult.tenderNumber || 'GEM/2026/B/894012'}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Value</span>
                    <div className="mt-0.5 font-extrabold text-slate-900">
                      {formatINR(analysisResult.estimatedValue || 0)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">EMD Value</span>
                    <div className="mt-0.5 font-extrabold text-slate-900">
                      {formatINR(analysisResult.emdAmount || 0)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quantity</span>
                    <div className="mt-0.5 font-extrabold text-slate-900">
                      {analysisResult.quantity || 500} Units
                    </div>
                  </div>
                </div>

                {/* Organization & Product */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Purchaser Organization</span>
                    <p className="mt-0.5 font-semibold text-slate-900">{analysisResult.organization}</p>
                    <p className="text-[11px] text-slate-500">{analysisResult.location}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Product Scope</span>
                    <p className="mt-0.5 font-semibold text-slate-900">{analysisResult.products}</p>
                    <p className="text-[11px] text-slate-500">Submission Due: {analysisResult.submissionDeadline?.slice(0, 10)}</p>
                  </div>
                </div>

                {/* Eligibility & Required Documents Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Eligibility */}
                  <div className="rounded-xl border border-slate-200 p-3.5 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider text-blue-700">
                      Eligibility & Financial Criteria
                    </span>
                    <ul className="space-y-1 text-slate-600 pl-3 list-disc">
                      {Array.isArray(analysisResult.eligibilityCriteria) ? (
                        analysisResult.eligibilityCriteria.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))
                      ) : (
                        <li>{analysisResult.eligibilityCriteria}</li>
                      )}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div className="rounded-xl border border-slate-200 p-3.5 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider text-indigo-700">
                      Required Document Checklist
                    </span>
                    <ul className="space-y-1 text-slate-600 pl-3 list-disc">
                      {Array.isArray(analysisResult.requiredDocuments) ? (
                        analysisResult.requiredDocuments.map((d: string, i: number) => (
                          <li key={i}>{d}</li>
                        ))
                      ) : (
                        <li>{analysisResult.requiredDocuments}</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Potential Risks */}
                {analysisResult.potentialRisks && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      <span>Potential Risks & Penalties Identified</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-amber-900 pl-4 list-disc text-[11px]">
                      {Array.isArray(analysisResult.potentialRisks) ? (
                        analysisResult.potentialRisks.map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        ))
                      ) : (
                        <li>{analysisResult.potentialRisks}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
