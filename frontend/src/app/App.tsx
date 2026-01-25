import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import Dashboard from "../pages/Dashboard"
import SoilAnalysis from "../pages/SoilAnalysis"
import Documents from "../pages/Documents"
import Schemes from "../pages/Schemes"
import AdminSchemes from "../pages/AdminSchemes"
import CropRecommendation from "../pages/CropRecommendation"
import Insights from "../pages/Insights"
const App = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Main App Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Changed this to /upload to match your Dashboard links, 
         or you can change the link in Dashboard.tsx to /soil-analysis 
      */}
      <Route path="/upload" element={<SoilAnalysis />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/schemes" element={<Schemes/>} />
      <Route path="/admin/schemes" element={<AdminSchemes />} />
      <Route path="/recommend" element={<CropRecommendation />} />
      <Route path="/insights" element={<Insights/>} />
      
      {/* Catch-all: send unknown routes back to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App