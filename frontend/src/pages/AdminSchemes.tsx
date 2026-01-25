import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Sprout, 
  Video, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  LayoutDashboard,
  AlertCircle,
  ChevronRight,
  Leaf
} from "lucide-react"

const DOCUMENT_OPTIONS = [
  { key: "aadhaar", label: "Aadhaar Card" },
  { key: "land_record", label: "Land Record (7/12)" },
  { key: "bank_passbook", label: "Bank Passbook" },
  { key: "soil_report", label: "Soil Health Report" },
]

export default function AdminSchemes() {
  const navigate = useNavigate()

  const [schemeName, setSchemeName] = useState("")
  const [state, setState] = useState("")
  const [cropType, setCropType] = useState("")
  const [summary, setSummary] = useState("")
  const [video, setVideo] = useState<File | null>(null)
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [customDocs, setCustomDocs] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleDoc = (key: string) => {
    setSelectedDocs(prev =>
      prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
    )
  }

  const submit = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await supabase.auth.getSession()
      if (!data.session) throw new Error("Not logged in")

      const custom = customDocs.split(",").map(d => d.trim()).filter(Boolean)
      const allRequiredDocs = [...selectedDocs, ...custom]

      const formData = new FormData()
      formData.append("scheme_name", schemeName)
      formData.append("state", state)
      formData.append("crop_type", cropType)
      formData.append("summary_text", summary)
      formData.append("required_documents", allRequiredDocs.join(","))
      if (video) formData.append("video", video)

      const res = await fetch("http://127.0.0.1:8000/api/admin/schemes", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        body: formData,
      })

      if (!res.ok) throw new Error(await res.text())
      alert("Scheme created successfully")
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Updated Background Color to Light Moss Finish
    <div className="min-h-screen bg-[#F4F7ED] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 text-emerald-900 font-black uppercase tracking-tighter hover:text-emerald-600 transition-all"
          >
            <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2 bg-[#E8EDDB] text-[#4B5E26] px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] border border-[#D9E2C1]">
            <ShieldCheck size={14} /> Admin Secure-Node
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="mb-12 relative flex items-center gap-4">
          <div className="bg-emerald-600 p-4 rounded-3xl text-white shadow-xl shadow-emerald-200/50">
            <Leaf size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-[#1A2E05] italic tracking-tighter">
              PUBLISH <span className="text-emerald-600 underline decoration-wavy decoration-amber-400">SCHEME</span>
            </h1>
            <p className="text-[#6B7C4A] font-bold uppercase text-[11px] tracking-[0.3em] mt-1">Grow your digital agricultural ecosystem</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-8 flex items-center gap-3 animate-pulse">
            <AlertCircle className="text-red-500" />
            <p className="text-red-700 font-black uppercase text-xs">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN FORM AREA */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION 1: IDENTITY */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_-15px_rgba(75,94,38,0.1)] border border-[#E2E8D3] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-700">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight text-[#1A2E05]">Scheme Metadata</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-[#8BA166] uppercase tracking-[0.2em] ml-2">Official Title</label>
                  <input 
                    className="w-full bg-[#F9FBFA] border-2 border-transparent p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-lg text-slate-800 shadow-inner" 
                    placeholder="e.g. Kisan Samman Nidhi" 
                    onChange={e => setSchemeName(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8BA166] uppercase tracking-[0.2em] ml-2">Regional Scope</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                    <input 
                      className="w-full bg-[#F9FBFA] border-2 border-transparent p-5 pl-12 rounded-[1.5rem] outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-800 shadow-inner" 
                      placeholder="Enter State" 
                      onChange={e => setState(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8BA166] uppercase tracking-[0.2em] ml-2">Crop Focus</label>
                  <div className="relative">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                    <input 
                      className="w-full bg-[#F9FBFA] border-2 border-transparent p-5 pl-12 rounded-[1.5rem] outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-800 shadow-inner" 
                      placeholder="e.g. Rice, Wheat" 
                      onChange={e => setCropType(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CONTENT */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_-15px_rgba(75,94,38,0.1)] border border-[#E2E8D3] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
                  <LayoutDashboard size={24} />
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight text-[#1A2E05]">Full Description</h2>
              </div>
              
              <textarea 
                className="w-full bg-[#F9FBFA] border-2 border-transparent p-6 rounded-[2rem] outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold min-h-[180px] text-slate-700 shadow-inner" 
                placeholder="Paste the full text of the scheme. AI will handle the translation and summary..." 
                onChange={e => setSummary(e.target.value)} 
              />
            </div>
          </div>

          {/* SIDEBAR: MEDIA & SUBMIT */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* DOCS SELECTOR */}
            <div className="bg-[#1A2E05] text-white rounded-[3rem] p-8 shadow-2xl shadow-emerald-900/20">
               <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <CheckCircle2 size={16} /> Prerequisites
               </h3>
               
               <div className="space-y-3 mb-6">
                 {DOCUMENT_OPTIONS.map(doc => {
                   const active = selectedDocs.includes(doc.key);
                   return (
                     <button
                        key={doc.key}
                        onClick={() => toggleDoc(doc.key)}
                        className={`w-full p-4 rounded-2xl border transition-all flex justify-between items-center group ${
                          active ? "border-emerald-500 bg-emerald-500/20" : "border-emerald-900/50 hover:border-emerald-500/50"
                        }`}
                     >
                       <span className={`text-xs font-black uppercase italic tracking-tight ${active ? "text-emerald-400" : "text-[#8BA166]"}`}>{doc.label}</span>
                       <div className={`w-2 h-2 rounded-full ${active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" : "bg-emerald-900"}`}></div>
                     </button>
                   )
                 })}
               </div>

               <input 
                  className="w-full bg-emerald-900/30 border border-emerald-800/50 p-4 rounded-xl outline-none focus:border-emerald-500 font-bold text-xs text-emerald-100 placeholder:text-[#4B5E26]" 
                  placeholder="Additional Docs (Commas)..." 
                  value={customDocs}
                  onChange={e => setCustomDocs(e.target.value)}
                />
            </div>

            {/* VIDEO UPLOAD */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#E2E8D3] shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-900">
                  <Video size={80} />
               </div>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative">
                 <Video size={16} className="text-amber-500" /> Multimodal Explainer
               </h3>
               
               <div className="relative border-4 border-dashed border-[#F4F7ED] p-6 rounded-3xl text-center bg-[#F9FBFA] hover:bg-[#F4F7ED] hover:border-emerald-200 transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    onChange={e => setVideo(e.target.files?.[0] || null)} 
                  />
                  <Video size={24} className="mx-auto text-slate-300 group-hover:text-emerald-600 mb-2 transition-all" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter break-all">
                    {video ? <span className="text-emerald-700 font-black">{video.name}</span> : "Upload MP4/MOV"}
                  </p>
               </div>
            </div>

            <button 
              onClick={submit} 
              disabled={loading} 
              className="w-full bg-emerald-600 hover:bg-[#1A2E05] text-white py-8 rounded-[3rem] font-black text-xl shadow-[0_20px_50px_-15px_rgba(16,185,129,0.4)] transition-all active:scale-[0.96] disabled:bg-slate-300 uppercase italic flex items-center justify-center gap-3 border-b-4 border-emerald-800"
            >
              {loading ? "SAVING..." : "LIVE PUBLISH"}
              <ChevronRight size={24} />
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}