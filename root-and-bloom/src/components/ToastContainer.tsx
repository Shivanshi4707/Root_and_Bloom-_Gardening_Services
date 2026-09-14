import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1A3828] text-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-black/20 border border-[#2B4E3A] flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="mt-0.5 text-[#8EA68B]">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#8FE388]" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#E79E67]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#A5C4D4]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm tracking-tight text-white">{toast.title}</h4>
            <p className="text-xs text-[#D1DDD3] mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8EA68B] hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
