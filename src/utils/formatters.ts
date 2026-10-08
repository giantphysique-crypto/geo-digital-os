/**
 * Utility functions for Geo Digital OS
 * Formats Indian Currency, Dates, Deadlines, and provides CSV export utilities
 */

export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)} K`;
    }
  }

  // Format with Indian number system (Lakhs, Crores)
  const parts = Math.round(amount).toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `₹${formattedWhole}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateStr: string): {
  days: number;
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
} {
  const target = new Date(targetDateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      label: `${Math.abs(diffDays)}d overdue`,
      isOverdue: true,
      isUrgent: true,
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      label: 'Due today',
      isOverdue: false,
      isUrgent: true,
    };
  } else if (diffDays === 1) {
    return {
      days: 1,
      label: 'Tomorrow',
      isOverdue: false,
      isUrgent: true,
    };
  } else {
    return {
      days: diffDays,
      label: `${diffDays} days left`,
      isOverdue: false,
      isUrgent: diffDays <= 3,
    };
  }
}

export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((header) => {
        const val = item[header];
        if (val === null || val === undefined) return '""';
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateId(prefix: string = 'GD'): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}
