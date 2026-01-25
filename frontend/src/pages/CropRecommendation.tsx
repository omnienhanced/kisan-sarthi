import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts"
import { 
  Sprout, Droplets, CloudSun, ArrowLeft, 
  BrainCircuit, Zap, Info, MapPin, Loader2, CheckCircle2,
  TrendingUp, Award, Calendar, ThermometerSun, Wind, Sparkles,
  Activity
} from "lucide-react"

type RecommendationResult = {
  crop: string
  soil_type: string
  nutrients: Record<string, number>
  recommendations: string[]
  water_need: string
  climate: string
  yield_potential: number
  growth_days: string
  difficulty: string
  market_price: string
}

const DUMMY_DATA: Record<string, RecommendationResult> = {
  Rice: {
    crop: "Rice",
    soil_type: "Loamy / Clay",
    climate: "Hot & Humid",
    water_need: "High",
    yield_potential: 85,
    growth_days: "120-150 days",
    difficulty: "Moderate",
    market_price: "₹25-30/kg",
    nutrients: { nitrogen: 82, phosphorus: 78, potassium: 75, sulphur: 70, ph: 68 },
    recommendations: ["Ensure standing water during early growth", "Ideal for monsoon season", "Transplant seedlings at 25-30 days"],
  },
  Wheat: {
    crop: "Wheat",
    soil_type: "Sandy Loam",
    climate: "Cool & Dry",
    water_need: "Medium",
    yield_potential: 78,
    growth_days: "110-130 days",
    difficulty: "Easy",
    market_price: "₹20-25/kg",
    nutrients: { nitrogen: 68, phosphorus: 72, potassium: 80, sulphur: 55, ph: 65 },
    recommendations: ["Add nitrogen fertilizer before sowing", "Maintain soil moisture during tillering", "Best sown in October-November"],
  },
  Potato: {
    crop: "Potato",
    soil_type: "Loose Sandy Loam",
    climate: "Cool Night Temps",
    water_need: "Regular",
    yield_potential: 90,
    growth_days: "90-120 days",
    difficulty: "Moderate",
    market_price: "₹15-25/kg",
    nutrients: { nitrogen: 75, phosphorus: 85, potassium: 90, sulphur: 60, ph: 55 },
    recommendations: ["Avoid waterlogging to prevent tuber rot", "High potassium required for size", "Earth up soil around plants"],
  },
  Tomato: {
    crop: "Tomato",
    soil_type: "Well-drained Fertile",
    climate: "Warm & Sunny",
    water_need: "Moderate",
    yield_potential: 72,
    growth_days: "60-85 days",
    difficulty: "Easy",
    market_price: "₹30-50/kg",
    nutrients: { nitrogen: 70, phosphorus: 80, potassium: 70, sulphur: 50, ph: 62 },
    recommendations: ["Use mulch to retain moisture", "Requires support/staking for vines", "Prune regularly for better yield"],
  },
  Peas: {
    crop: "Peas",
    soil_type: "Silt Loam",
    climate: "Very Cool",
    water_need: "Low",
    yield_potential: 65,
    growth_days: "60-70 days",
    difficulty: "Easy",
    market_price: "₹40-60/kg",
    nutrients: { nitrogen: 30, phosphorus: 60, potassium: 50, sulphur: 40, ph: 70 },
    recommendations: ["Nitrogen demand is low (Legume)", "Grow during peak winter", "Harvest when pods are plump"],
  },
  Maize: {
    crop: "Maize",
    soil_type: "Deep Alluvial",
    climate: "Warm & Sunny",
    water_need: "Medium-High",
    yield_potential: 88,
    growth_days: "80-110 days",
    difficulty: "Moderate",
    market_price: "₹18-22/kg",
    nutrients: { nitrogen: 90, phosphorus: 70, potassium: 65, sulphur: 45, ph: 64 },
    recommendations: ["Heavy nitrogen feeder", "Ensure good drainage", "Plant in rows for better pollination"],
  },
  Onion: {
    crop: "Onion",
    soil_type: "Friable Sandy",
    climate: "Mild/Moderate",
    water_need: "Consistent",
    yield_potential: 80,
    growth_days: "100-120 days",
    difficulty: "Moderate",
    market_price: "₹25-40/kg",
    nutrients: { nitrogen: 60, phosphorus: 65, potassium: 85, sulphur: 75, ph: 67 },
    recommendations: ["Sulphur is key for pungency/flavor", "Keep weed-free environment", "Stop watering 2 weeks before harvest"],
  }
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"]

const getFertilizerAdvice = (n: Record<string, number>) => {
  const f: string[] = []
  if (n.nitrogen < 80) f.push(`Nitrogen: ${n.nitrogen}% - Apply Urea`)
  if (n.phosphorus < 75) f.push(`Phosphorus: ${n.phosphorus}% - Apply DAP`)
  if (n.potassium < 80) f.push(`Potassium: ${n.potassium}% - Apply MOP`)
  if (n.sulphur < 60) f.push(`Sulphur: ${n.sulphur}% - Apply Gypsum`)
  if (f.length === 0) f.push("✓ Nutrient levels are within optimal range")
  return f
}

const CropRecommendation = () => {
  const [selectedCrop, setSelectedCrop] = useState("")
  const [data, setData] = useState<RecommendationResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [chartType, setChartType] = useState<'bar' | 'radar' | 'line'>('bar')
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    if (data) {
      setAnimateCards(true)
      setTimeout(() => setAnimateCards(false), 600)
    }
  }, [data])

  const nutrientChartData = data && Object.entries(data.nutrients).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
    fullMark: 100
  }))

  const runAnalysis = () => {
    if (!selectedCrop) return
    setIsAnalyzing(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 20
      })
    }, 150)

    setTimeout(() => {
      setData(DUMMY_DATA[selectedCrop] || null)
      setIsAnalyzing(false)
    }, 800)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-emerald-700 font-bold mb-6 hover:gap-3 transition-all group"
        >
          <ArrowLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <BrainCircuit size={40} className="animate-pulse" />
                  </div>
                  AI CROP ENGINE
                </h1>
                <p className="text-emerald-100 font-medium uppercase text-sm tracking-widest flex items-center gap-2">
                  <Sparkles size={16} />
                  Advanced Analysis & Smart Recommendations
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">📍 Maharashtra</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 shadow-inner">
              <div className="flex-1 flex items-center gap-3 bg-white px-5 py-1 rounded-xl border-2 border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
                <MapPin className="text-emerald-500" size={22} />
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full py-3 bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="">🌾 Choose Your Crop...</option>
                  {Object.keys(DUMMY_DATA).map(c => (
                    <option key={c} value={c}>🌱 {c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !selectedCrop}
                className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white px-10 py-4 rounded-xl font-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <Zap size={20} fill="white" />
                    GENERATE AI REPORT
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {isAnalyzing && (
              <div className="mb-8 bg-emerald-50 rounded-xl p-4 border border-emerald-200 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-emerald-700">Processing crop data...</span>
                  <span className="text-sm font-black text-emerald-600">{progress}%</span>
                </div>
                <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {data ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg transform transition-all hover:scale-105 ${animateCards ? 'animate-in zoom-in' : ''}`}>
                    <Award className="mb-2 opacity-80" size={24} />
                    <p className="text-xs opacity-90 font-bold uppercase tracking-wider">Yield Potential</p>
                    <p className="text-3xl font-black mt-1">{data.yield_potential}%</p>
                  </div>
                  
                  <div className={`bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg transform transition-all hover:scale-105 ${animateCards ? 'animate-in zoom-in delay-75' : ''}`}>
                    <Calendar className="mb-2 opacity-80" size={24} />
                    <p className="text-xs opacity-90 font-bold uppercase tracking-wider">Growth Period</p>
                    <p className="text-xl font-black mt-1">{data.growth_days}</p>
                  </div>
                  
                  <div className={`bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg transform transition-all hover:scale-105 ${animateCards ? 'animate-in zoom-in delay-150' : ''}`}>
                    <Activity className="mb-2 opacity-80" size={24} />
                    <p className="text-xs opacity-90 font-bold uppercase tracking-wider">Difficulty</p>
                    <p className="text-xl font-black mt-1">{data.difficulty}</p>
                  </div>
                  
                  <div className={`bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg transform transition-all hover:scale-105 ${animateCards ? 'animate-in zoom-in delay-200' : ''}`}>
                    <TrendingUp className="mb-2 opacity-80" size={24} />
                    <p className="text-xs opacity-90 font-bold uppercase tracking-wider">Market Price</p>
                    <p className="text-xl font-black mt-1">{data.market_price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column - Info */}
                  <div className="space-y-6">
                    {/* Climate & Soil */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 shadow-sm">
                      <h3 className="font-black text-emerald-900 mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                        <ThermometerSun size={18} />
                        Growing Conditions
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-tight mb-2">Water Need</p>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                            <Droplets className="text-blue-500" size={20}/> 
                            <span className="text-lg">{data.water_need}</span>
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-tight mb-2">Climate</p>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                            <CloudSun className="text-orange-500" size={20}/> 
                            <span className="text-lg">{data.climate}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-tight">Soil Type</p>
                          <p className="font-bold text-slate-800 text-lg">{data.soil_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-tight">Soil pH</p>
                          <p className="font-bold text-emerald-600 text-2xl">{(data.nutrients.ph / 10).toFixed(1)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fertilization Plan */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
                      <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <Info className="text-emerald-600" size={18} /> 
                        Fertilization Strategy
                      </h3>
                      <div className="space-y-3">
                        {getFertilizerAdvice(data.nutrients).map((f, i) => (
                          <div 
                            key={i} 
                            className="flex items-start gap-3 bg-gradient-to-r from-slate-50 to-emerald-50 p-4 rounded-xl text-slate-700 font-semibold border border-slate-100 text-sm hover:shadow-md transition-all group"
                          >
                            <CheckCircle2 className="text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                      <h3 className="font-black text-blue-900 mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                        <Sparkles size={18} />
                        Expert Tips
                      </h3>
                      <div className="space-y-3">
                        {data.recommendations.map((rec, i) => (
                          <div 
                            key={i}
                            className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all group"
                          >
                            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                              {i + 1}
                            </div>
                            <p className="text-sm text-slate-700 font-medium">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Chart */}
                  <div className={`rounded-2xl p-6 shadow-2xl relative overflow-hidden border-4 ${
                    chartType === 'bar' 
                      ? 'bg-white border-slate-200' 
                      : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
                  }`}>
                    {chartType !== 'bar' && (
                      <>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"></div>
                      </>
                    )}
                    
                    <div className="relative z-10">
                      <div className="mb-6">
                        <h3 className={`font-bold text-xl tracking-tight mb-1 ${
                          chartType === 'bar' ? 'text-slate-800' : 'text-white'
                        }`}>Nutrient Analysis</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${
                          chartType === 'bar' ? 'text-slate-600' : 'text-slate-400'
                        }`}>Current Soil Composition (%)</p>
                      </div>

                      {/* Chart Type Selector */}
                      <div className={`flex gap-2 mb-6 p-1 rounded-xl ${
                        chartType === 'bar' ? 'bg-slate-100' : 'bg-slate-800/50'
                      }`}>
                        {(['bar', 'radar', 'line'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs uppercase transition-all ${
                              chartType === type
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : chartType === 'bar'
                                  ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartType === 'bar' ? (
                            <BarChart data={nutrientChartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#334155', fontWeight: 800, fontSize: 11}} 
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{fill: '#334155', fontWeight: 600, fontSize: 10}}
                                domain={[0, 100]}
                                stroke="#334155"
                              />
                              <Tooltip 
                                cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                                contentStyle={{
                                  backgroundColor: '#ffffff', 
                                  borderRadius: '12px', 
                                  border: '2px solid #e2e8f0', 
                                  color: '#1e293b',
                                  fontWeight: 'bold'
                                }}
                              />
                              <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                                {nutrientChartData?.map((_, index) => (
                                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          ) : chartType === 'radar' ? (
                            <RadarChart data={nutrientChartData}>
                              <PolarGrid stroke="#334155" />
                              <PolarAngleAxis 
                                dataKey="name" 
                                tick={{fill: '#FFFFFF', fontWeight: 700, fontSize: 11}}
                              />
                              <PolarRadiusAxis 
                                domain={[0, 100]} 
                                tick={{fill: '#FFFFFF', fontWeight: 600}}
                              />
                              <Radar
                                dataKey="value"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.6}
                                strokeWidth={3}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#1e293b', 
                                  borderRadius: '12px', 
                                  border: '2px solid #334155', 
                                  color: '#fff',
                                  fontWeight: 'bold'
                                }}
                              />
                            </RadarChart>
                          ) : (
                            <LineChart data={nutrientChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                              <XAxis 
                                dataKey="name" 
                                tick={{fill: '#FFFFFF', fontWeight: 800, fontSize: 11}} 
                              />
                              <YAxis 
                                domain={[0, 100]} 
                                tick={{fill: '#FFFFFF', fontWeight: 600, fontSize: 10}}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#1e293b', 
                                  borderRadius: '12px', 
                                  border: '2px solid #334155', 
                                  color: '#fff',
                                  fontWeight: 'bold'
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 6 }}
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-6 flex justify-between items-center p-4 rounded-xl ${
                        chartType === 'bar' ? 'bg-slate-100' : 'bg-slate-800/50'
                      }">
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          chartType === 'bar' ? 'text-slate-700' : 'text-white'
                        }`}>
                          AI Precision Mode
                        </span>
                        <div className="flex gap-1.5">
                          {COLORS.map(c => (
                            <div key={c} className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: c}} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="py-32 text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200 animate-pulse">
                  <Sprout size={64} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-wide mb-2">Ready to Analyze</h3>
                <p className="text-slate-400 text-sm font-bold">Select a crop from the dropdown to generate your personalized report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropRecommendation