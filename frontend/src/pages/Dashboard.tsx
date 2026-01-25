import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import {
  CloudSun,
  FileText,
  Sprout,
  Camera,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react"

const API_BASE_URL = "http://127.0.0.1:8000"

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [farmerName, setFarmerName] = useState<string>("Farmer")
  const [backendStatus, setBackendStatus] = useState<string>(
    "Checking backend..."
  )

  useEffect(() => {
    const loadUserAndBackend = async () => {
      // 🔐 Auth check
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        navigate("/login")
        return
      }

      // 👨‍🌾 Load farmer profile
      const { data: farmer } = await supabase
        .from("farmers")
        .select("name")
        .eq("id", data.user.id)
        .single()

      setFarmerName(farmer?.name || "Farmer")

      // 🔌 Backend health
      try {
        const res = await fetch(`${API_BASE_URL}/`)
        const json = await res.json()
        setBackendStatus(json.message || "Backend connected")
      } catch {
        setBackendStatus("Backend not reachable ❌")
      }

      setLoading(false)
    }

    loadUserAndBackend()
  }, [navigate])

  const actions = [
    {
      title: "Soil Analysis",
      desc: "Upload soil image for AI analysis",
      icon: <Camera className="text-green-600" />,
      link: "/upload",
      color: "bg-green-50",
    },
    {
      title: "My Documents",
      desc: "Land records & ID proofs",
      icon: <FileText className="text-blue-600" />,
      link: "/documents",
      color: "bg-blue-50",
    },
    {
      title: "Govt Schemes",
      desc: "Subsidies & explainer videos",
      icon: <LayoutDashboard className="text-purple-600" />,
      link: "/schemes",
      color: "bg-purple-50",
    },
    {
      title: "Crop Advice",
      desc: "AI-based crop recommendations",
      icon: <Sprout className="text-orange-600" />,
      link: "/recommend",
      color: "bg-orange-50",
    },
  ]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 🌾 Global Navbar */}
      <Navbar />

      {/* Main Dashboard */}
      <main className="flex-1 p-4 md:p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Namaste, {farmerName}! 👋
            </h1>
            <p className="text-gray-500">{backendStatus}</p>
          </div>

          <div className="hidden md:block bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-600">
              📍 Maharashtra, IN
            </span>
          </div>
        </header>

        {/* Weather Widget */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 text-white mb-10 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-90">Current Weather</p>
              <h3 className="text-4xl font-bold">28°C</h3>
              <p className="text-sm">
                Perfect conditions for sowing wheat.
              </p>
            </div>
            <CloudSun size={64} className="opacity-80" />
          </div>
        </div>

        {/* 🌱 Insights Placeholder (Charts will go here) */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-2">
            📊 Farm Insights
          </h2>
          <p className="text-gray-500 text-sm">
            Soil health, crop suitability, and recommendations will
            appear here after analysis.
          </p>

          {/* Next: Soil Radar Chart / Crop Bar Chart */}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.link)}
              className="group cursor-pointer bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
            >
              <div
                className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>

              <h3 className="font-bold text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {item.desc}
              </p>

              <div className="flex items-center text-green-600 text-sm font-semibold">
                Open <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
