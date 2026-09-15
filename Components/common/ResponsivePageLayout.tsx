"use client";

import {
    type ReactNode,
} from "react";

interface ResponsivePageLayoutProps {
    children: ReactNode;
    className?: string;
}

export default function ResponsivePageLayout({
    children,
    className = "",
}: ResponsivePageLayoutProps) {
    return (
        <div
            className={`responsive-page-layout ${className}`.trim()}
        >
            {children}

            <style jsx global>{`
                .responsive-page-layout {
                    width: 100%;
                    max-width: 100vw;
                    min-width: 0;
                    min-height: 100dvh;
                    margin: 0;
                    padding: 0;
                    overflow-x: clip;
                    box-sizing: border-box;
                }

                .responsive-page-layout *,
                .responsive-page-layout *::before,
                .responsive-page-layout *::after {
                    box-sizing: border-box;
                }

                @media (max-width: 650px) {
                    .responsive-page-layout {
                        width: 100%;
                        max-width: 100vw;
                        min-width: 0;
                        overflow-x: clip;
                    }

                    .responsive-page-layout > * {
                        min-width: 0;
                        max-width: 100%;
                    }

                    .responsive-page-layout input,
                    .responsive-page-layout select,
                    .responsive-page-layout textarea {
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    );
}