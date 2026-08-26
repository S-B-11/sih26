import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

export function ChartCard({ chart }) {
  if (!chart || !chart.data) return null;

  const isLine = chart.type === "line";

  return (
    <div className="w-full mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isLine ? (
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <BarChart3 className="w-4 h-4 text-teal-400" />
          )}
          <h4 className="text-xs font-bold text-slate-200">
            {chart.title}
          </h4>
        </div>
        <span className="text-[10px] text-cyan-400/80 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">
          INCOIS Metric Telemetry
        </span>
      </div>

      <div className="w-full h-48 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {isLine ? (
            <LineChart data={chart.data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b192c",
                  borderColor: "rgba(0,242,254,0.4)",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "11px"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
              {Object.keys(chart.data[0])
                .filter((key) => key !== Object.keys(chart.data[0])[0])
                .map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={i === 0 ? "#00f2fe" : i === 1 ? "#00c9a7" : "#ff4757"}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
            </LineChart>
          ) : (
            <BarChart data={chart.data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={Object.keys(chart.data[0])[0]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b192c",
                  borderColor: "rgba(0,242,254,0.4)",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "11px"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
              {Object.keys(chart.data[0])
                .filter((key) => key !== Object.keys(chart.data[0])[0])
                .map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={i === 0 ? "#ff4757" : "#00f2fe"}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
