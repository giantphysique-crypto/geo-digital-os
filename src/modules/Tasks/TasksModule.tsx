import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Priority } from '../../types';
import { formatDate } from '../../utils/formatters';

export const TasksModule: React.FC = () => {
  const { tasks, updateTaskStatus, addTask, employees } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New Task Form
  const [newTitle, setNewTitle] = useState('');
  const [newAssignedId, setNewAssignedId] = useState(employees[0]?.id || '');
  const [newDepartment, setNewDepartment] = useState<Task['department']>('Tender');
  const [newPriority, setNewPriority] = useState<Priority>('High');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [newRelatedType, setNewRelatedType] = useState<Task['relatedType']>('Tender');
  const [newRelatedName, setNewRelatedName] = useState('');

  const departments = ['All', 'Tender', 'Supply Chain', 'CRM', 'Accounts', 'Data Management', 'HR', 'Management'];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedEmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.relatedName && t.relatedName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = departmentFilter === 'All' || t.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const emp = employees.find((e) => e.id === newAssignedId);

    addTask({
      title: newTitle,
      assignedEmployeeId: newAssignedId,
      assignedEmployeeName: emp?.name || 'Assigned Officer',
      department: newDepartment,
      priority: newPriority,
      dueDate: newDueDate,
      status: 'Pending',
      relatedType: newRelatedType,
      relatedName: newRelatedName || undefined,
    });

    setIsNewTaskOpen(false);
    setNewTitle('');
    setNewRelatedName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Company Task Management</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              {filteredTasks.length} Active Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interconnected action items linked to Tenders, Orders, Dispatches & Treasury Invoices
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add New Task</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search task description, staff member, related ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                <th className="py-3 px-4">Task Description & Link</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No tasks match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      {task.relatedName && (
                        <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                          Linked {task.relatedType}: {task.relatedName}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {task.department}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {task.assignedEmployeeName}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                          task.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div
                        className={`font-medium ${
                          task.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className={`rounded-md border px-2 py-1 font-bold text-[11px] outline-none cursor-pointer ${
                          task.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : task.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-white text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Assign New Operational Task</h3>
              <button onClick={() => setIsNewTaskOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify USHA OEM MAF stamp for Maharashtra DVET tender"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Employee</label>
                  <select
                    value={newAssignedId}
                    onChange={(e) => {
                      setNewAssignedId(e.target.value);
                      const emp = employees.find((emp) => emp.id === e.target.value);
                      if (emp) setNewDepartment(emp.department);
                    }}
                    className="w-full rounded-md border border-slate-300 p-2"
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Related Entity</label>
                  <select
                    value={newRelatedType}
                    onChange={(e) => setNewRelatedType(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  >
                    <option value="Tender">Tender</option>
                    <option value="Order">Order</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Dispatch">Dispatch</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Customer">Customer</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Related Reference ID / Name</label>
                <input
                  type="text"
                  placeholder="e.g. GEM/2026/B/894012 or ORD-GD-1025"
                  value={newRelatedName}
                  onChange={(e) => setNewRelatedName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="rounded-lg border px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
