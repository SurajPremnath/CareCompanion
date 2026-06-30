"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  label: string;
  value?: number | null;
};

interface TrendLineChartProps {

    unit: string;

    color: string;

    decimals: number;

    lineWidth: number;

    dotRadius: number;

    activeDotRadius: number;

    data: ChartPoint[];

}

export default function TrendLineChart({

unit,

color,

decimals,

lineWidth,

dotRadius,

activeDotRadius,

data,

}: TrendLineChartProps) {

//------------------------------------------------------------
// Empty State
//------------------------------------------------------------

if (data.length === 0) {

  return (

    <div
      style={{
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed #d1d5db",
        borderRadius: 12,
        color: "#6b7280",
        fontSize: 15,
      }}
    >
      No observations available for the selected period.
    </div>

  );

}

//------------------------------------------------------------
// Single Observation
//------------------------------------------------------------

if (data.length === 1) {

  return (

    <div
      style={{
        height: 320,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >

      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color,
        }}
      >
        {Number(data[0].value).toFixed(decimals)} {unit}
      </div>

      <div
        style={{
          fontSize: 16,
          color: "#374151",
          fontWeight: 600,
        }}
      >
        Only one observation recorded
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        Record another reading to display a trend chart.
      </div>

    </div>

  );

}


  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          minTickGap={20}
        />

        <YAxis
          tick={{ fontSize: 12 }}
          allowDecimals
        />

        <Tooltip />

<Line
  type="monotone"
  dataKey="value"
  stroke={color}
  strokeWidth={lineWidth}
  dot={{ r: dotRadius }}
  activeDot={{ r: activeDotRadius }}
  connectNulls={false}
>
<LabelList
  dataKey="value"
  content={(props: any) => {
    const { x, y, value } = props;

    return (
      <text
        x={x}
        y={y - 16}
        textAnchor="middle"
        fontSize={11}
        fill="#6b7280"
      >
        {Number(value).toFixed(decimals)}
      </text>
    );
  }}
/>
</Line>
      </LineChart>
    </ResponsiveContainer>
  );
}