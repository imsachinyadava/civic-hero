"use client";

import { useState, useRef } from "react";
import { Camera, MapPin, Loader2, CheckCircle, AlertTriangle, Send, ImagePlus, AlignLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Added onSuccess prop to handle modal closing
export default function ReportForm({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState(""); 
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const getLocation = () => {
    setLocating(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocating(false);
        },
        (err) => {
          console.error(err);
          setError("Could not get your location. Please enable GPS.");
          setLocating(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category || !location) {
      setError("Please fill out the category, snap a photo, and tag your location.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    formData.append("description", description); 

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Trigger the points reward logic
        await fetch("/api/user/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 20 })
        });

        setFile(null);
        setPreview(null);
        setCategory("");
        setDescription("");
        setLocation(null);
        
        router.refresh(); 
        
        // Call the success callback to close the modal
        if (onSuccess) onSuccess();
        
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start border border-red-100">
            <AlertTriangle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
            {error}
          </div>
        )}

        {/* CATEGORY SELECTOR */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Issue Type</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none font-medium text-sm"
            >
              <option value="" disabled>Select a category...</option>
              <option value="pothole">Potholes & Roads</option>
              <option value="garbage">Illegal Dumping / Garbage</option>
              <option value="street_light">Broken Street Light</option>
              <option value="water_leak">Water Pipe Leak</option>
              <option value="vandalism">Graffiti / Vandalism</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* DESCRIPTION FIELD */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 flex justify-between items-center">
            <span>Additional Details</span>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">Optional</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-4 text-slate-400">
              <AlignLeft size={18} />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., It's right in front of the blue house..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm resize-none placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* PHOTO UPLOAD ZONE */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Photographic Proof</label>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            className="hidden" 
          />
          
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group min-h-[140px]"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <ImagePlus className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Tap to snap a photo</span>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
              <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* LOCATION BUTTON */}
        <div className="space-y-2 pb-2">
          <button
            type="button"
            onClick={getLocation}
            className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 ${
              location 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm" 
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-sm"
            }`}
          >
            {locating ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : location ? (
              <CheckCircle className="mr-2 text-emerald-500" size={18} />
            ) : (
              <MapPin className="mr-2 text-slate-400" size={18} />
            )}
            {locating ? "GPS..." : location ? "Location Secured" : "Tag Location"}
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || !file || !category || !location}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <Send className="mr-2" size={18} />
              Post Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}