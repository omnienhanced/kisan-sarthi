import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"
import {
  LayoutDashboard,
  Camera,
  FileText,
  Sprout,
  BadgeIndianRupee,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    label: "Soil Analysis",
    icon: <Camera size={20} />,
    path: "/upload",
  },
  {
    label: "Crop Advice",
    icon: <Sprout size={20} />,
    path: "/recommend",
  },
  {
    label: "My Documents",
    icon: <FileText size={20} />,
    path: "/documents",
  },
  {
    label: "Govt Schemes",
    icon: <BadgeIndianRupee size={20} />,
    path: "/schemes",
  },
  {
    label: "Insights",
    icon: <BarChart3 size={20} />,
    path: "/insights",
  },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [farmerName, setFarmerName] = useState("Farmer")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      const { data: farmer } = await supabase
        .from("farmers")
        .select("name")
        .eq("id", data.user.id)
        .single()

      setFarmerName(farmer?.name || "Farmer")
    }

    loadUser()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <>
      {/* Top Navbar (Mobile + Desktop) */}
      <header className="w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            🌾
          </div>
          <span className="font-bold text-lg">Kisan-Sarathi</span>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-6 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            🌾
          </div>
          <div>
            <h2 className="font-bold text-xl">Kisan-Sarathi</h2>
            <p className="text-xs text-gray-500">
              AI Companion for Farmers
            </p>
          </div>
        </div>

        {/* User */}
        <div className="mb-6 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500">Welcome</p>
          <p className="font-semibold text-green-700">
            {farmerName}
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-10 flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>
    </>
  )
}
