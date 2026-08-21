"use client";

import {
    ChangeEvent,
    useRef,
    useState,
} from "react";

interface CareJourneyUploadPanelProps {

    onBack?: () => void;

    onDocumentsSelected?: (
        documents: File[]
    ) => void;

}

export default function CareJourneyUploadPanel({

    onBack,

    onDocumentsSelected,

}: CareJourneyUploadPanelProps) {

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null
        );

    const [
        documents,
        setDocuments,
    ] =
        useState<File[]>([]);


const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
) => {

    const files =
        Array.from(
            event.target.files ?? []
        );

    if (files.length === 0) {
        return;
    }

    const selectedDocuments =
        files.slice(0, 5);

    setDocuments(
        selectedDocuments
    );

    onDocumentsSelected?.(
        selectedDocuments
    );

};


    return (

        <section
            style={{
                width: "100%",
                maxWidth: "720px",
                margin: "0 auto",
                padding: "24px",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                background: "#FFFFFF",
            }}
        >

            <h2
                style={{
                    margin: "0 0 8px",
                    fontSize: "20px",
                    fontWeight: 700,
                }}
            >
                Upload Medical Documents
            </h2>


            <p
                style={{
                    margin: "0 0 20px",
                    color: "#6B7280",
                    fontSize: "14px",
                }}
            >
                Upload prescriptions, reports, or other
                medical documents to add them to the
                patient&apos;s health timeline.
            </p>


            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={
                    handleFileChange
                }
                style={{
                    display: "none",
                }}
            />


            <button
                type="button"
                onClick={() =>
                    fileInputRef.current?.click()
                }
                style={{
                    width: "100%",
                    minHeight: "120px",
                    border: "2px dashed #D1D5DB",
                    borderRadius: "10px",
                    background: "#F9FAFB",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 600,
                }}
            >
                📄 Upload Medical Document
            </button>


            {documents.length > 0 && (

                <div
                    style={{
                        marginTop: "16px",
                    }}
                >

                    <strong
                        style={{
                            display: "block",
                            marginBottom: "8px",
                        }}
                    >
                        Selected Documents
                    </strong>


                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                        }}
                    >

                        {documents.map(
                            (
                                document,
                                index
                            ) => (

                                <div
                                    key={`${document.name}-${index}`}
                                    style={{
                                        padding: "8px 10px",
                                        borderRadius: "6px",
                                        background: "#F3F4F6",
                                        fontSize: "14px",
                                    }}
                                >
                                    {document.name}
                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "24px",
                }}
            >

                <button
                    type="button"
                    onClick={onBack}
                    style={{
                        minWidth: "110px",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        background: "#FFFFFF",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Back
                </button>



            </div>

        </section>

    );

}