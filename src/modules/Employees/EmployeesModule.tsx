import React, { useState } from 'react';
import {
  Contact,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  UserCheck,
  Building2,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import { formatDate, exportToCSV } from '../../utils/formatters';

export const EmployeesModule: React.FC = () => {
  const { employees, tasks } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const departments = ['All', 'Tender', 'Supply Chain', 'CRM', 'Accounts', 'Data Management', 'HR', 'Management'];

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || e.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  const handleExport = () => {
    const exportData = filteredEmployees.map((e) => ({
      'Employee Code': e.employeeCode,
      'Name': e.name,
      'Department': e.department,
      'Role': e.role,
      'Phone': e.phone,
      'Email': e.email,
      'Joining Date': e.joiningDate,
      'Reporting Manager': e.managerName,
      'Status': e.status,
      'Attendance': e.attendanceStatus,
      'Performance Rating': `${e.performanceRating} / 5`,
    }));
    exportToCSV(exportData, 'GeoDigital_Staff_Directory');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory & HR Operations</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800">
              {filteredEmployees.length} Staff Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Department roles, attendance logs, task distribution, and performance evaluations across 7 units
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export HR Roster</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search staff name, designation, code, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const empTasks = tasks.filter((t) => t.assignedEmployeeId === emp.id && t.status !== 'Completed');

          return (
            <div
              key={emp.id}
              onClick={() => setSelectedEmp(emp)}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition">
                          {emp.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">({emp.employeeCode})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{emp.role}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      emp.attendanceStatus === 'Present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : emp.attendanceStatus === 'Field Visit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {emp.attendanceStatus}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    <span>Dept: <strong className="text-slate-800">{emp.department}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{emp.performanceRating} / 5.0</span>
                </div>

                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                  {empTasks.length} Pending Tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmp.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedEmp.name}</h3>
                  <p className="text-xs text-slate-500">{selectedEmp.role} · {selectedEmp.department}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmp(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee Code</span>
                  <span className="font-mono font-bold text-slate-800">{selectedEmp.employeeCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Reporting Manager</span>
                  <span className="font-bold text-slate-800">{selectedEmp.managerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Joining Date</span>
                  <span className="text-slate-800">{formatDate(selectedEmp.joiningDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tasks Completed</span>
                  <span className="font-bold text-emerald-700">{selectedEmp.completedTasks} items</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">
                  Active Assigned Tasks
                </h4>
                <div className="space-y-1.5">
                  {tasks
                    .filter((t) => t.assignedEmployeeId === selectedEmp.id)
                    .map((t) => (
                      <div key={t.id} className="rounded-lg border border-slate-200 p-2 flex items-center justify-between">
                        <span className="font-medium text-slate-800 line-clamp-1">{t.title}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold shrink-0 ml-2">
                          {t.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedEmp(null)}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
