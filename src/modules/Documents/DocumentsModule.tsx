import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileCheck2,
  FileText,
  Shield,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasterDocument } from '../../types';
import { formatDate } from '../../utils/formatters';

export const DocumentsModule: React.FC = () => {
  const { masterDocuments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = [
    'All',
    'OEM Authorization',
    'Taxation',
    'Company Registration',
    'Quality & Certifications',
    'Financial & Audited',
    'Affidavits',
  ];

  const filteredDocs = masterDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'All' || doc.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Central Document Repository</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Verified Compliance Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            USHA OEM authorization deeds, GST registrations, MSME certificates, CA audited balance sheets & solvency affidavits
          </p>
        </div>

        <button
          onClick={() => alert('Document upload modal: Select PDF/Scanned certification to attach to company repository.')}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>+ Upload Master Certificate</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search master certificate, document number, issuer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between hover:border-blue-400 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {doc.category}
                </span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                    doc.status === 'Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <h3 className="mt-2 text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {doc.name}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-[11px]">
                  <span className="text-slate-400 font-semibold block uppercase text-[9px]">Document Identifier</span>
                  <span className="font-mono font-bold text-blue-700 truncate block">{doc.documentNumber}</span>
                </div>
                <div className="text-[11px] pt-1">
                  <span className="text-slate-400 font-semibold block uppercase text-[9px]">Issuing Authority</span>
                  <span className="truncate block font-medium text-slate-800">{doc.issuer}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Issued: {formatDate(doc.issueDate)}</span>
                <span className="font-semibold text-slate-700">Expires: {formatDate(doc.expiryDate)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">{doc.fileSize} · {doc.responsibleEmployee}</span>
              <button
                onClick={() => alert(`Opening verified statutory file: ${doc.name}`)}
                className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
