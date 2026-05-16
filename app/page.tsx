"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import LocalFeed from "./components/LocalFeed";
import ReportModal from "./components/ReportModal";
import Navbar from "./components/Navbar";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="px-4 pb-24">
        <LocalFeed />
      </div>

      {/* --- FLOATING ACTION BUTTON (FAB) --- */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-[90] bg-blue-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:-translate-y-1 active:scale-90 transition-all duration-300 flex items-center gap-2 group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold pr-2 hidden sm:block">Report Issue</span>
      </button>

      {/* --- THE POPUP --- */}
      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}