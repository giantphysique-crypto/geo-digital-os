import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tender,
  TenderStatus,
  Order,
  OrderStatus,
  Customer,
  ProductInventory,
  ProcurementItem,
  DispatchRecord,
  Invoice,
  PaymentRecord,
  Employee,
  Task,
  NotificationItem,
  AuditLogItem,
  AutomationRule,
  MasterDocument,
  StockMovement,
  UserRole,
} from '../types';
import {
  initialEmployees,
  initialCustomers,
  initialProducts,
  initialTenders,
  initialOrders,
  initialProcurement,
  initialDispatches,
  initialInvoices,
  initialPayments,
  initialTasks,
  initialNotifications,
  initialAuditLogs,
  initialAutomationRules,
  initialMasterDocuments,
  initialStockMovements,
} from '../data/mockData';
import { generateId } from '../utils/formatters';
import { generateTrackingHistory } from '../utils/logisticsCalculator';

export type DateFilterType = 'Today' | 'This week' | 'This month' | 'This quarter' | 'This year' | 'Custom range';

interface AppContextType {
  // State
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Data Collections
  employees: Employee[];
  customers: Customer[];
  products: ProductInventory[];
  stockMovements: StockMovement[];
  tenders: Tender[];
  orders: Order[];
  procurement: ProcurementItem[];
  dispatches: DispatchRecord[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  tasks: Task[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  automationRules: AutomationRule[];
  masterDocuments: MasterDocument[];

  // Workflow Handlers
  updateTenderStatus: (tenderId: string, newStatus: TenderStatus, notes?: string) => void;
  addTender: (tender: Omit<Tender, 'id' | 'history' | 'documentChecklist'>) => string;
  updateTender: (tender: Tender) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdDate' | 'totalTenderValue'>) => string;
  updateCustomer: (customer: Customer) => void;
  createOrder: (order: Partial<Order>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  adjustStock: (productId: string, quantityChange: number, type: 'Inward' | 'Outward', notes: string) => void;
  createProcurementPO: (req: Partial<ProcurementItem>) => string;
  receiveProcurement: (procurementId: string) => void;
  createDispatch: (dispatch: Partial<DispatchRecord>) => string;
  updateDispatchStatus: (dispatchId: string, status: DispatchRecord['deliveryStatus'], notes?: string) => void;
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdDate' | 'commentsCount'>) => string;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, module: string, recordId: string, recordTitle: string, oldValue?: string, newValue?: string) => void;
  toggleAutomationRule: (ruleId: string) => void;
  importSpreadsheetData: (entityType: string, records: any[]) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('Management');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('This month');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load from local storage or defaults
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('gd_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gd_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [products, setProducts] = useState<ProductInventory[]>(() => {
    const saved = localStorage.getItem('gd_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('gd_stock_movements');
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  const [tenders, setTenders] = useState<Tender[]>(() => {
    const saved = localStorage.getItem('gd_tenders');
    return saved ? JSON.parse(saved) : initialTenders;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gd_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [procurement, setProcurement] = useState<ProcurementItem[]>(() => {
    const saved = localStorage.getItem('gd_procurement');
    return saved ? JSON.parse(saved) : initialProcurement;
  });

  const [dispatches, setDispatches] = useState<DispatchRecord[]>(() => {
    const saved = localStorage.getItem('gd_dispatches');
    return saved ? JSON.parse(saved) : initialDispatches;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('gd_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('gd_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('gd_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('gd_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('gd_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('gd_automation_rules');
    return saved ? JSON.parse(saved) : initialAutomationRules;
  });

  const [masterDocuments] = useState<MasterDocument[]>(initialMasterDocuments);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gd_tenders', JSON.stringify(tenders));
      localStorage.setItem('gd_orders', JSON.stringify(orders));
      localStorage.setItem('gd_products', JSON.stringify(products));
      localStorage.setItem('gd_procurement', JSON.stringify(procurement));
      localStorage.setItem('gd_dispatches', JSON.stringify(dispatches));
      localStorage.setItem('gd_invoices', JSON.stringify(invoices));
      localStorage.setItem('gd_payments', JSON.stringify(payments));
      localStorage.setItem('gd_tasks', JSON.stringify(tasks));
      localStorage.setItem('gd_notifications', JSON.stringify(notifications));
      localStorage.setItem('gd_audit_logs', JSON.stringify(auditLogs));
      localStorage.setItem('gd_customers', JSON.stringify(customers));
      localStorage.setItem('gd_employees', JSON.stringify(employees));
    } catch {
      // Storage quota or SSR fallback
    }
  }, [tenders, orders, products, procurement, dispatches, invoices, payments, tasks, notifications, auditLogs, customers, employees]);

  // Central Audit Logger
  const addAuditLog = (
    action: string,
    module: string,
    recordId: string,
    recordTitle: string,
    oldValue?: string,
    newValue?: string
  ) => {
    const newLog: AuditLogItem = {
      id: generateId('AUDIT'),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: activeRole === 'Management' ? 'Sunita Sharma (COO)' : `${activeRole} User`,
      role: activeRole,
      action,
      module,
      recordId,
      recordTitle,
      previousValue: oldValue,
      newValue: newValue,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add Notification
  const pushNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'],
    priority: NotificationItem['priority'],
    linkType?: NotificationItem['linkType'],
    linkId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: generateId('NOTIF'),
      title,
      message,
      type,
      priority,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      read: false,
      linkType,
      linkId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  /**
   * CORE BUSINESS AUTOMATION:
   * When Tender status changes to "Won":
   * 1. Auto-create Order
   * 2. Check inventory of relevant product
   * 3. Reserve stock if available, or generate Procurement PO if insufficient
   * 4. Create tasks for Supply Chain and Accounts
   * 5. Record Audit Log & Push Notification
   */
  const updateTenderStatus = (tenderId: string, newStatus: TenderStatus, notes?: string) => {
    const tender = tenders.find((t) => t.id === tenderId);
    if (!tender) return;

    const oldStatus = tender.status;
    if (oldStatus === newStatus) return;

    let updatedTender = { ...tender, status: newStatus };

    // Record history
    const historyItem = {
      id: generateId('HIST'),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: `${activeRole} Specialist`,
      action: `Status updated from ${oldStatus} to ${newStatus}${notes ? ` - ${notes}` : ''}`,
    };
    updatedTender.history = [historyItem, ...(updatedTender.history || [])];

    // AUTOMATION: If WON, execute connected pipeline
    if (newStatus === 'Won' && !tender.orderId) {
      const newOrderNum = `ORD-GD-${Math.floor(1026 + Math.random() * 800)}`;
      const newOrderId = generateId('ORD');

      // Match or create customer
      let cust = customers.find((c) => c.id === tender.customerId || c.organizationName.toLowerCase().includes(tender.organization.toLowerCase()));
      if (!cust) {
        cust = customers[0]; // fallback
      }

      // Find matching inventory product
      const productMatch = products.find(
        (p) =>
          tender.product.toLowerCase().includes(p.name.toLowerCase()) ||
          tender.product.toLowerCase().includes(p.brand.toLowerCase()) ||
          tender.product.toLowerCase().includes('tailor deluxe')
      ) || products[0];

      const availableToReserve = Math.max(0, productMatch.quantityAvailable - productMatch.reservedQuantity);
      const reservedCount = Math.min(tender.quantity, availableToReserve);
      const isShortfall = tender.quantity > availableToReserve;

      // Update product inventory reservation
      if (reservedCount > 0) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productMatch.id
              ? {
                  ...p,
                  reservedQuantity: p.reservedQuantity + reservedCount,
                  stockStatus:
                    p.quantityAvailable - (p.reservedQuantity + reservedCount) <= p.minimumStock
                      ? 'Low Stock'
                      : 'Available',
                }
              : p
          )
        );

        setStockMovements((prev) => [
          {
            id: generateId('SM'),
            productId: productMatch.id,
            productName: productMatch.name,
            type: 'Reserved',
            quantity: reservedCount,
            referenceType: 'Order',
            referenceId: newOrderNum,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            performedBy: 'System Automation Engine',
          },
          ...prev,
        ]);
      }

      // If stock shortfall, auto-generate Procurement requirement
      let procId: string | undefined = undefined;
      if (isShortfall) {
        const shortQty = tender.quantity - reservedCount;
        procId = generateId('PROC');
        const newProcItem: ProcurementItem = {
          id: procId,
          purchaseRequirementNumber: `PR-GD-${newOrderNum.replace('ORD-GD-', '')}`,
          orderId: newOrderId,
          orderNumber: newOrderNum,
          tenderId: tender.id,
          supplier: 'USHA International Ltd (OEM)',
          product: productMatch.name,
          productId: productMatch.id,
          quantity: shortQty,
          costPerUnit: Math.round(productMatch.unitPrice * 0.82),
          totalCost: Math.round(shortQty * productMatch.unitPrice * 0.82),
          poNumber: `PO-USHA-2026-${Math.floor(100 + Math.random() * 900)}`,
          status: 'Requirement Created',
          createdDate: new Date().toISOString().slice(0, 10),
          expectedDelivery: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          notes: `Auto-generated procurement requirement for won tender ${tender.tenderNumber}. Quantity needed: ${shortQty}`,
        };
        setProcurement((prev) => [newProcItem, ...prev]);

        // Add task for Procurement team
        setTasks((prev) => [
          {
            id: generateId('TSK'),
            title: `Issue USHA OEM PO for ${shortQty} units for new Order ${newOrderNum}`,
            assignedEmployeeId: 'EMP-006',
            assignedEmployeeName: 'Vikramaditya Rao',
            department: 'Supply Chain',
            priority: 'Critical',
            dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            status: 'Pending',
            relatedType: 'Procurement',
            relatedId: procId,
            relatedName: newProcItem.purchaseRequirementNumber,
            commentsCount: 0,
            createdDate: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ]);
      }

      // Create Order
      const newOrder: Order = {
        id: newOrderId,
        orderNumber: newOrderNum,
        tenderId: tender.id,
        tenderNumber: tender.tenderNumber,
        customerId: cust.id,
        customerName: cust.organizationName,
        department: tender.department,
        state: tender.state,
        product: tender.product,
        quantity: tender.quantity,
        unitPrice: Math.round(tender.estimatedValue / tender.quantity),
        totalValue: tender.estimatedValue,
        orderDate: new Date().toISOString().slice(0, 10),
        requiredDeliveryDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        assignedEmployeeId: 'EMP-006',
        assignedEmployeeName: 'Vikramaditya Rao',
        status: isShortfall ? 'Procurement Pending' : 'Ready for Dispatch',
        procurementStatus: isShortfall ? 'Pending' : 'Not Required',
        dispatchStatus: 'Packing Pending',
        invoiceStatus: 'Not Invoiced',
        paymentStatus: 'Pending',
        procurementId: procId,
        inventoryReserved: reservedCount,
        notes: `Auto-created from Tender ${tender.tenderNumber}. Inventory reserved: ${reservedCount} units. Shortfall: ${isShortfall ? tender.quantity - reservedCount : 0} units.`,
      };

      setOrders((prev) => [newOrder, ...prev]);
      updatedTender.orderId = newOrderId;

      // Update customer total tender won value
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === cust!.id ? { ...c, totalTenderValue: c.totalTenderValue + tender.estimatedValue } : c
        )
      );

      // Add task for Supply Chain / Dispatch
      setTasks((prev) => [
        {
          id: generateId('TSK'),
          title: `Schedule inspection and packaging for Order ${newOrderNum} (${tender.organization})`,
          assignedEmployeeId: 'EMP-008',
          assignedEmployeeName: 'Dinesh Rathore',
          department: 'Supply Chain',
          priority: 'High',
          dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          status: 'Pending',
          relatedType: 'Order',
          relatedId: newOrderId,
          relatedName: newOrderNum,
          commentsCount: 0,
          createdDate: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);

      // Push notification
      pushNotification(
        `🎉 Tender WON & Order Created: ${tender.tenderNumber}`,
        `Tender won for ${tender.organization} (₹${(tender.estimatedValue / 100000).toFixed(1)} Lakhs). Order ${newOrderNum} generated and forwarded to Supply Chain.`,
        'Order',
        'Critical',
        'order',
        newOrderId
      );

      // Increment automation rule counter
      setAutomationRules((prev) =>
        prev.map((r) =>
          r.id === 'RULE-01' ? { ...r, executionsCount: r.executionsCount + 1, lastTriggered: new Date().toISOString() } : r
        )
      );
    }

    setTenders((prev) => prev.map((t) => (t.id === tenderId ? updatedTender : t)));
    addAuditLog('Tender Status Update', 'Tenders', tender.id, tender.tenderNumber, oldStatus, newStatus);
  };

  const addTender = (tenderData: Omit<Tender, 'id' | 'history' | 'documentChecklist'>): string => {
    const id = generateId('TND');
    const newTender: Tender = {
      ...tenderData,
      id,
      history: [
        {
          id: generateId('HIST'),
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          user: `${activeRole} Specialist`,
          action: 'Tender created in system',
        },
      ],
      documentChecklist: [
        {
          id: generateId('DOC'),
          tenderId: id,
          title: 'USHA OEM Authorization Certificate (MAF)',
          category: 'OEM',
          isRequired: true,
          isAvailable: false,
          responsiblePerson: tenderData.assignedEmployeeName || 'Amit Verma',
          verificationStatus: 'Pending Review',
        },
        {
          id: generateId('DOC'),
          tenderId: id,
          title: 'EMD Guarantee / Challan Receipt',
          category: 'Financial',
          isRequired: tenderData.emdAmount > 0,
          isAvailable: false,
          responsiblePerson: 'Harish Bansal',
          verificationStatus: 'Pending Review',
        },
        {
          id: generateId('DOC'),
          tenderId: id,
          title: 'Technical Specifications Compliance Sheet',
          category: 'Technical',
          isRequired: true,
          isAvailable: false,
          responsiblePerson: 'Rohan Mehra',
          verificationStatus: 'Pending Review',
        },
        {
          id: generateId('DOC'),
          tenderId: id,
          title: 'CA Certified Turnover Statement',
          category: 'Financial',
          isRequired: true,
          isAvailable: true,
          expiryDate: '2027-03-31',
          responsiblePerson: 'Harish Bansal',
          verificationStatus: 'Verified',
          uploadedFile: 'CA_Turnover_Cert_FY23-26.pdf',
        },
      ],
    };

    setTenders((prev) => [newTender, ...prev]);
    addAuditLog('Create Tender', 'Tenders', id, newTender.tenderNumber, undefined, newTender.status);
    pushNotification(
      `New Tender Added: ${newTender.tenderNumber}`,
      `Tender for ${newTender.organization} (${newTender.product}, Qty: ${newTender.quantity}) added to pipeline.`,
      'Tender',
      'Medium',
      'tender',
      id
    );
    return id;
  };

  const updateTender = (tender: Tender) => {
    setTenders((prev) => prev.map((t) => (t.id === tender.id ? tender : t)));
    addAuditLog('Update Tender Details', 'Tenders', tender.id, tender.tenderNumber);
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdDate' | 'totalTenderValue'>): string => {
    const id = generateId('CUST');
    const newCustomer: Customer = {
      ...customerData,
      id,
      createdDate: new Date().toISOString().slice(0, 10),
      totalTenderValue: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addAuditLog('Create Customer', 'CRM', id, newCustomer.organizationName);
    return id;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? customer : c)));
    addAuditLog('Update Customer', 'CRM', customer.id, customer.organizationName);
  };

  const createOrder = (orderData: Partial<Order>): string => {
    const id = generateId('ORD');
    const orderNum = `ORD-GD-${Math.floor(1030 + Math.random() * 500)}`;
    const newOrder: Order = {
      id,
      orderNumber: orderNum,
      tenderId: orderData.tenderId || 'DIRECT',
      tenderNumber: orderData.tenderNumber || 'DIRECT-PROCUREMENT',
      customerId: orderData.customerId || customers[0].id,
      customerName: orderData.customerName || customers[0].organizationName,
      department: orderData.department || 'General Procurement',
      state: orderData.state || 'Delhi',
      product: orderData.product || 'USHA Tailor Deluxe',
      quantity: orderData.quantity || 100,
      unitPrice: orderData.unitPrice || 5800,
      totalValue: orderData.totalValue || (orderData.quantity || 100) * (orderData.unitPrice || 5800),
      orderDate: new Date().toISOString().slice(0, 10),
      requiredDeliveryDate: orderData.requiredDeliveryDate || new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      assignedEmployeeId: orderData.assignedEmployeeId || 'EMP-006',
      assignedEmployeeName: orderData.assignedEmployeeName || 'Vikramaditya Rao',
      status: orderData.status || 'New',
      procurementStatus: 'Pending',
      dispatchStatus: 'Packing Pending',
      invoiceStatus: 'Not Invoiced',
      paymentStatus: 'Pending',
      inventoryReserved: 0,
      notes: orderData.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    addAuditLog('Create Order', 'Orders', id, orderNum);
    return id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const oldStatus = order.status;

    let updatedOrder = { ...order, status, notes: notes ? `${order.notes || ''} [${notes}]` : order.notes };

    // If marked Delivered, prepare Invoice in Accounts
    if (status === 'Delivered' && order.invoiceStatus === 'Not Invoiced') {
      const invId = generateId('INV');
      const invNum = `INV-GD-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newInvoice: Invoice = {
        id: invId,
        invoiceNumber: invNum,
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        customerName: order.customerName,
        department: order.department,
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        invoiceValue: order.totalValue,
        amountReceived: 0,
        outstandingAmount: order.totalValue,
        paymentStatus: 'Invoiced',
        gstAmount: Math.round(order.totalValue * 0.18 / 1.18),
        remindersCount: 0,
        notes: `Auto-generated upon successful delivery of Order ${order.orderNumber}.`,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      updatedOrder.invoiceId = invId;
      updatedOrder.invoiceStatus = 'Invoiced';

      pushNotification(
        `Invoice Generated: ${invNum}`,
        `Order ${order.orderNumber} delivered to ${order.customerName}. Commercial invoice for ₹${(order.totalValue / 100000).toFixed(1)}L submitted to Accounts.`,
        'Accounts',
        'High',
        'invoice',
        invId
      );
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    addAuditLog('Update Order Status', 'Orders', orderId, order.orderNumber, oldStatus, status);
  };

  const adjustStock = (productId: string, quantityChange: number, type: 'Inward' | 'Outward', notes: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newQty = type === 'Inward' ? p.quantityAvailable + quantityChange : Math.max(0, p.quantityAvailable - quantityChange);
        const freeStock = newQty - p.reservedQuantity;
        return {
          ...p,
          quantityAvailable: newQty,
          stockStatus: freeStock <= 0 ? 'Out of Stock' : freeStock <= p.minimumStock ? 'Low Stock' : 'Available',
          lastRestocked: type === 'Inward' ? new Date().toISOString().slice(0, 10) : p.lastRestocked,
        };
      })
    );

    const prod = products.find((p) => p.id === productId);
    setStockMovements((prev) => [
      {
        id: generateId('SM'),
        productId,
        productName: prod ? prod.name : 'Unknown Product',
        type,
        quantity: quantityChange,
        referenceType: 'Audit Adjustment',
        referenceId: notes,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        performedBy: `${activeRole} Specialist`,
      },
      ...prev,
    ]);

    addAuditLog('Inventory Adjustment', 'Inventory', productId, prod?.name || '', `${type} ${quantityChange} units`, notes);
  };

  const createProcurementPO = (reqData: Partial<ProcurementItem>): string => {
    const id = generateId('PROC');
    const prNum = `PR-GD-${Math.floor(1000 + Math.random() * 9000)}`;
    const poNum = `PO-USHA-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: ProcurementItem = {
      id,
      purchaseRequirementNumber: prNum,
      orderId: reqData.orderId,
      orderNumber: reqData.orderNumber,
      supplier: reqData.supplier || 'USHA International Ltd (OEM)',
      product: reqData.product || 'USHA Tailor Deluxe',
      productId: reqData.productId || products[0].id,
      quantity: reqData.quantity || 100,
      costPerUnit: reqData.costPerUnit || 4950,
      totalCost: (reqData.quantity || 100) * (reqData.costPerUnit || 4950),
      poNumber: poNum,
      status: 'PO Issued',
      createdDate: new Date().toISOString().slice(0, 10),
      expectedDelivery: reqData.expectedDelivery || new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      notes: reqData.notes,
    };

    setProcurement((prev) => [newItem, ...prev]);
    addAuditLog('Create Procurement PO', 'Procurement', id, poNum);
    return id;
  };

  const receiveProcurement = (procurementId: string) => {
    const item = procurement.find((p) => p.id === procurementId);
    if (!item) return;

    // Update procurement item status
    setProcurement((prev) =>
      prev.map((p) =>
        p.id === procurementId
          ? {
              ...p,
              status: 'Received at Warehouse',
              actualDelivery: new Date().toISOString().slice(0, 10),
            }
          : p
      )
    );

    // Increase product inventory stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === item.productId || p.name === item.product) {
          const newQty = p.quantityAvailable + item.quantity;
          return {
            ...p,
            quantityAvailable: newQty,
            stockStatus: newQty - p.reservedQuantity > p.minimumStock ? 'Available' : 'Low Stock',
            lastRestocked: new Date().toISOString().slice(0, 10),
          };
        }
        return p;
      })
    );

    // Record stock movement
    setStockMovements((prev) => [
      {
        id: generateId('SM'),
        productId: item.productId,
        productName: item.product,
        type: 'Inward',
        quantity: item.quantity,
        referenceType: 'Purchase Order',
        referenceId: item.poNumber || item.purchaseRequirementNumber,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        performedBy: 'Meenakshi Iyer (Warehouse Mgr)',
      },
      ...prev,
    ]);

    // Update linked order procurement status if any
    if (item.orderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === item.orderId
            ? {
                ...o,
                procurementStatus: 'Received',
                status: o.status === 'Procurement Pending' ? 'Ready for Dispatch' : o.status,
              }
            : o
        )
      );
    }

    pushNotification(
      `Shipment Received: ${item.poNumber || item.product}`,
      `${item.quantity} units of ${item.product} received and inspected into warehouse from ${item.supplier}.`,
      'Inventory',
      'Medium',
      'inventory',
      item.productId
    );

    addAuditLog('Receive Procurement Shipment', 'Procurement', procurementId, item.poNumber || item.purchaseRequirementNumber);
  };

  const createDispatch = (dispData: Partial<DispatchRecord>): string => {
    const id = generateId('DISP');
    const dispNum = `DSP-2026-${Math.floor(100 + Math.random() * 900)}`;

    const carrier = dispData.transporter || 'Delhivery Surface B2B';
    const originCity = dispData.originCity || 'Gurugram';
    const destDistrict = dispData.destinationDistrict || 'Lucknow';
    const dispDate = dispData.dispatchDate || new Date().toISOString().slice(0, 10);
    const vehicleNum = dispData.vehicleNumber || 'HR 55 AU 9102';

    const newDispatch: DispatchRecord = {
      id,
      dispatchNumber: dispNum,
      orderId: dispData.orderId || orders[0].id,
      orderNumber: dispData.orderNumber || orders[0].orderNumber,
      customerId: dispData.customerId || customers[0].id,
      customerName: dispData.customerName || customers[0].organizationName,
      product: dispData.product || 'USHA Tailor Deluxe',
      quantity: dispData.quantity || 100,
      packingStatus: 'Packed',
      dispatchDate: dispDate,
      transporter: carrier,
      carrierCode: dispData.carrierCode || 'delhivery',
      trackingNumber: dispData.trackingNumber || `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`,
      vehicleNumber: vehicleNum,
      lrNumber: dispData.lrNumber || `LR-GD-${Math.floor(10000 + Math.random() * 90000)}`,
      eWayBillNumber: dispData.eWayBillNumber || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      expectedDelivery: dispData.expectedDelivery || new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      deliveryStatus: dispData.deliveryStatus || 'In Transit',
      destinationState: dispData.destinationState || 'Uttar Pradesh',
      destinationDistrict: destDistrict,
      deliveryNotes: dispData.deliveryNotes,
      originPinCode: dispData.originPinCode || '122001',
      originCity: originCity,
      destinationPinCode: dispData.destinationPinCode || '226001',
      deadWeightKg: dispData.deadWeightKg || 140,
      volumetricWeightKg: dispData.volumetricWeightKg || 120,
      chargeableWeightKg: dispData.chargeableWeightKg || 140,
      dimensionsCm: dispData.dimensionsCm || { length: 120, width: 80, height: 100 },
      boxCount: dispData.boxCount || 10,
      freightCost: dispData.freightCost || 4850,
      driverPhone: dispData.driverPhone || '+91 98100 44219',
      currentGpsLocation: dispData.currentGpsLocation || 'Yamuna Expressway Toll Plaza (En Route)',
      trackingHistory: dispData.trackingHistory || generateTrackingHistory(
        originCity,
        destDistrict,
        dispData.deliveryStatus || 'In Transit',
        dispDate,
        carrier,
        vehicleNum
      ),
      ...dispData,
    };

    setDispatches((prev) => [newDispatch, ...prev]);

    // Update order status
    if (dispData.orderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === dispData.orderId
            ? { ...o, dispatchId: id, dispatchStatus: 'In Transit', status: 'In Transit' }
            : o
        )
      );
    }

    addAuditLog('Create Dispatch Consignment', 'Dispatch', id, dispNum);
    return id;
  };

  const updateDispatchStatus = (dispatchId: string, status: DispatchRecord['deliveryStatus'], notes?: string) => {
    const disp = dispatches.find((d) => d.id === dispatchId);
    if (!disp) return;

    setDispatches((prev) =>
      prev.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              deliveryStatus: status,
              actualDelivery: status === 'Delivered' ? new Date().toISOString().slice(0, 10) : d.actualDelivery,
              deliveryNotes: notes ? `${d.deliveryNotes || ''} [${notes}]` : d.deliveryNotes,
            }
          : d
      )
    );

    // Sync order status
    if (disp.orderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === disp.orderId
            ? {
                ...o,
                dispatchStatus: status,
                status: status === 'Delivered' ? 'Delivered' : status === 'In Transit' ? 'In Transit' : o.status,
              }
            : o
        )
      );
    }

    addAuditLog('Update Delivery Status', 'Dispatch', dispatchId, disp.dispatchNumber, disp.deliveryStatus, status);
  };

  const recordPayment = (paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => {
    const id = generateId('PAY');
    const rcptNum = `RCPT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newPayment: PaymentRecord = {
      ...paymentData,
      id,
      receiptNumber: rcptNum,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update invoice balance
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== paymentData.invoiceId) return inv;
        const newReceived = inv.amountReceived + paymentData.amount;
        const newOutstanding = Math.max(0, inv.invoiceValue - newReceived);
        const newStatus: Invoice['paymentStatus'] = newOutstanding === 0 ? 'Paid' : 'Partially Paid';
        return {
          ...inv,
          amountReceived: newReceived,
          outstandingAmount: newOutstanding,
          paymentStatus: newStatus,
        };
      })
    );

    // Update order payment status
    const targetInvoice = invoices.find((inv) => inv.id === paymentData.invoiceId);
    if (targetInvoice && targetInvoice.orderId) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== targetInvoice.orderId) return o;
          const isFullySettled = targetInvoice.invoiceValue <= targetInvoice.amountReceived + paymentData.amount;
          return {
            ...o,
            paymentStatus: isFullySettled ? 'Received' : 'Partially Paid',
            status: isFullySettled && o.status === 'Delivered' ? 'Completed' : o.status,
          };
        })
      );
    }

    pushNotification(
      `Payment Received: ₹${paymentData.amount.toLocaleString('en-IN')}`,
      `Received from ${paymentData.customerName} via ${paymentData.paymentMode} (Ref: ${paymentData.referenceNumber}) for Invoice ${paymentData.invoiceNumber}.`,
      'Accounts',
      'Medium',
      'invoice',
      paymentData.invoiceId
    );

    addAuditLog('Record Payment', 'Accounts', id, rcptNum, undefined, `₹${paymentData.amount.toLocaleString('en-IN')}`);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdDate' | 'commentsCount'>): string => {
    const id = generateId('TSK');
    const newTask: Task = {
      ...taskData,
      id,
      createdDate: new Date().toISOString().slice(0, 10),
      commentsCount: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    addAuditLog('Add Task', 'Tasks', id, newTask.title);
    return id;
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    addAuditLog('Update Task Status', 'Tasks', taskId, status);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const importSpreadsheetData = (entityType: string, records: any[]): number => {
    if (!records || records.length === 0) return 0;
    let count = 0;

    if (entityType === 'Tenders') {
      records.forEach((rec) => {
        addTender({
          tenderNumber: rec.tenderNumber || `GEM/IMP/${Math.floor(1000 + Math.random() * 9000)}`,
          title: rec.title || 'Bulk Imported Tender',
          department: rec.department || 'Govt Department',
          organization: rec.organization || 'Public Sector Purchaser',
          state: rec.state || 'Delhi',
          district: rec.district || 'New Delhi',
          tenderSource: 'GeM',
          tenderPortal: 'gem.gov.in',
          tenderUrl: 'https://gem.gov.in',
          product: rec.product || 'USHA Tailor Deluxe',
          quantity: Number(rec.quantity) || 100,
          estimatedValue: Number(rec.estimatedValue) || 580000,
          emdAmount: Number(rec.emdAmount) || 11600,
          tenderFee: 0,
          issueDate: new Date().toISOString().slice(0, 10),
          submissionDeadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          openingDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          eligibilityRequirements: 'Imported record eligibility criteria',
          technicalRequirements: 'Standard USHA specification compliance',
          financialRequirements: 'Standard turnover criteria',
          assignedEmployeeId: 'EMP-003',
          assignedEmployeeName: 'Amit Verma',
          priority: 'Medium',
          status: 'New',
          notes: 'Imported via CSV/Excel Data Import tool',
        });
        count++;
      });
    } else if (entityType === 'Customers') {
      records.forEach((rec) => {
        addCustomer({
          organizationName: rec.organizationName || rec.name || 'New Organization',
          department: rec.department || 'Rural Development',
          contactPerson: rec.contactPerson || 'Nodal Officer',
          designation: rec.designation || 'Director',
          phone: rec.phone || '+91 98000 00000',
          email: rec.email || 'contact@org.gov.in',
          address: rec.address || 'Civil Lines',
          state: rec.state || 'Delhi',
          district: rec.district || 'New Delhi',
          gstNumber: rec.gstNumber || '07AAAAA0000A1Z5',
          customerType: 'State Govt Department',
          notes: 'Imported from spreadsheet',
        });
        count++;
      });
    }

    addAuditLog('Bulk Data Import', entityType, 'BULK-IMPORT', `Imported ${count} records from spreadsheet`);
    return count;
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        dateFilter,
        setDateFilter,
        globalSearchQuery,
        setGlobalSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        employees,
        customers,
        products,
        stockMovements,
        tenders,
        orders,
        procurement,
        dispatches,
        invoices,
        payments,
        tasks,
        notifications,
        auditLogs,
        automationRules,
        masterDocuments,
        updateTenderStatus,
        addTender,
        updateTender,
        addCustomer,
        updateCustomer,
        createOrder,
        updateOrderStatus,
        adjustStock,
        createProcurementPO,
        receiveProcurement,
        createDispatch,
        updateDispatchStatus,
        recordPayment,
        addTask,
        updateTaskStatus,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        toggleAutomationRule,
        importSpreadsheetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
