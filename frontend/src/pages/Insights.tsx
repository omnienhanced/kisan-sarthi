import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft, TrendingUp, Droplets, Leaf, 
  Wind, Thermometer, Info, Download, 
  BarChart3, PieChart as PieChartIcon
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area
} from "recharts"

const NUTRIENT_DATA = [
  { name: 'Nitrogen', value: 78, color: '#10b981' },
  { name: 'Phosphorus', value: 65, color: '#3b82f6' },
  { name: 'Potassium', value: 82, color: '#f59e0b' },
  { name: 'Sulphur', value: 45, color: '#8b5cf6' },
  { name: 'Iron', value: 30, color: '#ef4444' },
]

const SOIL_HISTORY = [
  { month: 'Oct', health: 65 },
  { month: 'Nov', health: 70 },
  { month: 'Dec', health: 85 },
  { month: 'Jan', health: 82 },
]

const CROP_DIST = [
  { name: 'Wheat', value: 50, color: '#059669' },
  { name: 'Rice', value: 30, color: '#10b981' },
  { name: 'Others', value: 20, color: '#6ee7b7' },
]

const Insights = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8F9F4] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-emerald-700 font-bold mb-2 hover:underline"
            >
              <ArrowLeft size={18} strokeWidth={3} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <TrendingUp className="text-emerald-600" size={32} />
              Advanced Farm Insights
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white border-2 border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition">
            <Download size={18} /> Export PDF
          </button>
        </div>

        {/* 1. Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard icon={<Droplets className="text-blue-500"/>} label="Avg Moisture" value="42%" status="Optimal" />
          <MetricCard icon={<Thermometer className="text-orange-500"/>} label="Soil Temp" value="24°C" status="Normal" />
          <MetricCard icon={<Wind className="text-slate-500"/>} label="Air Quality" value="92 AQI" status="Good" />
          <MetricCard icon={<Leaf className="text-emerald-500"/>} label="Soil Health" value="8.4" status="High" />
        </div>

        {/* 2. Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Nutrient Analysis */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-600" /> Nutrient Concentration Matrix
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={NUTRIENT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 700, fontSize: 12}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                    {NUTRIENT_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Soil Health Trend */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" /> Soil Productivity Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SOIL_HISTORY}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="health" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Distribution */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <PieChartIcon size={20} className="text-emerald-600" /> Land Utilization
              </h3>
              <p className="text-sm text-slate-500 mb-4 font-medium">Distribution of current crops across your 5.2 acre land.</p>
              <div className="space-y-2">
                {CROP_DIST.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-sm font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}} /> {c.name}
                    </div>
                    <span>{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CROP_DIST} innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                    {CROP_DIST.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Observation Card */}
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-200">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 italic">
              <Info size={24} /> AI OBSERVATION
            </h3>
            <p className="text-emerald-50 font-medium leading-relaxed mb-4">
              "Your Nitrogen levels have increased by 12% since December. We recommend reducing Urea application by 5kg for the next cycle to prevent acidity."
            </p>
            <div className="bg-white/20 p-3 rounded-2xl inline-block text-xs font-bold uppercase tracking-widest">
              Action Required: Adjust Fertilizer
            </div>
            <TrendingUp size={120} className="absolute -right-5 bottom-0 text-white/10" />
          </div>

        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ icon, label, value, status }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-2xl font-black text-slate-800">{value}</h4>
      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{status}</span>
    </div>
  </div>
)

export default Insights