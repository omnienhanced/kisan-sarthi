import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import {
  CheckCircle,
  XCircle,
  FileText,
  PlayCircle,
  MapPin,
  Wheat
} from "lucide-react"

const API = "http://127.0.0.1:8000/api/schemes"

type Scheme = {
  id: string
  scheme_name: string
  state: string
  crop_type: string
  summary_text: string
  required_documents: string[]
  available_documents: string[]
  missing_documents: string[]
  is_eligible: boolean
}

export default function Schemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return

      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      })

      setSchemes(await res.json())
    }

    load()
  }, [])

  const playVideo = async (schemeId: string) => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) return

    const res = await fetch(`${API}/${schemeId}/video`, {
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
      },
    })

    const json = await res.json()
    setVideoUrl(json.video_url)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-6">🏛 Government Schemes</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {schemes.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-xl font-black">{s.scheme_name}</h2>

            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {s.state}
              </span>
              <span className="flex items-center gap-1">
                <Wheat size={14} /> {s.crop_type}
              </span>
            </div>

            <p className="mt-3 text-gray-700">{s.summary_text}</p>

            <div className="mt-4">
              <p className="font-bold mb-1">Required Documents</p>

              {s.required_documents.map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-sm">
                  {s.available_documents.includes(doc) ? (
                    <CheckCircle className="text-green-600" size={18} />
                  ) : (
                    <XCircle className="text-red-500" size={18} />
                  )}
                  <span className="capitalize">{doc.replace("_", " ")}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span
                className={`font-bold ${
                  s.is_eligible ? "text-green-600" : "text-red-500"
                }`}
              >
                {s.is_eligible ? "Eligible ✅" : "Missing Documents ❌"}
              </span>

              <button
                onClick={() => playVideo(s.id)}
                className="flex items-center gap-2 text-blue-600 font-bold"
              >
                <PlayCircle /> Watch Video
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {videoUrl && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-white p-4 rounded-xl w-[80%]">
            <video src={videoUrl} controls autoPlay className="w-full" />
            <button
              onClick={() => setVideoUrl(null)}
              className="mt-2 text-red-600 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
