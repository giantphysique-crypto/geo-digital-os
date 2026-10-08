import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Building2,
  Phone,
  Mail,
  MapPin,
  Download,
  ArrowRight,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatINR, exportToCSV } from '../../utils/formatters';
import { CustomerDetailModal } from './CustomerDetailModal';

interface CRMModuleProps {
  onNavigateTender?: (tenderId: string) => void;
  onNavigateOrder?: (orderId: string) => void;
}

export const CRMModule: React.FC<CRMModuleProps> = ({
  onNavigateTender,
  onNavigateOrder,
}) => {
  const { customers, tenders, orders, addCustomer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  // New Customer Form State
  const [newOrgName, setNewOrgName] = useState('');
  const [newDepartment, setNewDepartment] = useState('Rural Development');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newDesignation, setNewDesignation] = useState('Mission Director');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newState, setNewState] = useState('Uttar Pradesh');
  const [newDistrict, setNewDistrict] = useState('Lucknow');
  const [newGST, setNewGST] = useState('');
  const [newType, setNewType] = useState<Customer['customerType']>('State Govt Department');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || c.customerType === typeFilter;
    const matchesState = stateFilter === 'All' || c.state === stateFilter;

    return matchesSearch && matchesType && matchesState;
  });

  const states = Array.from(new Set(customers.map((c) => c.state))).sort();
  const customerTypes = Array.from(new Set(customers.map((c) => c.customerType))).sort();

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newContactPerson) return;

    addCustomer({
      organizationName: newOrgName,
      department: newDepartment,
      contactPerson: newContactPerson,
      designation: newDesignation,
      phone: newPhone || '+91 98000 00000',
      email: newEmail || 'contact@department.gov.in',
      address: newAddress || 'Civil Lines, State Secretariat',
      state: newState,
      district: newDistrict,
      gstNumber: newGST || '09AAAAA0000A1Z5',
      customerType: newType,
      notes: 'Direct institutional client registered into CRM.',
    });

    setIsNewCustomerModalOpen(false);
    setNewOrgName('');
    setNewContactPerson('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleExport = () => {
    const exportData = filteredCustomers.map((c) => ({
      'Customer ID': c.id,
      'Organization': c.organizationName,
      'Department': c.department,
      'Contact Person': c.contactPerson,
      'Designation': c.designation,
      'Phone': c.phone,
      'Email': c.email,
      'State': c.state,
      'District': c.district,
      'GST Number': c.gstNumber,
      'Customer Type': c.customerType,
      'Total Value (INR)': c.totalTenderValue,
    }));
    exportToCSV(exportData, 'GeoDigital_CRM_Directory');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Institutional CRM & Accounts</h1>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
              {filteredCustomers.length} Institutional Clients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Government departments, Rural Livelihoods Missions, Skill Missions, Tribal Welfare & ITIs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Export</span> CSV
          </button>

          <button
            onClick={() => setIsNewCustomerModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Organization</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search government department, contact person, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All Types</option>
              {customerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">State:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="All">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs">
            No institutional customers found matching your criteria.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const custTenders = tenders.filter(
              (t) => t.customerId === cust.id || t.organization.toLowerCase().includes(cust.organizationName.toLowerCase())
            );
            const custOrders = orders.filter((o) => o.customerId === cust.id);

            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomerId(cust.id)}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-purple-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      {cust.customerType}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{cust.state}</span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-purple-700 transition">
                    {cust.organizationName}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cust.department}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium text-slate-800">{cust.contactPerson}</span>
                      <span className="text-[11px] text-slate-400">({cust.designation})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Contract Value</span>
                    <span className="font-extrabold text-slate-900">{formatINR(cust.totalTenderValue, true)}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-purple-700 text-xs">
                    <span>{custTenders.length} Bids</span>
                    <span>·</span>
                    <span>{custOrders.length} Orders</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 text-purple-600 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer 360 Detail Modal */}
      {selectedCustomerId && (
        <CustomerDetailModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          onNavigateTender={onNavigateTender}
          onNavigateOrder={onNavigateOrder}
        />
      )}

      {/* Add New Customer Modal */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Institutional Customer</h3>
              </div>
              <button
                onClick={() => setIsNewCustomerModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haryana State Rural Livelihoods Mission"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Government Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  >
                    <option value="State Govt Department">State Govt Department</option>
                    <option value="Central Ministry">Central Ministry</option>
                    <option value="Skill Mission">Skill Mission</option>
                    <option value="Tribal Welfare">Tribal Welfare</option>
                    <option value="Autonomous Institute">Autonomous Institute</option>
                    <option value="NGO / SHG Federation">NGO / SHG Federation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nodal Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar, IAS"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Phone</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="nodal@gov.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 06AAAGH1234F1Z1"
                    value={newGST}
                    onChange={(e) => setNewGST(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 text-white font-bold hover:bg-purple-700"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
