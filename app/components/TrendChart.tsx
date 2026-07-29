"use client";

//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import type {
  ParameterTrend,
} from "@/lib/trends/trendResult";

import TrendLineChart from "./TrendLineChart";
import { TrendChartConfig } from "@/lib/trends/trendChartConfig";

//------------------------------------------------------------
// Props
//------------------------------------------------------------

interface TrendChartProps {

  trend: ParameterTrend;

}

//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function TrendChart({

  trend,

}: TrendChartProps) {

  //----------------------------------------------------------
  // Hide if not selected
  //----------------------------------------------------------

  if (!trend.enabled) {

    return null;

  }

const chartConfig = TrendChartConfig[trend.parameter];

const formatStatistic = (
  primary: number | null,
  secondary?: number | null
) => {

  if (
    trend.parameter === "bloodPressure" &&
    primary !== null &&
    secondary !== null
  ) {
    return `${primary} / ${secondary}`;
  }

  return primary;
};

  //----------------------------------------------------------
  // Render
  //----------------------------------------------------------

return (

    <section
      id={`trend-chart-${trend.parameter}`}
      style={cardStyle}
    >

      <h3>

        {chartConfig.title}

      </h3>

      {/*----------------------------------------------*/}
      {/* Statistics */}
      {/*----------------------------------------------*/}

      <div style={statsGrid}>

        <StatCard
  title="Current"
  value={
    formatStatistic(
      trend.statistics.current,
      trend.statistics.secondaryCurrent
    )
  }
/>

<StatCard
  title="Minimum"
  value={
    formatStatistic(
      trend.statistics.minimum,
      trend.statistics.secondaryMinimum
    )
  }
/>

<StatCard
  title="Maximum"
  value={
    formatStatistic(
      trend.statistics.maximum,
      trend.statistics.secondaryMaximum
    )
  }
/>

<StatCard
  title="Average"
  value={
    formatStatistic(
      trend.statistics.average,
      trend.statistics.secondaryAverage
    )
  }
/>

      </div>

      {/*----------------------------------------------*/}
      {/*Trend Chart */}
      {/*----------------------------------------------*/}

<TrendLineChart
    unit={chartConfig.unit}
    color={chartConfig.color}
showSecondaryLine={
      trend.parameter === "bloodPressure"
    }
    decimals={chartConfig.decimals}
    lineWidth={chartConfig.lineWidth}
    dotRadius={chartConfig.dotRadius}
    activeDotRadius={chartConfig.activeDotRadius}
    minYAxis={chartConfig.minYAxis}
data={trend.points.map((point) => ({

    fullLabel: new Date(point.recordedAt).toLocaleString([], {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }),

    shortLabel: new Date(point.recordedAt).toLocaleDateString([], {
        day: "2-digit",
        month: "short",
    }),

    value: point.value,

secondaryValue: point.secondaryValue,
}))}
/>

    </section>

  );

}

//------------------------------------------------------------
// Stat Card
//------------------------------------------------------------

interface StatCardProps {

  title: string;

  value: string | number | null;

}

function StatCard({

  title,

  value,

}: StatCardProps) {

  return (

    <div style={statCard}>

      <div style={statTitle}>

        {title}

      </div>

      <div style={statValue}>

        {value ?? "-"}

      </div>

    </div>

  );

}

//------------------------------------------------------------
// Styles
//------------------------------------------------------------

const cardStyle: React.CSSProperties = {

  background: "#ffffff",

  border: "1px solid #e5e7eb",

  borderRadius: "16px",

  padding: "24px",

  marginBottom: "24px",

};

const statsGrid: React.CSSProperties = {

  display: "grid",

  gridTemplateColumns:
  "repeat(auto-fit, minmax(140px, 1fr))",

  gap: "16px",

  marginTop: "20px",

  marginBottom: "24px",

};

const statCard: React.CSSProperties = {

  background: "#f8fafc",

  border: "1px solid #e5e7eb",

  borderRadius: "12px",

  padding: "16px",

  textAlign: "center",

};

const statTitle: React.CSSProperties = {

  fontSize: "13px",

  color: "#6b7280",

  marginBottom: "8px",

};

const statValue: React.CSSProperties = {

  fontSize: "22px",

  fontWeight: 700,

};

