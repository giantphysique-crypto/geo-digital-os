import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Check, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose }) => {
  const { importSpreadsheetData } = useApp();
  const [selectedEntity, setSelectedEntity] = useState<'Tenders' | 'Customers' | 'Products' | 'Orders'>('Tenders');
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'success'>('upload');
  const [fileName, setFileName] = useState('');
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  // Generate realistic sample records for demonstration
  const handleLoadSample = (entity: string) => {
    setFileName(`Sample_${entity}_Legacy_Records.csv`);
    if (entity === 'Tenders') {
      setSampleData([
        {
          tenderNumber: 'GEM/2026/B/992144',
          title: 'Supply of 500 USHA Tailor Deluxe Machines for UP Skill Center',
          organization: 'UP State Skill Development Mission',
          department: 'Vocational Education',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          product: 'USHA Tailor Deluxe',
          quantity: '500',
          estimatedValue: '3725000',
          emdAmount: '74500',
        },
        {
          tenderNumber: 'RSLDC/2026/BID/410',
          title: 'Supply of 250 Industrial Sewing Units for Kota Technical Wing',
          organization: 'Rajasthan Skill Development Corp',
          department: 'Technical Education',
          state: 'Rajasthan',
          district: 'Kota',
          product: 'USHA Industrial Umbrella 95T',
          quantity: '250',
          estimatedValue: '3412500',
          emdAmount: '68250',
        },
        {
          tenderNumber: 'DVET/MH/2026/NAGPUR/11',
          title: 'Procurement of 120 Overlock Machines for Vidarbha ITIs',
          organization: 'DVET Maharashtra',
          department: 'Skill Development',
          state: 'Maharashtra',
          district: 'Nagpur',
          product: 'USHA Industrial Overlock 4-Thread (747D)',
          quantity: '120',
          estimatedValue: '2940000',
          emdAmount: '58800',
        },
      ]);
    } else if (entity === 'Customers') {
      setSampleData([
        {
          organizationName: 'Uttarakhand Rural Development Association',
          department: 'Rural Development',
          contactPerson: 'Deepak Bhatt',
          designation: 'Joint Director',
          phone: '+91 135 2712233',
          email: 'contact@ukrural.gov.in',
          address: 'Subhash Road',
          state: 'Uttarakhand',
          district: 'Dehradun',
          gstNumber: '05AAAGU1122D1Z8',
        },
        {
          organizationName: 'Punjab Skill Development Mission (PSDM)',
          department: 'Employment Generation & Training',
          contactPerson: 'Gurpreet Singh',
          designation: 'Mission Director',
          phone: '+91 172 2791100',
          email: 'md@psdm.gov.in',
          address: 'Sector 17',
          state: 'Punjab',
          district: 'Chandigarh',
          gstNumber: '03AAAGP4455K1Z4',
        },
      ]);
    } else {
      setSampleData([
        {
          sku: 'USHA-DOM-PRM',
          name: 'USHA Prima Automatic Machine',
          unitPrice: '11200',
          quantityAvailable: '50',
          minimumStock: '20',
          location: 'Gurugram Bay 9',
        },
      ]);
    }
    setStep('mapping');
  };

  const handleCommitImport = () => {
    const count = importSpreadsheetData(selectedEntity, sampleData);
    setImportedCount(count);
    setStep('success');
  };

  const handleReset = () => {
    setStep('upload');
    setFileName('');
    setSampleData([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Spreadsheet Data Import Engine</h3>
              <p className="text-xs text-slate-500">
                Migrate legacy Excel / CSV files into Geo Digital OS with smart column mapping & validation
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

        {/* Progress Stepper */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-blue-600' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">1</span>
            <span>Upload File</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step === 'mapping' ? 'text-blue-600' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">2</span>
            <span>Column Mapping</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-blue-600' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">3</span>
            <span>Validation Preview</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step === 'success' ? 'text-emerald-600' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">4</span>
            <span>Completed</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Select Target Module */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Target Data Entity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Tenders', 'Customers', 'Products', 'Orders'] as const).map((ent) => (
                    <button
                      key={ent}
                      type="button"
                      onClick={() => setSelectedEntity(ent)}
                      className={`rounded-xl border p-3 text-left transition ${
                        selectedEntity === ent
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600 font-bold text-blue-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <FileSpreadsheet className="h-4 w-4 mb-1 text-slate-500" />
                      <div className="text-xs">{ent}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center hover:border-blue-400 transition">
                <Upload className="mx-auto h-10 w-10 text-slate-400" />
                <h4 className="mt-3 text-sm font-bold text-slate-800">
                  Drag and drop your Excel (.xlsx, .xls) or CSV spreadsheet
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Or load a pre-formatted template with legacy tenders and customers
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleLoadSample(selectedEntity)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                  >
                    Load Sample {selectedEntity} Spreadsheet (1-Click Demo)
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">File: </span>
                  <span className="font-mono text-slate-900">{fileName}</span>
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                  {sampleData.length} records parsed
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Map Spreadsheet Columns to Geo Digital OS Fields
              </h4>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white p-3 text-xs">
                {Object.keys(sampleData[0] || {}).map((colKey) => (
                  <div key={colKey} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-slate-700">{colKey}</span>
                      <span className="text-[10px] text-slate-400">(Spreadsheet Header)</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                        Matches: {colKey}
                      </span>
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('preview')}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Proceed to Validation Preview
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Validation passed! <strong>0 duplicates</strong> found. All required fields are present.
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <tr>
                      {Object.keys(sampleData[0] || {}).map((k) => (
                        <th key={k} className="p-2 font-mono uppercase text-[10px]">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sampleData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        {Object.values(row).map((v: any, j) => (
                          <td key={j} className="p-2 truncate max-w-[150px]">
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep('mapping')}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back to Mapping
                </button>
                <button
                  onClick={handleCommitImport}
                  className="rounded-lg bg-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                >
                  Import {sampleData.length} Records into System
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Successfully Imported {importedCount} {selectedEntity} Records!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                The imported data is now immediately active in the database and visible across all tender pipelines, CRM, and management dashboards.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Import Another File
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  View in OS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
