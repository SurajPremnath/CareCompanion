"use client";

import type { CSSProperties } from "react";

export interface DoctorNotesDocumentItem {
    id: string;
    name: string;
    type: "IMAGE" | "PDF";
    previewUrl?: string;
}

interface DoctorNotesDocumentsCardProps {
    documents: DoctorNotesDocumentItem[];
}

const cardStyle: CSSProperties = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #D9E2F2",
    borderRadius: "14px",
    overflow: "hidden",
    boxSizing: "border-box",
};

const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #E5EAF2",
};

const iconStyle: CSSProperties = {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2167D5",
    fontSize: "23px",
    flexShrink: 0,
};

const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#111A3A",
};

const bodyStyle: CSSProperties = {
    padding: "18px 24px 22px",
};

const descriptionStyle: CSSProperties = {
    margin: "0 0 16px",
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#64748B",
};

const documentListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

const documentRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
    padding: "12px 14px",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    background: "#F8FAFC",
};

const documentIconStyle: CSSProperties = {
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#EEF4FF",
    color: "#2167D5",
    fontSize: "19px",
    flexShrink: 0,
};

const documentDetailsStyle: CSSProperties = {
    minWidth: 0,
    flex: 1,
};

const documentNameStyle: CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.35,
    fontWeight: 600,
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};

const documentTypeStyle: CSSProperties = {
    marginTop: "3px",
    fontSize: "12px",
    lineHeight: 1.3,
    color: "#64748B",
};

const emptyStyle: CSSProperties = {
    padding: "18px",
    borderRadius: "10px",
    border: "1px dashed #CBD5E1",
    color: "#64748B",
    fontSize: "13px",
    textAlign: "center",
};

export default function DoctorNotesDocumentsCard({
    documents,
}: DoctorNotesDocumentsCardProps) {
    return (
        <section style={cardStyle}>
            <div style={headerStyle}>
                <div
                    aria-hidden="true"
                    style={iconStyle}
                >
                    ▣
                </div>

                <h2 style={titleStyle}>
                    Documents Uploaded
                </h2>
            </div>

            <div style={bodyStyle}>
                <p style={descriptionStyle}>
                    These are the documents used to
                    create this Doctor's Notes record.
                </p>

                {documents.length === 0 ? (
                    <div style={emptyStyle}>
                        No documents uploaded.
                    </div>
                ) : (
                    <div style={documentListStyle}>
                        {documents.map(document => (
                            <div
                                key={document.id}
                                style={documentRowStyle}
                            >
                                <div
                                    aria-hidden="true"
                                    style={documentIconStyle}
                                >
                                    {document.type ===
                                    "PDF"
                                        ? "PDF"
                                        : "▧"}
                                </div>

                                <div
                                    style={
                                        documentDetailsStyle
                                    }
                                >
                                    <div
                                        style={
                                            documentNameStyle
                                        }
                                    >
                                        {document.name}
                                    </div>

                                    <div
                                        style={
                                            documentTypeStyle
                                        }
                                    >
                                        {document.type ===
                                        "PDF"
                                            ? "PDF document"
                                            : "Image"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}