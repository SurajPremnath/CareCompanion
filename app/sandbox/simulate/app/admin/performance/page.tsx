"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import type {
    PerformanceRecord,
} from "@/lib/performance/performanceTypes";

import {
    performanceStorage,
} from "@/lib/performance/performanceStorage";


//------------------------------------------------------------
// Helpers
//------------------------------------------------------------

function formatDuration(
    durationMs: number
): string {

    if (durationMs < 1000) {

        return `${durationMs} ms`;

    }

    return `${(
        durationMs / 1000
    ).toFixed(2)} sec`;

}


function formatDateTime(
    value: string
): string {

    return new Date(
        value
    ).toLocaleString();

}


//------------------------------------------------------------
// Performance Diagnostics Page
//------------------------------------------------------------

export default function PerformanceDiagnosticsPage() {

    const router =
        useRouter();

    const [
        records,
        setRecords,
    ] = useState<
        PerformanceRecord[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(
        true
    );

    const [
        clearing,
        setClearing,
    ] = useState(
        false
    );


    //--------------------------------------------------------
    // Load Records
    //--------------------------------------------------------

    const loadRecords =
        useCallback(
            async () => {

                setLoading(
                    true
                );

                try {

                    const storedRecords =
                        await performanceStorage.getAll();

                    setRecords(
                        storedRecords
                    );

                }
                finally {

                    setLoading(
                        false
                    );

                }

            },
            []
        );


    //--------------------------------------------------------
    // Initial Load
    //--------------------------------------------------------

    useEffect(
        () => {

            void loadRecords();

        },
        [
            loadRecords,
        ]
    );


    //--------------------------------------------------------
    // Clear Records
    //--------------------------------------------------------

    const clearRecords =
        async () => {

            const confirmed =
                window.confirm(
                    "Clear all performance records stored on this device?"
                );

            if (!confirmed) {

                return;

            }

            setClearing(
                true
            );

            try {

                await performanceStorage.clear();

                setRecords(
                    []
                );

            }
            finally {

                setClearing(
                    false
                );

            }

        };


    //--------------------------------------------------------
    // Render
    //--------------------------------------------------------

    return (

        <main
            style={{
                minHeight:
                    "100vh",

                background:
                    "#f7f8fa",

                padding:
                    "24px 16px",
            }}
        >

            <div
                style={{
                    maxWidth:
                        "1200px",

                    margin:
                        "0 auto",
                }}
            >

                <button
                    type="button"
                    onClick={() =>
                        router.back()
                    }
                    style={{
                        marginBottom:
                            "16px",

                        padding:
                            "10px 14px",

                        cursor:
                            "pointer",
                    }}
                >
                    ← Back
                </button>


                <h1
                    style={{
                        marginBottom:
                            "8px",
                    }}
                >
                    Performance Diagnostics
                </h1>


                <p
                    style={{
                        marginBottom:
                            "20px",

                        color:
                            "#555",
                    }}
                >
                    Navigation timings stored locally on this device.
                </p>


                <div
                    style={{
                        display:
                            "flex",

                        gap:
                            "12px",

                        flexWrap:
                            "wrap",

                        marginBottom:
                            "24px",
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            void loadRecords()
                        }
                        disabled={
                            loading
                        }
                        style={{
                            padding:
                                "10px 16px",

                            cursor:
                                "pointer",
                        }}
                    >
                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            void clearRecords()
                        }
                        disabled={
                            clearing
                        }
                        style={{
                            padding:
                                "10px 16px",

                            cursor:
                                "pointer",
                        }}
                    >
                        {clearing
                            ? "Clearing..."
                            : "Clear Local Records"}
                    </button>

                </div>


                {loading ? (

                    <p>
                        Loading performance records...
                    </p>

                ) : records.length === 0 ? (

                    <div
                        style={{
                            background:
                                "#ffffff",

                            padding:
                                "20px",

                            borderRadius:
                                "12px",
                        }}
                    >
                        No performance records found on this device.
                    </div>

                ) : (

                    <div
                        style={{
                            display:
                                "grid",

                            gap:
                                "12px",
                        }}
                    >

                        {records.map(
                            (
                                record
                            ) => (

                                <article
                                    key={
                                        record.id
                                    }
                                    style={{
                                        background:
                                            "#ffffff",

                                        padding:
                                            "16px",

                                        borderRadius:
                                            "12px",

                                        border:
                                            "1px solid #e5e7eb",
                                    }}
                                >

                                    <div
                                        style={{
                                            fontWeight:
                                                700,

                                            marginBottom:
                                                "10px",

                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {record.feature}
                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "grid",

                                            gap:
                                                "6px",
                                        }}
                                    >

                                        <div>
                                            <strong>
                                                From:
                                            </strong>{" "}
                                            {record.fromPath}
                                        </div>


                                        <div>
                                            <strong>
                                                To:
                                            </strong>{" "}
                                            {record.toPath}
                                        </div>


                                        <div>
                                            <strong>
                                                Duration:
                                            </strong>{" "}
                                            {formatDuration(
                                                record.durationMs
                                            )}
                                        </div>


                                        <div>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {record.status}
                                        </div>


<div>
    <strong>
        Context:
    </strong>{" "}
    {record.context ??
        "—"}
</div>


<div>
    <strong>
        Device:
    </strong>{" "}
    {record.deviceType ??
        "UNKNOWN"}
</div>


<div>
    <strong>
        Platform:
    </strong>{" "}
    {record.platform ??
        "UNKNOWN"}
</div>


<div>
    <strong>
        Completed:
    </strong>{" "}
    {formatDateTime(
        record.completedAt
    )}
</div>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </div>

        </main>

    );

}