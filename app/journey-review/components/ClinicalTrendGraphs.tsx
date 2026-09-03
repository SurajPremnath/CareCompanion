"use client";

import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import type {
    ClinicalTrendGraphData,
} from "../data/clinicalTrends";

interface ClinicalTrendGraphsProps {
    trends: ClinicalTrendGraphData[];
}

interface GraphCardProps {
    title: string;
    unit?: string;
    current: string;
    minimum: string;
    maximum: string;
    average: string;
    points: {
        date: string;
        value: number;
    }[];
}

function GraphCard({
    title,
    unit,
    current,
    minimum,
    maximum,
    average,
    points,
}: GraphCardProps) {

    const chartData =
        points.map(
            point => ({
                date:
                    new Date(
                        point.date
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                        }
                    ),

                value:
                    point.value,
            })
        );

    if (points.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
                background: "#ffffff",
            }}
        >

            <div
                style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "16px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: "10px",
                    marginBottom: "18px",
                }}
            >

                <Stat
                    label="Min"
                    value={minimum}
                />

                <Stat
                    label="Max"
                    value={maximum}
                />

                <Stat
                    label="Average"
                    value={average}
                />

                <Stat
                    label="Current"
                    value={current}
                />

            </div>

            <div
                style={{
                    width: "100%",
                    height: "260px",
                }}
            >
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 5,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

<XAxis
    dataKey="date"
    tickLine={false}
    axisLine={false}
/>

                        <YAxis
                            domain={["auto", "auto"]}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip />

<Line
    type="monotone"
    dataKey="value"
    strokeWidth={3}
    dot={{
        r: 4,
    }}
    activeDot={{
        r: 7,
    }}
/>

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {unit && (
                <div
                    style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "6px",
                    }}
                >
                    Unit: {unit}
                </div>
            )}

        </div>
    );
}

function BloodPressureGraphCard({
    title,
    unit,
    current,
    minimum,
    maximum,
    average,
    systolicPoints,
    diastolicPoints,
}: {
    title: string;
    unit?: string;
    current: string;
    minimum: string;
    maximum: string;
    average: string;
    systolicPoints: {
        date: string;
        value: number;
    }[];
    diastolicPoints: {
        date: string;
        value: number;
    }[];
}) {

    const chartData =
        systolicPoints.map(
            (point, index) => ({
                date:
                    new Date(
                        point.date
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                        }
                    ),

                systolic:
                    point.value,

                diastolic:
                    diastolicPoints[index]
                        ?.value ?? null,
            })
        );

    if (
        chartData.length === 0
    ) {
        return null;
    }

    return (
        <div
            style={{
                border:
                    "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
                background: "#ffffff",
            }}
        >

            <div
                style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "16px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: "10px",
                    marginBottom: "18px",
                }}
            >

                <Stat
                    label="Min"
                    value={minimum}
                />

                <Stat
                    label="Max"
                    value={maximum}
                />

                <Stat
                    label="Average"
                    value={average}
                />

                <Stat
                    label="Current"
                    value={current}
                />

            </div>

            <div
                style={{
                    width: "100%",
                    height: "260px",
                }}
            >
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 5,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            domain={[
                                "auto",
                                "auto",
                            ]}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="systolic"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                            }}
                            activeDot={{
                                r: 7,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="diastolic"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                            }}
                            activeDot={{
                                r: 7,
                            }}
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {unit && (
                <div
                    style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "6px",
                    }}
                >
                    Unit: {unit}
                </div>
            )}

        </div>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                border: "1px solid #eef0f2",
                borderRadius: "10px",
                padding: "10px",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    marginBottom: "4px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: "15px",
                    fontWeight: 700,
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default function ClinicalTrendGraphs({
    trends,
}: ClinicalTrendGraphsProps) {

    const temperature =
        trends.find(
            trend =>
                trend.parameter ===
                "Temperature"
        );

    const pulse =
        trends.find(
            trend =>
                trend.parameter ===
                "Pulse"
        );

    const spo2 =
        trends.find(
            trend =>
                trend.parameter ===
                "SpO₂"
        );

const bloodPressure =
    trends.find(
        trend =>
            trend.parameter ===
            "Blood Pressure"
    );

    const weight =
        trends.find(
            trend =>
                trend.parameter ===
                "Weight"
        );

    return (
        <section
            style={{
                marginTop: "40px",
            }}
        >

            <div
                style={{
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        fontSize: "24px",
                        fontWeight: 800,
                        margin: 0,
                    }}
                >
                    Clinical Trend Graphs
                </h2>

                <p
                    style={{
                        marginTop: "6px",
                        color: "#6b7280",
                        fontSize: "14px",
                    }}
                >
                    Visual trends in recorded vital
                    measurements.
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                    gap: "20px",
                }}
            >

                {temperature && (
                    <GraphCard
                        title="Temperature"
                        unit="°F"
                        current={
                            temperature.current
                        }
                        minimum={
                            temperature.minimum
                        }
                        maximum={
                            temperature.maximum
                        }
                        average={
                            temperature.average
                        }
                        points={
    temperature.points
}
                    />
                )}

                {pulse && (
                    <GraphCard
                        title="Pulse"
                        unit="bpm"
                        current={
                            pulse.current
                        }
                        minimum={
                            pulse.minimum
                        }
                        maximum={
                            pulse.maximum
                        }
                        average={
                            pulse.average
                        }
                        points={
                            pulse.points
                        }
                    />
                )}

                {spo2 && (
                    <GraphCard
                        title="SpO₂"
                        unit="%"
                        current={
                            spo2.current
                        }
                        minimum={
                            spo2.minimum
                        }
                        maximum={
                            spo2.maximum
                        }
                        average={
                            spo2.average
                        }
                        points={
                            spo2.points
                        }
                    />
                )}

{bloodPressure && (
    <BloodPressureGraphCard
        title="Blood Pressure"
        unit="mmHg"
        current={
            bloodPressure.current
        }
        minimum={
            bloodPressure.minimum
        }
        maximum={
            bloodPressure.maximum
        }
        average={
            bloodPressure.average
        }
        systolicPoints={
            bloodPressure.systolicPoints ?? []
        }
        diastolicPoints={
            bloodPressure.diastolicPoints ?? []
        }
    />
)}

                {weight && (
                    <GraphCard
                        title="Weight"
                        unit="kg"
                        current={
                            weight.current
                        }
                        minimum={
                            weight.minimum
                        }
                        maximum={
                            weight.maximum
                        }
                        average={
                            weight.average
                        }
                        points={
                            weight.points
                        }
                    />
                )}

            </div>

        </section>
    );
}