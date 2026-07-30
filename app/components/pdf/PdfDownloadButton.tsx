"use client";

import { FileDown } from "lucide-react";

interface PdfDownloadButtonProps {
    onClick: () => void;
    loading?: boolean;
    label?: string;
}

export default function PdfDownloadButton({
    onClick,
    loading = false,
    label = "Generate PDF"
}: PdfDownloadButtonProps) {

    return (

        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
        >

            <FileDown size={18} />

            {loading
                ? "Generating..."
                : label}

        </button>

    );

}