import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  IndianRupee,
  Truck,
  Boxes,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIBusinessAssistantModule: React.FC = () => {
  const { tenders, orders, invoices, products, tasks, customers } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'MSG-01',
      sender: 'assistant',
      text: `Hello! I am your Geo Digital OS Copilot. I have live operational access to your tenders, active supply-chain orders, warehouse stock, and treasury invoices.
      
Ask me any executive questions or select one of the suggested inquiries below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestedQuestions = [
    'How many tenders are closing this week?',
    'Which tenders have missing documents?',
    'What is our tender win rate this quarter?',
    'Which customers have overdue payments?',
    'What inventory is low and needs procurement?',
    'Show me all orders pending dispatch.',
    'Which state generated the most orders?',
    'Generate an executive management briefing for this month.',
  ];

  const handleSendMessage = async (promptText: string) => {
    const q = promptText.trim();
    if (!q) return;

    const userMsg: Message = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      // Gather live telemetry context
      const contextData = {
        totalTenders: tenders.length,
        tenders: tenders.map((t) => ({
          number: t.tenderNumber,
          org: t.organization,
          deadline: t.submissionDeadline,
          status: t.status,
          value: t.estimatedValue,
          docs: t.documentChecklist?.map((d) => ({ title: d.title, status: d.verificationStatus })),
        })),
        orders: orders.map((o) => ({
          number: o.orderNumber,
          customer: o.customerName,
          state: o.state,
          product: o.product,
          status: o.status,
          value: o.totalValue,
        })),
        invoices: invoices.map((i) => ({
          number: i.invoiceNumber,
          customer: i.customerName,
          value: i.invoiceValue,
          outstanding: i.outstandingAmount,
          status: i.paymentStatus,
          due: i.dueDate,
        })),
        products: products.map((p) => ({
          sku: p.sku,
          name: p.name,
          inStock: p.quantityAvailable,
          reserved: p.reservedQuantity,
          min: p.minimumStock,
          status: p.stockStatus,
        })),
        overdueTasks: tasks.filter((t) => t.status === 'Overdue').map((t) => ({ title: t.title, assigned: t.assignedEmployeeName })),
      };

      const response = await fetch('/api/ai/business-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          contextData,
        }),
      });

      const data = await response.json();
      const assistantText = data.answer || 'I could not synthesize an answer at this time. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          id: `AI-${Date.now()}`,
          sender: 'assistant',
          text: assistantText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `AI-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to connect to AI server. Please verify network connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 text-white shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/30 text-purple-300">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold">Executive AI Business Assistant</h1>
            <p className="text-xs text-purple-200">
              Grounded in live company database: Tenders, Inventory, Dispatches & PFMS Treasury
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-[11px] text-purple-200">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
          <span>Decision boundary: Requires human verification</span>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-purple-300 hover:bg-purple-50/60 transition whitespace-nowrap shadow-2xs"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-slate-50/80 text-slate-800'
              }`}
            >
              <div className="whitespace-pre-line prose-xs">{m.text}</div>
              <span
                className={`mt-2 block text-[10px] text-right ${
                  m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white">
              <RefreshCw className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Synthesizing enterprise data across modules...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputPrompt);
        }}
        className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-xs shrink-0"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask about closing tenders, low stock, overdue payments, orders..."
          className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50 transition shadow-xs"
        >
          <span>Send</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
