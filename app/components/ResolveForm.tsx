"use client";

import { useState, useRef } from "react";
import { CheckCircle, Camera, Loader2 } from "lucide-react";

export default function ResolveForm() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <CheckCircle className="text-emerald-500" size={24} />
        <h3 className="font-bold text-slate-900">Mark as Resolved</h3>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      
      <div className="space-y-4">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-all bg-slate-50/50"
        >
          {file ? <span className="text-emerald-600 font-bold text-sm">✓ {file.name}</span> : (
            <>
              <Camera size={28} className="mb-2" />
              <span className="text-sm font-bold">Snap the fix</span>
            </>
          )}
        </button>

        <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">
          Submit Resolution
        </button>
      </div>
    </div>
  );
}