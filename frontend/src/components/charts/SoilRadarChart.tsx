import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

type Props = {
  data: { mineral: string; value: number }[]
}

export default function SoilRadarChart({ data }: Props) {
  return (
    <div className="h-80 bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">🌱 Soil Health</h2>

      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="mineral" />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar
            dataKey="value"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
