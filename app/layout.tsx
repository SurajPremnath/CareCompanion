import "./globals.css";
import {
  LanguageProvider,
} from "@/Components/language/LanguageProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f8fafc",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
          color: "#111827",
        }}
      >
        <LanguageProvider>
  {children}
</LanguageProvider>
      </body>
    </html>
  );
}