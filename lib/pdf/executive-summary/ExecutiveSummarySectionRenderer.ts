import {
    PDFPage,
    PDFFont,
    rgb
} from "pdf-lib";

export interface ExecutiveSummarySection {
    id?: string;
    icon?: string;
    title: string;
    question?: string;
    periods: any[];
}

export interface ExecutiveSummarySectionOptions {
    page: PDFPage;
    x: number;
    y: number;
    width: number;
    boldFont: PDFFont;
    regularFont: PDFFont;
}

export class ExecutiveSummarySectionRenderer {

    static drawHealthEvents(
        options: ExecutiveSummarySectionOptions,
        section: ExecutiveSummarySection | undefined
    ): number {
        const { page, x, y, width, boldFont, regularFont } = options;
        let currentY = this.drawHeading(page, x, y, width, "1", "Health Events", "What happened during the patient's journey?", boldFont, regularFont);

        for (const period of section?.periods ?? []) {
            const answer = this.safePdfText(this.cleanText(period?.answer) || "No events recorded during this period.");
            const wrapped = this.wrapText(answer, 82);
            const lines = wrapped.split("\n").length;
            const height = Math.max(58, 30 + lines * 11);

            page.drawRectangle({ x, y: currentY - height, width, height, borderWidth: 0.7, borderColor: rgb(0.88, 0.91, 0.94), color: rgb(0.985, 0.99, 0.995) });
            page.drawCircle({ x: x + 12, y: currentY - 16, size: 4, color: rgb(0.09, 0.41, 0.67) });
            page.drawText(this.safePdfText(String(period?.weekLabel ?? "Recorded period")), { x: x + 25, y: currentY - 19, font: boldFont, size: 9, color: rgb(0.09, 0.41, 0.67) });
            page.drawText(wrapped, { x: x + 25, y: currentY - 37, font: regularFont, size: 8.5, lineHeight: 11, maxWidth: width - 35, color: rgb(0.28, 0.34, 0.41) });
            currentY -= height + 7;
        }

        return currentY;
    }

    static drawHealthChanges(
        options: ExecutiveSummarySectionOptions,
        section: ExecutiveSummarySection | undefined
    ): number {
        const { page, x, y, width, boldFont, regularFont } = options;
        let currentY = this.drawHeading(page, x, y, width, "2", "Health Changes", "What changed during this period?", boldFont, regularFont);
        const columnWidth = width / 3;

        for (const period of section?.periods ?? []) {
            const source = this.cleanText(period?.answer);
            const values = [
                this.extractCategory(source, ["Symptoms Change", "Symptom progression"], ["Vital Changes", "Medication Changes", "Clinical Changes"]),
                this.extractCategory(source, ["Vital Changes", "Vital changes"], ["Medication Changes", "Clinical Changes"]),
                this.extractCategory(source, ["Medication Changes", "Medication changes"], ["Clinical Changes"])
            ];
            const wrapped = values.map(value => this.wrapText(this.safePdfText(value || "No change recorded."), 27));
            const lines = Math.max(...wrapped.map(value => value.split("\n").length), 1);
            const height = Math.max(96, 43 + lines * 11);

            page.drawRectangle({ x, y: currentY - height, width, height, borderWidth: 0.7, borderColor: rgb(0.88, 0.91, 0.94), color: rgb(0.985, 0.99, 0.995) });
            page.drawText(this.safePdfText(String(period?.weekLabel ?? "Recorded period")), { x: x + 10, y: currentY - 17, font: boldFont, size: 9, color: rgb(0.09, 0.41, 0.67) });

            const labels = ["Symptoms Change", "Vital Changes", "Medication Changes"];
            const colors = [rgb(0.49, 0.24, 0.74), rgb(0.75, 0.15, 0.15), rgb(0.09, 0.50, 0.24)];

            for (let i = 0; i < 3; i++) {
                const columnX = x + i * columnWidth;
                if (i > 0) {
                    page.drawLine({ start: { x: columnX, y: currentY - 30 }, end: { x: columnX, y: currentY - height }, thickness: 0.5, color: rgb(0.90, 0.92, 0.94) });
                }
                page.drawText(labels[i], { x: columnX + 10, y: currentY - 37, font: boldFont, size: 8, color: colors[i] });
                page.drawText(wrapped[i], { x: columnX + 10, y: currentY - 52, font: regularFont, size: 8, lineHeight: 11, maxWidth: columnWidth - 20, color: rgb(0.28, 0.34, 0.41) });
            }

            currentY -= height + 7;
        }

        return currentY;
    }

    static drawPatientStatus(
        options: ExecutiveSummarySectionOptions,
        section: ExecutiveSummarySection | undefined,
        summary?: any
    ): number {
        const { page, x, y, width, boldFont, regularFont } = options;
        let currentY = this.drawHeading(page, x, y, width, "3", "Patient Status", "How is the patient doing now?", boldFont, regularFont);
        const answer = this.cleanText(section?.periods?.[section.periods.length - 1]?.answer);
        const vitals = this.parseVitals(answer);

        if (!vitals.temperature) {
            const fallback = this.getTemperatureFallback(summary);
            if (fallback) vitals.temperature = fallback;
        }

        const cards = [
            ["Blood Pressure", vitals.bloodPressure],
            ["Pulse", vitals.pulse],
            ["SpO2", vitals.spo2],
            ["Temperature", vitals.temperature]
        ] as const;

        const gap = 7;
        const cardWidth = (width - gap * 3) / 4;
        const cardHeight = 88;

        for (let i = 0; i < cards.length; i++) {
            const [label, data] = cards[i];
            const cardX = x + i * (cardWidth + gap);
            const value = data ?? { current: "—", min: "—", max: "—", fallback: false };

            page.drawRectangle({ x: cardX, y: currentY - cardHeight, width: cardWidth, height: cardHeight, borderWidth: 0.8, borderColor: rgb(0.86, 0.89, 0.93), color: rgb(1, 1, 1) });
            page.drawText(label, { x: cardX + 8, y: currentY - 16, font: boldFont, size: 8.5, color: rgb(0.40, 0.45, 0.52) });
            page.drawText(value.fallback ? "Latest*" : "Current", { x: cardX + 8, y: currentY - 31, font: regularFont, size: 7.5, color: rgb(0.55, 0.59, 0.65) });
            page.drawText(this.safePdfText(value.current), { x: cardX + 8, y: currentY - 48, font: boldFont, size: 12, color: rgb(0.09, 0.13, 0.20) });
            page.drawLine({ start: { x: cardX + 8, y: currentY - 56 }, end: { x: cardX + cardWidth - 8, y: currentY - 56 }, thickness: 0.5, color: rgb(0.90, 0.92, 0.94) });
            page.drawText(`Min  ${this.safePdfText(value.min)}`, { x: cardX + 8, y: currentY - 70, font: regularFont, size: 7.5, color: rgb(0.42, 0.47, 0.53) });
            page.drawText(`Max  ${this.safePdfText(value.max)}`, { x: cardX + 8, y: currentY - 82, font: regularFont, size: 7.5, color: rgb(0.42, 0.47, 0.53) });
        }

        currentY -= cardHeight + 13;

        if (vitals.temperature?.fallback) {
            page.drawText("* Latest available temperature record; no temperature was recorded this week.", { x, y: currentY, font: regularFont, size: 7.5, color: rgb(0.55, 0.59, 0.65) });
            currentY -= 16;
        }

        page.drawText("Yesterday's symptoms", { x, y: currentY, font: boldFont, size: 9.5, color: rgb(0.15, 0.20, 0.28) });
        currentY -= 15;

        const symptoms = this.extractYesterdaySymptoms(answer);
        if (symptoms.length === 0) {
            page.drawText("No symptoms were recorded yesterday.", { x, y: currentY, font: regularFont, size: 8.5, color: rgb(0.35, 0.40, 0.46) });
            return currentY - 18;
        }

        for (const symptom of symptoms) {
            page.drawCircle({ x: x + 4, y: currentY + 3, size: 2.5, color: rgb(0.49, 0.24, 0.74) });
            page.drawText(this.safePdfText(symptom), { x: x + 12, y: currentY, font: regularFont, size: 8.5, color: rgb(0.28, 0.34, 0.41) });
            currentY -= 13;
        }

        return currentY - 8;
    }

    static drawClinicalPlan(
        options: ExecutiveSummarySectionOptions,
        section: ExecutiveSummarySection | undefined
    ): number {
        const { page, x, y, width, boldFont, regularFont } = options;
        let currentY = this.drawHeading(page, x, y, width, "5", "Latest Clinical Plan", "What was the latest documented clinical plan?", boldFont, regularFont);
        const period = section?.periods?.[section.periods.length - 1];
        const answer = this.cleanText(period?.answer) || "No clinical plan was recorded.";
        const lines = answer.split("\n").map(line => line.replace(/^[•●▪\-]+\s*/, "").trim()).filter(Boolean);
        const wrapped = (lines.length ? lines : [answer]).map(line => this.wrapText(this.safePdfText(line), 92));
        const totalLines = wrapped.reduce((sum, line) => sum + line.split("\n").length, 0);
        const height = Math.max(76, 28 + totalLines * 12);

        page.drawRectangle({ x, y: currentY - height, width, height, borderWidth: 0.7, borderColor: rgb(0.88, 0.91, 0.94), color: rgb(0.985, 0.99, 0.995) });
        let lineY = currentY - 18;
        for (const line of wrapped) {
            page.drawCircle({ x: x + 8, y: lineY + 3, size: 2.5, color: rgb(0.09, 0.41, 0.67) });
            page.drawText(line, { x: x + 18, y: lineY, font: regularFont, size: 8.5, lineHeight: 12, maxWidth: width - 28, color: rgb(0.28, 0.34, 0.41) });
            lineY -= line.split("\n").length * 12;
        }
        return currentY - height - 8;
    }

    private static drawHeading(page: PDFPage, x: number, y: number, width: number, number: string, title: string, subtitle: string, boldFont: PDFFont, regularFont: PDFFont): number {
        page.drawRectangle({ x, y: y - 44, width, height: 44, borderWidth: 0.7, borderColor: rgb(0.86, 0.90, 0.94), color: rgb(0.97, 0.985, 0.995) });
        page.drawCircle({ x: x + 17, y: y - 16, size: 10, color: rgb(0.09, 0.41, 0.67) });
        page.drawText(number, { x: x + 14.5, y: y - 19, font: boldFont, size: 8, color: rgb(1, 1, 1) });
        page.drawText(this.safePdfText(title), { x: x + 34, y: y - 16, font: boldFont, size: 11, color: rgb(0.09, 0.13, 0.20) });
        page.drawText(this.safePdfText(subtitle), { x: x + 34, y: y - 31, font: regularFont, size: 7.5, color: rgb(0.42, 0.47, 0.53) });
        return y - 56;
    }

    private static parseVitals(answer: string): any {
        const result: any = {};
        const match = answer.match(/Current vitals\s*([\s\S]*?)(?=\n\nYesterday's symptoms|$)/i);
        const lines = match?.[1]?.split("\n").map(line => line.trim()).filter(Boolean) ?? [];
        const definitions = [
            ["bloodPressure", ["Blood pressure", "Blood Pressure"]],
            ["pulse", ["Pulse"]],
            ["spo2", ["SpO2", "SpO₂"]],
            ["temperature", ["Temperature"]]
        ] as const;

        for (const [key, labels] of definitions) {
            const line = lines.find(value => labels.some(label => value.toLowerCase().startsWith(`${label.toLowerCase()}:`)));
            if (!line) continue;
            const value = line.substring(line.indexOf(":") + 1).trim();
            const current = value.match(/Current\s+(.+?)(?=\s+·\s+Min|$)/i)?.[1]?.trim();
            const min = value.match(/Min\s+(.+?)(?=\s+·\s+Max|$)/i)?.[1]?.trim();
            const max = value.match(/Max\s+(.+)$/i)?.[1]?.trim();
            result[key] = { current: current ?? "—", min: min ?? "—", max: max ?? "—", fallback: false };
        }
        return result;
    }

    private static getTemperatureFallback(summary: any): any | null {
        const records = Array.isArray(summary?.clinicalTimeline) ? summary.clinicalTimeline : [];
        const values = records.map((event: any) => ({ date: new Date(event?.date).getTime(), value: Number(event?.vitals?.temperature) })).filter((item: any) => Number.isFinite(item.value) && item.value > 0 && item.value < 120).sort((a: any, b: any) => a.date - b.date);
        if (!values.length) return null;
        const numbers = values.map((item: any) => item.value);
        const latest = values[values.length - 1].value;
        return { current: `${latest}°F`, min: `${Math.min(...numbers)}°F`, max: `${Math.max(...numbers)}°F`, fallback: true };
    }

    private static extractYesterdaySymptoms(answer: string): string[] {
        const match = answer.match(/Yesterday's symptoms\s*([\s\S]*)$/i);
        if (!match?.[1]) return [];
        return match[1].split("\n").map(value => value.replace(/^[•●▪\-]+\s*/, "").trim()).filter(Boolean);
    }

    private static extractCategory(answer: string, labels: string[], stopLabels: string[]): string {
        if (!answer) return "";
        const labelPattern = labels.map(label => this.escapeRegex(label)).join("|");
        const stopPattern = stopLabels.map(label => this.escapeRegex(label)).join("|");
        const expression = new RegExp(`(?:${labelPattern})\\s*[:\\-]?\\s*([\\s\\S]*?)(?=\\s+(?:${stopPattern})\\s*[:\\-]?|$)`, "i");
        return answer.match(expression)?.[1]?.trim() ?? "";
    }

    private static cleanText(value: any): string {
        return String(value ?? "").replace(/\r\n/g, "\n").trim();
    }

    private static safePdfText(value: string): string {
        return String(value ?? "").replace(/₂/g, "2").replace(/₁/g, "1").replace(/₃/g, "3").replace(/₄/g, "4").replace(/₅/g, "5").replace(/₆/g, "6").replace(/₇/g, "7").replace(/₈/g, "8").replace(/₉/g, "9").replace(/₀/g, "0").replace(/•/g, "-");
    }

    private static wrapText(text: string, maxChars: number): string {
        if (!text) return "";
        const words = text.split(/\s+/);
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
            const candidate = line ? `${line} ${word}` : word;
            if (candidate.length <= maxChars) line = candidate;
            else {
                if (line) lines.push(line);
                line = word;
            }
        }
        if (line) lines.push(line);
        return lines.join("\n");
    }

    private static escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}