import { useState, useRef } from "react"
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Leaf,
  ArrowLeft,
  Loader2,
  Droplets,
  Thermometer,
  Zap,
  TrendingUp,
  Info,
  Download,
  Share2
} from "lucide-react"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell
} from "recharts"

const SoilAnalysis = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<'radar' | 'bar'>('radar')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setError(null)
      setResult(null)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image first")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    // Simulate API call with demo data
    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      const demoResult = `Soil Analysis Report
━━━━━━━━━━━━━━━━━━━━

🌱 Soil Type: Loamy soil with good drainage
📊 Overall Health: Good (75/100)

Nutrient Levels:
• Nitrogen (N): 68% - Moderate
• Phosphorus (P): 72% - Good  
• Potassium (K): 65% - Moderate
• Sulphur (S): 58% - Fair
• pH Level: 6.8 - Slightly acidic (Optimal)

💧 Moisture Content: 45% - Adequate
🌡️ Organic Matter: 3.2% - Good

Recommendations:
✓ Add organic compost to boost Nitrogen
✓ Maintain current irrigation schedule
✓ Suitable for wheat, rice, and vegetables
✓ Consider adding lime if pH drops below 6.5`

      setResult(demoResult)
      setLoading(false)
    }, 2500)
  }

  const inferredChartData = result
    ? [
        { mineral: "Nitrogen", value: 68, optimal: 80, color: "#22c55e" },
        { mineral: "Phosphorus", value: 72, optimal: 80, color: "#3b82f6" },
        { mineral: "Potassium", value: 65, optimal: 80, color: "#f59e0b" },
        { mineral: "Sulphur", value: 58, optimal: 80, color: "#8b5cf6" },
        { mineral: "pH", value: 70, optimal: 75, color: "#ec4899" },
      ]
    : []

  const healthMetrics = result
    ? [
        { label: "Overall Health", value: 75, icon: <Leaf />, color: "text-green-600" },
        { label: "Moisture", value: 45, icon: <Droplets />, color: "text-blue-600" },
        { label: "Fertility", value: 68, icon: <Zap />, color: "text-yellow-600" },
        { label: "Organic Matter", value: 65, icon: <TrendingUp />, color: "text-purple-600" },
      ]
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-all hover:gap-3 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-600 to-green-500 text-white">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Leaf size={28} />
                  </div>
                  AI Soil Analysis
                </h1>
                <p className="text-sm text-green-50 mt-2">
                  Upload a clear photo of your farm soil for instant AI-powered insights
                </p>
              </div>

              <div className="p-6">
                {/* Upload Area */}
                {!preview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-all relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100/0 via-green-100/50 to-green-100/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={48} className="text-green-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-700 mb-2">
                        Click to upload soil image
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG (Max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-black group">
                      <img
                        src={preview}
                        alt="Soil preview"
                        className="w-full h-96 object-contain"
                      />
                      {!loading && (
                        <button
                          onClick={clearFile}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <X size={20} />
                        </button>
                      )}
                      {file && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-white text-sm font-medium">{file.name}</p>
                          <p className="text-gray-300 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {loading && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-700">Analyzing soil sample...</span>
                          <span className="text-sm font-bold text-green-600">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200 animate-in slide-in-from-top">
                    <AlertCircle size={20} /> 
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !file}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Analyzing Soil...
                    </>
                  ) : (
                    <>
                      <Zap size={24} />
                      Start AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                {/* Text Result */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <CheckCircle2 size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Analysis Complete</h3>
                          <p className="text-sm text-gray-600">Detailed soil health report</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Download size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Share2 size={20} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                      {result}
                    </pre>
                  </div>
                </div>

                {/* Visual Charts */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Nutrient Visualization</h3>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setActiveTab('radar')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                          activeTab === 'radar' 
                            ? 'bg-white text-green-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Radar View
                      </button>
                      <button
                        onClick={() => setActiveTab('bar')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                          activeTab === 'bar' 
                            ? 'bg-white text-green-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Bar Chart
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {activeTab === 'radar' ? (
                      <div className="h-96">
                        <ResponsiveContainer>
                          <RadarChart data={inferredChartData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="mineral" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                            <Radar
                              dataKey="value"
                              stroke="#16a34a"
                              fill="#16a34a"
                              fillOpacity={0.6}
                              strokeWidth={2}
                            />
                            <Radar
                              dataKey="optimal"
                              stroke="#94a3b8"
                              fill="#94a3b8"
                              fillOpacity={0.2}
                              strokeWidth={1}
                              strokeDasharray="5 5"
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-96">
                        <ResponsiveContainer>
                          <BarChart data={inferredChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="mineral" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]}>
                              {inferredChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                            <Bar dataKey="optimal" fill="#94a3b8" radius={[8, 8, 0, 0]} opacity={0.3} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                      <Info size={14} />
                      Visual estimates derived from AI analysis. Dotted/gray lines show optimal levels.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Metrics */}
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-in fade-in slide-in-from-right">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Health Metrics</h3>
                <div className="space-y-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`${metric.color}`}>
                            {metric.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Info Card */
              <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl shadow-lg p-6 text-white">
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                  <Info size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">How It Works</h3>
                <ul className="space-y-3 text-sm text-green-50">
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">1.</span>
                    <span>Take a clear photo of your soil sample</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">2.</span>
                    <span>Upload the image to our AI system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">3.</span>
                    <span>Get instant analysis of nutrients and pH</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">4.</span>
                    <span>Receive personalized crop recommendations</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📸 Photo Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Thermometer size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Take photos in good natural lighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Droplets size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Capture fresh soil from 6-8 inches deep</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Remove any debris or plant matter</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Fill frame with soil sample</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoilAnalysis