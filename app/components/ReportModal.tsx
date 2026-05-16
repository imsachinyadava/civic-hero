"use client";

import { X } from "lucide-react";
import ReportForm from "./ReportForm";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4">
      {/* 1. BLURRY BACKDROP */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* 2. THE MODAL CARD */}
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">New Report</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-2">
          {/* We pass onClose to the form so it can close the modal after submission */}
          <ReportForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}