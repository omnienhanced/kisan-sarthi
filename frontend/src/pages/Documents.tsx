import { useEffect, useState, DragEvent } from "react"
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../services/document.service"
import { supabase } from "../lib/supabase"
import {
  FileText,
  Trash2,
  Calendar,
  Eye,
  ArrowLeft,
  FolderOpen,
  Plus,
  AlertCircle,
  FileCheck,
  Upload,
  X,
  MousePointer2
} from "lucide-react"
import { useNavigate } from "react-router-dom"

type Document = {
  id: string
  doc_type: string
  expiry_date: string | null
  is_custom?: boolean
}

const DOCUMENT_ORDER = ["aadhaar", "land_report", "seven_twelve", "bank_passbook", "soil_report"]
const DOC_LABELS: Record<string, string> = {
  aadhaar: "Aadhaar Card",
  land_report: "Land Report",
  seven_twelve: "7/12 Document",
  bank_passbook: "Bank Passbook",
  soil_report: "Soil Health Report",
}

const API_BASE = "http://127.0.0.1:8000/api/documents"

export default function Documents() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState<Document[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [docType, setDocType] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [customDocName, setCustomDocName] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fetchDocuments = async () => {
    try {
      setFetching(true)
      const { data } = await supabase.auth.getSession()
      if (!data.session) return
      const res = await getDocuments(data.session.access_token)
      setDocs(res)
    } catch {
      console.error("Failed to load documents")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  /* --- Drag and Drop Handlers --- */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !docType) return alert("Select type and file")
    try {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      if (!data.session) return
      const finalDocType = docType === "other" ? customDocName.toLowerCase().replace(/\s+/g, "_") : docType
      const formData = new FormData()
      formData.append("file", file); formData.append("doc_type", finalDocType)
      if (expiryDate) formData.append("expiry_date", expiryDate)
      await uploadDocument(formData, data.session.access_token)
      setFile(null); setDocType(""); setExpiryDate(""); setShowUpload(false)
      fetchDocuments()
    } catch {
      alert("Upload failed")
    } finally { setLoading(false) }
  }

  const handlePreview = async (id: string) => {
    const { data } = await supabase.auth.getSession()
    const res = await fetch(`${API_BASE}/${id}/preview`, { headers: { Authorization: `Bearer ${data.session?.access_token}` } })
    const json = await res.json(); window.open(json.signed_url, "_blank")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return
    const { data } = await supabase.auth.getSession()
    await deleteDocument(id, data.session?.access_token || "")
    fetchDocuments()
  }

  const standardDocs = DOCUMENT_ORDER.map(t => docs.find(d => d.doc_type === t)).filter(Boolean) as Document[]
  const otherDocs = docs.filter(d => !DOCUMENT_ORDER.includes(d.doc_type))

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-emerald-700 font-bold mb-6 hover:opacity-70 transition-opacity">
          <ArrowLeft size={20} /> Dashboard
        </button>

        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">DOCUMENT VAULT</h1>
            <p className="text-slate-500 font-medium">Secure storage for Kisan-Sarathi records</p>
          </div>
          <button onClick={() => setShowUpload(!showUpload)} className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-md ${showUpload ? "bg-slate-200 text-slate-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
            {showUpload ? <X size={20} /> : <Plus size={20} />} {showUpload ? "CANCEL" : "UPLOAD"}
          </button>
        </div>

        {showUpload && (
          <div className="bg-white p-8 rounded-[2rem] mb-10 border-2 border-emerald-100 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select className="w-full border-2 border-slate-50 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-bold" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="">Select Document</option>
                  {Object.entries(DOC_LABELS).map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                  <option value="other">Other (Custom)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                <input type="date" className="w-full border-2 border-slate-50 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-bold" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
            </div>

            {docType === "other" && (
              <input type="text" placeholder="Document Name" className="w-full border-2 border-slate-50 p-4 rounded-2xl mb-6 focus:ring-2 focus:ring-emerald-500 outline-none" value={customDocName} onChange={(e) => setCustomDocName(e.target.value)} />
            )}

            <div 
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`relative border-4 border-dashed p-10 rounded-[1.5rem] text-center mb-6 transition-all ${isDragging ? "border-emerald-500 bg-emerald-50 scale-[1.01]" : "border-slate-100 bg-slate-50 hover:bg-slate-100"}`}
            >
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-full ${isDragging ? "bg-emerald-500 text-white" : "bg-white text-slate-400 shadow-sm"}`}>
                  {isDragging ? <MousePointer2 size={32} /> : <Upload size={32} />}
                </div>
                <p className="font-black text-slate-600 tracking-tight">
                  {file ? <span className="text-emerald-600 underline">{file.name}</span> : "DRAG & DROP OR CLICK TO BROWSE"}
                </p>
              </div>
            </div>

            <button onClick={handleUpload} disabled={loading} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 disabled:bg-slate-200">
              {loading ? "UPLOADING..." : "FINALIZE UPLOAD"}
            </button>
          </div>
        )}

        <div className="space-y-12">
          <Section title="REQUIRED RECORDS" docs={standardDocs} isStandard={true} onPreview={handlePreview} onDelete={handleDelete} isExpired={isExpired} />
          {otherDocs.length > 0 && <Section title="ADDITIONAL RECORDS" docs={otherDocs} isStandard={false} onPreview={handlePreview} onDelete={handleDelete} isExpired={isExpired} />}
        </div>
      </div>
    </div>
  )
}

function Section({ title, docs, onPreview, onDelete, isExpired, isStandard }: any) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-black text-slate-300 uppercase tracking-[0.2em] text-sm italic">{title}</h2>
        <div className="h-[2px] flex-grow bg-slate-100"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc: any) => (
          <DocCard key={doc.id} doc={doc} label={isStandard ? DOC_LABELS[doc.doc_type] : doc.doc_type.replace(/_/g, " ")} expired={isExpired(doc.expiry_date)} onPreview={onPreview} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

function DocCard({ doc, label, expired, onPreview, onDelete }: any) {
  return (
    <div className={`group p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center ${expired ? "bg-red-50/50 border-red-100" : "bg-white border-slate-50 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:-translate-y-1"}`}>
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${expired ? "bg-red-100 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
          {expired ? <AlertCircle size={28} /> : <FileCheck size={28} />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-black uppercase text-xl leading-tight ${expired ? "text-red-900" : "text-slate-800"}`}>{label}</h3>
            {expired && <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-lg font-black animate-pulse">EXPIRED</span>}
          </div>
          {doc.expiry_date && (
            <div className={`flex items-center gap-2 font-bold text-xs ${expired ? "text-red-400" : "text-slate-400"}`}>
              <Calendar size={14} /> {new Date(doc.expiry_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onPreview(doc.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"><Eye size={22} /></button>
        <button onClick={() => onDelete(doc.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={22} /></button>
      </div>
    </div>
  )
}