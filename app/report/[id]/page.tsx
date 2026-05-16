import { Pool } from "pg";
import { MapPin, Clock, ArrowLeft, AlertTriangle, AlignLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import ResolveForm from "../../components/ResolveForm";
import CommentSection from "../../components/CommentSection";
import ShareButton from "../../components/ShareButton";
import PingAuthority from "../../components/PingAuthority";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function ReportPage({ params }: { params: { id: string } }) {
  const reportId = parseInt(params.id);

  const query = `
    SELECT 
      r.id, r.category, r.image_url, r.status, r.created_at, r.description, r.resolved_image_url,
      ST_AsText(r.location) as location_text,
      COUNT(u.id) as upvotes
    FROM reports r
    LEFT JOIN upvotes u ON r.id = u.report_id
    WHERE r.id = $1
    GROUP BY r.id;
  `;
  
  const dbResponse = await pool.query(query, [reportId]);
  const report = dbResponse.rows[0];

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Report Not Found</h1>
        <Link href="/" className="mt-4 text-blue-600 hover:underline font-medium">Go back home</Link>
      </div>
    );
  }

  const coords = report.location_text?.match(/\((.*?)\)/)?.[1].split(' ').reverse().join(',');

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50 shadow-sm px-4 py-4 mb-6 transition-all duration-300">
        <div className="max-w-md mx-auto flex items-center">
          <Link href="/" className="text-slate-400 hover:text-blue-600 transition-colors mr-4 bg-slate-100 p-2 rounded-full hover:bg-blue-50">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-bold text-lg tracking-tight text-slate-800">Issue Details</span>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
          
          <div className="h-72 w-full bg-slate-200 relative overflow-hidden group">
            <img 
              src={report.image_url} 
              alt={report.category} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest ${
              report.status === 'open' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {report.status}
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 capitalize tracking-tight mb-3">
                {report.category.replace('_', ' ')}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center text-[12px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                  <Clock size={14} className="mr-1.5 text-slate-400" />
                  {new Date(report.created_at).toLocaleDateString('en-IN', { 
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
                
                <a 
                  href={`https://www.google.com/maps?q=${coords}`}
                  target="_blank"
                  className="flex items-center text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <MapPin size={14} className="mr-1.5" />
                  View on Map
                </a>
              </div>
            </div>

            {report.description && (
              <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 italic shadow-inner">
                <p className="text-slate-600 text-sm leading-relaxed">
                  "{report.description}"
                </p>
              </div>
            )}

            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
              <span className="font-bold text-indigo-900 text-xs uppercase tracking-widest">Neighborhood Verification</span>
              <span className="bg-white text-indigo-700 border border-indigo-200 py-1.5 px-4 rounded-xl font-black text-sm shadow-sm">
                {report.upvotes} UPVOTES
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {report.status === 'open' ? (
                <ResolveForm reportId={report.id} />
              ) : (
                report.resolved_image_url && (
                  <div className="bg-emerald-50 rounded-[32px] p-5 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-3 flex items-center">
                      <CheckCircle className="mr-2 text-emerald-500" size={20} />
                      Solution Verified
                    </h3>
                    <img src={report.resolved_image_url} className="w-full h-48 object-cover rounded-2xl shadow-md border-2 border-white" />
                  </div>
                )
              )}

              <ShareButton reportId={report.id} category={report.category} />
              <PingAuthority category={report.category} reportId={report.id} />
            </div>
            
            <CommentSection reportId={report.id} />
          </div>
        </div>
      </div>
    </main>
  );
}