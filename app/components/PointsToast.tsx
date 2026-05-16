"use client";

import { Zap } from "lucide-react";

export const showPointsToast = (amount: number) => {
  // We can trigger this from any component
  const toast = document.createElement("div");
  toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300";
  toast.innerHTML = `
    <div class="bg-amber-500 p-1.5 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    </div>
    <span class="font-black tracking-tight text-sm">+${amount} CIVIC POINTS</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("animate-out", "fade-out", "slide-out-to-bottom-4");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};