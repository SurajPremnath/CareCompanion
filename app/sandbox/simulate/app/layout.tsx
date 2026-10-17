import type { ReactNode } from "react";
import { LanguageProvider } from "@/app/sandbox/simulate/app/components/language/LanguageProvider";

export default function SandboxLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <LanguageProvider>
            {children}
        </LanguageProvider>
    );
}