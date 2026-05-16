"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MapPin, AlertCircle, Clock, ThumbsUp } from "lucide-react";

interface Report {
  id: number;
  category: string;
  image_url: string;
  status: string;
  created_at: string;
  distance_meters: number;
  upvotes: string | number; 
  reporter_id: string;
}

export default function LocalFeed() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearbyReports(latitude, longitude);
        },
        (err) => {
          console.error(err);
          setError("Please enable location services to see nearby issues.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const fetchNearbyReports = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/reports?lat=${lat}&lng=${lng}&radius=5000`);
      const data = await response.json();

      if (response.ok) {
        setReports(data.reports);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reportId: number) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/upvote`, { 
        method: "POST" 
      });
      const data = await response.json();

      if (response.ok) {
        setReports(currentReports => 
          currentReports.map(report => 
            report.id === reportId 
              ? { ...report, upvotes: Number(report.upvotes) + 1 } 
              : report
          )
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Upvote failed", error);
      alert("Failed to verify issue.");
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  if (loading) {
    return <div className="text-center py-10 animate-pulse text-slate-500 font-medium">Scanning your area for issues...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <h2 className="text-xl font-extrabold text-slate-800 px-2 flex items-center tracking-tight">
        <MapPin className="mr-2 text-blue-600" />
        Issues Near You
      </h2>

      {reports.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 text-center text-slate-500 transition-all hover:shadow-md">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-green-500" size={32} />
          </div>
          <p className="font-semibold text-slate-700">No issues reported within 5km.</p>
          <p className="text-sm mt-1 text-slate-400">Your neighborhood is looking pristine!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
              
              {/* 1. CLICKABLE LINK FOR DETAILS */}
              <Link href={`/report/${report.id}`} className="block">
                <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
                  <img 
                    src={report.image_url} 
                    alt={report.category} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black shadow-md uppercase tracking-wider ${
                    report.status === 'open' ? 'bg-red-500 text-white' : 
                    report.status === 'resolved' ? 'bg-emerald-500 text-white' : 
                    'bg-amber-500 text-white'
                  }`}>
                    {report.status}
                  </span>
                </div>
                
                <div className="p-5 pb-2">
                  <h3 className="font-bold text-lg text-slate-800 capitalize group-hover:text-blue-600 transition-colors">
                    {report.category.replace('_', ' ')}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-3 text-sm font-medium text-slate-500">
                    <span className="flex items-center text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg">
                      <MapPin size={14} className="mr-1.5" />
                      {formatDistance(report.distance_meters)}
                    </span>
                    <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Clock size={14} className="mr-1.5" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>

              {/* 2. VERIFY BUTTON */}
              <div className="px-5 pb-5 pt-3">
                <div className="pt-4 border-t border-slate-100/80">
                  <button 
                    onClick={() => handleUpvote(report.id)}
                    className="w-full flex items-center justify-center py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 text-slate-600 hover:text-blue-700 border border-slate-200/60 rounded-xl transition-all duration-200 font-semibold text-sm active:scale-95 shadow-sm group/btn"
                  >
                    <ThumbsUp size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                    Verify Issue • <span className="ml-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">{report.upvotes || 0}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}