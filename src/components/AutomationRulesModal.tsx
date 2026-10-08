import React, { useState } from 'react';
import { X, Zap, Check, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AutomationRule } from '../types';

interface AutomationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationRulesModal: React.FC<AutomationRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { automationRules, toggleAutomationRule, addAuditLog } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newAction, setNewAction] = useState('');

  if (!isOpen) return null;

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle || !newTrigger || !newAction) return;

    // Simulation of adding custom rule
    addAuditLog('Created Automation Rule', 'Automation Engine', 'CUSTOM-RULE', newRuleTitle);
    setShowAddForm(false);
    setNewRuleTitle('');
    setNewTrigger('');
    setNewCondition('');
    setNewAction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Automation Engine & Trigger Rules</h3>
              <p className="text-xs text-slate-500">
                Automated business event pipeline: Cross-module order creation, inventory reservations & alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Create Custom Rule'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {showAddForm && (
            <form
              onSubmit={handleCreateRule}
              className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3 animate-in fade-in duration-150"
            >
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Define New Automation Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Auto-notify Accounts when dispatch confirmed"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trigger Event</label>
                  <select
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2"
                  >
                    <option value="">Select event...</option>
                    <option value="Tender Marked Won">Tender Marked Won</option>
                    <option value="Order Status Changed">Order Status Changed</option>
                    <option value="Dispatch In Transit">Dispatch In Transit</option>
                    <option value="Inventory Below Min">Inventory Below Min</option>
                    <option value="Invoice Past Due Date">Invoice Past Due Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Condition Logic</label>
                  <input
                    type="text"
                    placeholder="e.g. IF Order Value > ₹10,00,000"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Automated Action</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Issue High Priority Task to Logistics Lead"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          )}

          {/* Active Rules List */}
          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className={`rounded-xl border p-4 transition-all ${
                  rule.isActive
                    ? 'border-slate-200 bg-white shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-amber-600">{rule.id}</span>
                      <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {rule.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    {/* Logic Diagram */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Trigger</span>
                        <span className="mt-0.5 font-medium text-slate-800">{rule.triggerEvent}</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Condition</span>
                        <span className="mt-0.5 font-medium text-slate-700">{rule.condition}</span>
                      </div>
                      <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-2.5">
                        <span className="block text-[10px] font-bold uppercase text-blue-500">Automated Action</span>
                        <span className="mt-0.5 font-semibold text-blue-900">{rule.action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch & Stats */}
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <button
                      onClick={() => toggleAutomationRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.isActive ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>Fired <strong>{rule.executionsCount}</strong> times</div>
                      {rule.lastTriggered && (
                        <div className="truncate max-w-[120px]">Last: {rule.lastTriggered.slice(0, 10)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <span>Rules execute automatically across background event dispatchers.</span>
          </div>
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
