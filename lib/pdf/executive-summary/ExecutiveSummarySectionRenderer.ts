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
    const {
        page,
        x,
        y,
        width,
        boldFont,
        regularFont
    } = options;

    let currentY =
        this.drawHeading(
            page,
            x,
            y,
            width,
            "1",
            "Health Events",
            "What happened during the patient's journey?",
            boldFont,
            regularFont
        );

    for (
        const period of section?.periods ?? []
    ) {

        let answer =
            this.cleanText(
                period?.answer
            );

        /*
         * --------------------------------------------------
         * DEDUPLICATE SYMPTOMS
         * --------------------------------------------------
         *
         * The clinical story may contain the same symptom
         * more than once because it is aggregated from
         * multiple Daily Care records.
         *
         * Other Symptoms are already concatenated into the
         * symptoms collection upstream.
         *
         * At this final PDF boundary, remove duplicate
         * symptom values without changing the rest of the
         * clinical answer.
         * --------------------------------------------------
         */

        answer =
            this.deduplicateSymptoms(
                answer
            );

        answer =
            this.safePdfText(
                answer ||
                "No events recorded during this period."
            );

        const wrapped =
            this.wrapText(
                answer,
                82
            );

        const lines =
            wrapped.split("\n").length;

        const height =
            Math.max(
                58,
                30 + lines * 11
            );

        page.drawRectangle({
            x,
            y: currentY - height,
            width,
            height,
            borderWidth: 0.7,
            borderColor: rgb(0.88, 0.91, 0.94),
            color: rgb(0.985, 0.99, 0.995)
        });

        page.drawCircle({
            x: x + 12,
            y: currentY - 16,
            size: 4,
            color: rgb(0.09, 0.41, 0.67)
        });

        page.drawText(
            this.safePdfText(
                String(
                    period?.weekLabel ??
                    "Recorded period"
                )
            ),
            {
                x: x + 25,
                y: currentY - 19,
                font: boldFont,
                size: 9,
                color: rgb(0.09, 0.41, 0.67)
            }
        );

        page.drawText(
            wrapped,
            {
                x: x + 25,
                y: currentY - 37,
                font: regularFont,
                size: 8.5,
                lineHeight: 11,
                maxWidth: width - 35,
                color: rgb(0.28, 0.34, 0.41)
            }
        );

        currentY -=
            height + 7;
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
    this.extractCategory(
        source,
        ["Symptoms Change", "Symptom progression"],
        ["Vital Changes", "Medication Changes", "Clinical Changes"]
    ),

    this.extractCategory(
        source,
        ["Vital Changes", "Vital changes"],
        ["Medication Changes", "Clinical Changes"]
    ) || "No vitals recorded.",

    this.extractCategory(
        source,
        ["Medication Changes", "Medication changes"],
        ["Clinical Changes"]
    )
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
    const {
        page,
        x,
        y,
        width,
        boldFont,
        regularFont
    } = options;

    let currentY =
        this.drawHeading(
            page,
            x,
            y,
            width,
            "3",
            "Patient Status",
            "How is the patient doing now?",
            boldFont,
            regularFont
        );

    const answer =
        this.cleanText(
            section?.periods?.[
                section.periods.length - 1
            ]?.answer
        );


const vitals =
    this.parseVitals(answer);

const fallbackVitals: {
    temperature?: number | null;
    pulse?: number | null;
    spo2?: number | null;
    systolic?: number | null;
    diastolic?: number | null;
    weight?: number | null;
} =
    summary?.fallbackVitals ?? {};

const fallbackVitalDates: {
    temperature?: string | null;
    pulse?: string | null;
    spo2?: string | null;
    systolic?: string | null;
    diastolic?: string | null;
    weight?: string | null;
} =
    summary?.fallbackVitalDates ?? {};

const formatFallbackDate = (
    value: string | null | undefined
): string | null => {
    if (!value) {
        return null;
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        }
    );
};

const applyFallback = (
    data: any,
    fallbackValue: number | null | undefined,
    suffix: string,
    fallbackDate: string | null | undefined
) => {
    const currentValue =
        String(
            data?.current ?? ""
        )
            .trim();

    const hasRecordedValue =
        currentValue !== "" &&
        currentValue !== "-" &&
        currentValue !== "â€”" &&
        currentValue !== "â€“" &&
        currentValue !== "Ã¢â‚¬â€" &&
        currentValue !== "Ã¢â‚¬â€œ";

    if (hasRecordedValue) {
        return data;
    }

    if (
        fallbackValue === null ||
        fallbackValue === undefined
    ) {
        return data;
    }

    const formatted =
        `${fallbackValue}${suffix}`;

    return {
        current: formatted,
        min: formatted,
        max: formatted,
        fallback: true,
        fallbackDate: formatFallbackDate(fallbackDate)
    };
};

vitals.temperature =
    applyFallback(
        vitals.temperature,
        fallbackVitals.temperature,
        "°F",
        fallbackVitalDates.temperature
    );

vitals.pulse =
    applyFallback(
        vitals.pulse,
        fallbackVitals.pulse,
        " bpm",
        fallbackVitalDates.pulse
    );

vitals.spo2 =
    applyFallback(
        vitals.spo2,
        fallbackVitals.spo2,
        "%",
        fallbackVitalDates.spo2
    );

if (
    !vitals.bloodPressure &&
    fallbackVitals.systolic !== null &&
    fallbackVitals.systolic !== undefined &&
    fallbackVitals.diastolic !== null &&
    fallbackVitals.diastolic !== undefined
) {
    const formatted =
        `${fallbackVitals.systolic}/${fallbackVitals.diastolic} mmHg`;

    vitals.bloodPressure = {
        current: formatted,
        min: formatted,
        max: formatted,
        fallback: true,
        fallbackDate: formatFallbackDate(
            fallbackVitalDates.systolic
        )
    };
}

const cards = [
    [
        "Blood Pressure",
        vitals.bloodPressure
    ],
    [
        "Pulse",
        vitals.pulse
    ],
    [
        "SpO2",
        vitals.spo2
    ],
    [
        "Temperature",
        vitals.temperature
    ]
] as const;

const gap = 7;
const cardHeight = 88;

const cardWidth =
    (width - gap * (cards.length - 1)) /
    cards.length;

for (
    let i = 0;
    i < cards.length;
    i++
) {

const [label, data] = cards[i] ?? ["Vital", undefined];
const cardX = x + i * (cardWidth + gap);

const value = (
    data !== null &&
    typeof data === "object"
)
    ? {
        current: data.current ?? "—",
        min: data.min ?? "—",
        max: data.max ?? "—",
        fallback: data.fallback === true,
        fallbackDate: data.fallbackDate ?? null
    }
    : {
        current: "—",
        min: "—",
        max: "—",
        fallback: false,
        fallbackDate: null
    };

    page.drawRectangle({
        x: cardX,
        y:
            currentY -
            cardHeight,
        width: cardWidth,
        height: cardHeight,
        borderWidth: 0.8,
        borderColor:
            rgb(
                0.86,
                0.89,
                0.93
            ),
        color:
            rgb(
                1,
                1,
                1
            )
    });

    page.drawText(
        label,
        {
            x:
                cardX + 8,
            y:
                currentY - 16,
            font:
                boldFont,
            size: 8.5,
            color:
                rgb(
                    0.40,
                    0.45,
                    0.52
                )
        }
    );

    page.drawText(
        value.fallback
            ? "Last recorded"
            : "Current",
        {
            x:
                cardX + 8,
            y:
                currentY - 31,
            font:
                regularFont,
            size: 7.5,
            color:
                rgb(
                    0.55,
                    0.59,
                    0.65
                )
        }
    );

    page.drawText(
        this.safePdfText(
            value.current
        ),
        {
            x:
                cardX + 8,
            y:
                currentY - 48,
            font:
                boldFont,
            size: 12,
            color:
                rgb(
                    0.09,
                    0.13,
                    0.20
                )
        }
    );

    if (value.fallback && value.fallbackDate) {
        page.drawText(
            `Recorded: ${value.fallbackDate}`,
            {
                x:
                    cardX + 8,
                y:
                    currentY - 57,
                font:
                    regularFont,
                size: 6.5,
                color:
                    rgb(
                        0.42,
                        0.47,
                        0.53
                    )
            }
        );
    }

    page.drawLine({
        start: {
            x:
                cardX + 8,
            y:
                currentY - 61
        },
        end: {
            x:
                cardX +
                cardWidth -
                8,
            y:
                currentY - 61
        },
        thickness: 0.5,
        color:
            rgb(
                0.90,
                0.92,
                0.94
            )
    });

    page.drawText(
        `Min  ${this.safePdfText(value.min)}`,
        {
            x:
                cardX + 8,
            y:
                currentY - 72,
            font:
                regularFont,
            size: 7,
            color:
                rgb(
                    0.42,
                    0.47,
                    0.53
                )
        }
    );

    page.drawText(
        `Max  ${this.safePdfText(value.max)}`,
        {
            x:
                cardX + 8,
            y:
                currentY - 82,
            font:
                regularFont,
            size: 7,
            color:
                rgb(
                    0.42,
                    0.47,
                    0.53
                )
        }
    );
    }



    currentY -=
        cardHeight + 13;

    const fallbackNotes =
        Array.isArray(
            summary?.fallbackVitalNotes
        )
            ? summary.fallbackVitalNotes
            : [];

    for (
        const note of fallbackNotes
    ) {
        page.drawText(
            this.safePdfText(note),
            {
                x,
                y: currentY,
                font:
                    regularFont,
                size: 7.5,
                color:
                    rgb(
                        0.55,
                        0.59,
                        0.65
                    ),
                maxWidth: width
            }
        );

        currentY -= 16;
    }

    return currentY - 8;
}

static drawClinicalPlan(
    options: ExecutiveSummarySectionOptions,
    section: ExecutiveSummarySection | undefined
): number {
    const { page, x, y, width, boldFont, regularFont } = options;

    let currentY = this.drawHeading(
        page,
        x,
        y,
        width,
        "5",
        "Latest Clinical Plan",
        "Documented doctor notes for the selected period",
        boldFont,
        regularFont
    );

    const period =
        section?.periods?.[section.periods.length - 1];

    const answer = this.cleanText(period?.answer);

    const emptyMessages = new Set([
        "No doctor notes were recorded during this period.",
        "No clinical plan was recorded."
    ]);

    const rawLines = answer
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    const noteEntries: { date: string; note: string }[] = [];

    let currentDate = "";
    let currentNoteLines: string[] = [];

    const flushNote = () => {
        const noteText = currentNoteLines.join("\n").trim();

        if (currentDate && noteText) {
            noteEntries.push({
                date: currentDate,
                note: noteText
            });
        }

        currentDate = "";
        currentNoteLines = [];
    };

    for (const line of rawLines) {
        if (/^Doctor notes$/i.test(line)) {
            continue;
        }

        if (emptyMessages.has(line)) {
            continue;
        }

const dateMatch = line.match(
    /^(\d{2}\s+[A-Za-z]{3,4}\s+\d{4},?\s+\d{1,2}:\d{2}(?:\s*[ap]m)?)\s+(?:[—–-]\s*)?Doctor note$/i
);

        if (dateMatch) {
            flushNote();
            currentDate = dateMatch[1].trim();
            continue;
        }

        if (currentDate) {
            currentNoteLines.push(line);
        }
    }

    flushNote();

    if (noteEntries.length === 0) {
        const message =
            answer && !emptyMessages.has(answer)
                ? answer
                : "No doctor notes were recorded during this period.";

const safeMessage = this.safePdfText(message);
const messageLines = this.wrapText(safeMessage, 92);
const lineCount = messageLines.split("\n").length;
const height = Math.max(48, 24 + lineCount * 12);

page.drawRectangle({
    x,
    y: currentY - height,
    width,
    height,
    borderWidth: 0.7,
    borderColor: rgb(0.88, 0.91, 0.94),
    color: rgb(0.985, 0.99, 0.995)
});

let messageY = currentY - 20;

for (const line of messageLines.split("\n")) {
    page.drawText(line, {
        x: x + 10,
        y: messageY,
        font: regularFont,
        size: 8.5,
        lineHeight: 12,
        maxWidth: width - 20,
        color: rgb(0.28, 0.34, 0.41)
    });

    messageY -= 12;
}

        return currentY - height - 8;
    }

    const dateWidth = width * 0.27;
    const noteWidth = width - dateWidth;
    const headerHeight = 24;

    page.drawRectangle({
        x,
        y: currentY - headerHeight + 5,
        width,
        height: headerHeight,
        borderWidth: 0.5,
        borderColor: rgb(0.84, 0.88, 0.92),
        color: rgb(0.94, 0.97, 0.99)
    });

    page.drawText("Date & Time", {
        x: x + 5,
        y: currentY - 11,
        size: 8,
        font: boldFont,
        maxWidth: dateWidth - 10
    });

    page.drawText("Doctor's Notes", {
        x: x + dateWidth + 5,
        y: currentY - 11,
        size: 8,
        font: boldFont,
        maxWidth: noteWidth - 10
    });

    currentY -= headerHeight;

    const sortedEntries = [...noteEntries].sort(
        (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
    );

    for (const entry of sortedEntries) {
        const dateText = this.safePdfText(entry.date);
        const noteText = this.safePdfText(entry.note);

const wrappedDate = this.wrapText(dateText, 24);
const wrappedNote = this.wrapText(noteText, 68);

const dateLineCount = wrappedDate.split("\n").length;
const noteLineCount = wrappedNote.split("\n").length;

        const rowHeight = Math.max(
            30,
            14 + Math.max(dateLineCount, noteLineCount) * 11
        );

page.drawText(wrappedDate, {
    x: x + 5,
    y: currentY - 16,
    font: regularFont,
    size: 8,
    lineHeight: 11,
    maxWidth: dateWidth - 10,
    color: rgb(0.28, 0.34, 0.41)
});

page.drawText(wrappedNote, {
    x: x + dateWidth + 5,
    y: currentY - 16,
    font: regularFont,
    size: 8,
    lineHeight: 11,
    maxWidth: noteWidth - 10,
    color: rgb(0.28, 0.34, 0.41)
});

        currentY -= rowHeight;

        page.drawLine({
            start: { x, y: currentY + 5 },
            end: { x: x + width, y: currentY + 5 },
            thickness: 0.4,
            color: rgb(0.88, 0.90, 0.93)
        });
    }

    return currentY - 12;
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



private static deduplicateSymptoms(
    answer: string
): string {

    if (!answer) {
        return "";
    }

    const match =
        answer.match(
            /^(\s*Symptoms\s*)([\s\S]*)$/i
        );

    if (!match) {
        return answer;
    }

    const prefix =
        match[1];

    const symptomText =
        match[2]
            .trim();

    if (!symptomText) {
        return answer;
    }

    /*
     * Symptoms are currently rendered as a comma-separated
     * list. Preserve the existing display format while
     * removing duplicate symptom values.
     */
    const symptoms =
        symptomText
            .split(",")
            .map(
                symptom =>
                    symptom.trim()
            )
            .filter(Boolean);

    const seen =
        new Set<string>();

    const uniqueSymptoms =
        symptoms.filter(
            symptom => {

                const key =
                    symptom
                        .toLowerCase();

                if (
                    seen.has(key)
                ) {
                    return false;
                }

                seen.add(key);

                return true;
            }
        );

    return (
        prefix +
        uniqueSymptoms.join(", ")
    );
}


    private static extractYesterdaySymptoms(answer: string): string[] {
        const match = answer.match(/Yesterday's symptoms\s*([\s\S]*)$/i);
        if (!match?.[1]) return [];
        return match[1].split("\n").map(value => value.replace(/^[•●▪\-]+\s*/, "").trim()).filter(Boolean);
    }

private static extractCategory(
    answer: string,
    labels: string[],
    stopLabels: string[]
): string {
    if (!answer) return "";

    const labelPattern = labels.map(label =>
        this.escapeRegex(label)
    ).join("|");

    const stopPattern = stopLabels.length > 0
        ? stopLabels.map(label =>
            this.escapeRegex(label)
        ).join("|")
        : "";

    const expression = stopPattern
        ? new RegExp(
            `(?:${labelPattern})\\s*[:\\-]?\\s*([\\s\\S]*?)(?=\\s+(?:${stopPattern})\\s*[:\\-]?|$)`,
            "i"
        )
        : new RegExp(
            `(?:${labelPattern})\\s*[:\\-]?\\s*([\\s\\S]*?)(?=\\s+(?:Medication Changes|Clinical Changes|Symptoms Change|Vital Changes|Symptom progression)\\s*[:\\-]?|$)`,
            "i"
        );

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