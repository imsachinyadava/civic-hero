"use client";

import { useState, useRef } from "react";
import { CheckCircle, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { showPointsToast } from "./PointsToast";

// 1. Define the props structure for TypeScript
interface ResolveFormProps {
  reportId: number;
}

// 2. Accept 'reportId' as a typed destructured prop
export default function ResolveForm({ reportId }: ResolveFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Added for a beautiful UI preview
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Generates temporary preview URL
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`/api/reports/${reportId}/resolve`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showPointsToast(50); // Celebrate!
        setFile(null);
        setPreview(null);
        router.refresh(); // Tells Next.js to pull fresh data from the server
      } else {
        alert("Failed to submit resolution.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <CheckCircle className="text-emerald-500" size={24} />
        <h3 className="font-bold text-slate-900">Mark as Resolved</h3>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*"
        capture="environment" // Instantly pulls up native phone camera on mobile
        className="hidden" 
        onChange={handleFileChange} 
      />
      
      <form onSubmit={handleResolve} className="space-y-4">
        <button 
          type="button" // Prevents empty form triggers
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-all bg-slate-50/50 overflow-hidden"
        >
          {preview ? (
            <img src={preview} alt="Fix snapshot" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera size={28} className="mb-2" />
              <span className="text-sm font-bold">Snap the fix</span>
            </>
          )}
        </button>

        <button 
          type="submit"
          disabled={!file || loading}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Submit Resolution"
          )}
        </button>
      </form>
    </div>
  );
}