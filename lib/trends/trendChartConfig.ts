import type { TrendParameterType } from "./trendResult";

export interface TrendChartConfiguration {
  title: string;
  shortTitle: string;
  unit: string;
  color: string;
  decimals: number;
  lineWidth: number;
  dotRadius: number;
  activeDotRadius: number;
  minYAxis: number;
}

export const TrendChartConfig: Record<
  TrendParameterType,
  TrendChartConfiguration
> = {
  temperature: {
    title: "Temperature",
    shortTitle: "Temp",
    unit: "°F",
    color: "#ef4444",
    decimals: 1,
    lineWidth: 2,
    dotRadius: 5,
    activeDotRadius: 7,    
    minYAxis: 50,
  },

  pulse: {
    title: "Pulse",
    shortTitle: "Pulse",
    unit: "bpm",
    color: "#2563eb",
    decimals: 0,
    lineWidth: 2,
    dotRadius: 5,
    activeDotRadius: 7,
    minYAxis: 50,
  },

  spo2: {
    title: "SpO₂",
    shortTitle: "SpO₂",
    unit: "%",
    color: "#10b981",
    decimals: 0,
    lineWidth: 2,
    dotRadius: 5,
    activeDotRadius: 7,
    minYAxis: 50,
  },

  bloodPressure: {
    title: "Blood Pressure",
    shortTitle: "BP",
    unit: "mmHg",
    color: "#7c3aed",
    decimals: 0,
    lineWidth: 2,
    dotRadius: 5,
    activeDotRadius: 7,
    minYAxis: 50,
  },
};