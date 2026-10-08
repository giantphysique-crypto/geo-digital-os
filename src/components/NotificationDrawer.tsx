import React, { useState } from 'react';
import {
  X,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string, recordId?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(
    (n) => priorityFilter === 'All' || n.priority === priorityFilter
  );

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'Critical':
        return <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />;
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />;
      case 'Medium':
        return <Info className="h-4 w-4 text-blue-600 shrink-0" />;
      case 'Low':
      default:
        return <Clock className="h-4 w-4 text-slate-500 shrink-0" />;
    }
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Notification Center</h2>
              <p className="text-xs text-slate-500">Real-time alerts, tender deadlines & inventory flags</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/70 px-6 py-2">
            <Filter className="h-3 w-3 text-slate-400 mr-1" />
            {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  priorityFilter === p
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center">
                <CheckCheck className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-700">All clear</p>
                <p className="text-xs text-slate-400">No unread notifications in this category.</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative rounded-xl p-4 transition hover:bg-slate-50 ${
                    !n.read ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getPriorityIcon(n.priority)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded border px-1.5 py-0.2 text-[10px] font-semibold ${getPriorityBadgeClass(
                            n.priority
                          )}`}
                        >
                          {n.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <h4 className="mt-1 text-xs font-semibold text-slate-900">{n.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>

                      {/* Direct action button */}
                      <div className="mt-2.5 flex items-center justify-between">
                        {n.linkType && (
                          <button
                            onClick={() => {
                              markNotificationRead(n.id);
                              onClose();
                              onNavigate(
                                n.linkType === 'tender'
                                  ? 'tenders'
                                  : n.linkType === 'order'
                                  ? 'orders'
                                  : n.linkType === 'inventory'
                                  ? 'supply-chain'
                                  : n.linkType === 'invoice'
                                  ? 'accounts'
                                  : 'tasks',
                                n.linkId
                              );
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            <span>Open Record</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                        {!n.read && (
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            className="text-[11px] text-slate-400 hover:text-slate-600 ml-auto"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
