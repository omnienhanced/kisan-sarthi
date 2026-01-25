import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

type Props = {
  soil: {
    nitrogen: number
    phosphorus: number
    potassium: number
    sulphur: number
  }
  required: {
    nitrogen_min: number
    phosphorus_min: number
    potassium_min: number
    sulphur_min: number
  }
}

export default function NutrientChart({ soil, required }: Props) {
  // 🛡️ Safety fallback
  if (!soil || !required) {
    return (
      <div className="text-center text-gray-400 font-semibold">
        No nutrient data available
      </div>
    )
  }

  const data = [
    {
      name: "Nitrogen",
      Soil: soil.nitrogen ?? 0,
      Required: required.nitrogen_min ?? 0,
    },
    {
      name: "Phosphorus",
      Soil: soil.phosphorus ?? 0,
      Required: required.phosphorus_min ?? 0,
    },
    {
      name: "Potassium",
      Soil: soil.potassium ?? 0,
      Required: required.potassium_min ?? 0,
    },
    {
      name: "Sulphur",
      Soil: soil.sulphur ?? 0,
      Required: required.sulphur_min ?? 0,
    },
  ]

  return (
    <div className="w-full h-[320px]">
      {/* 🔑 Parent has fixed height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Soil" fill="#16a34a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Required" fill="#dc2626" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
