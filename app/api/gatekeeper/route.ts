import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";

export async function POST(
    request: NextRequest
) {

    const body = await request.json();

    const report: string[] = [];

    report.push("============================================================");
    report.push("CAREVR GATEKEEPER VALIDATION REPORT");
    report.push("============================================================");
    report.push("");

    report.push(`Generated : ${new Date().toLocaleString()}`);
    report.push("");

    report.push("============================================================");
    report.push("ORIGINAL PRESCRIPTION");
    report.push("============================================================");
    report.push("");

    report.push(body.originalPrescription);

    report.push("");
    report.push("============================================================");
    report.push("VALIDATION CARDS");
    report.push("============================================================");

    for (const card of body.validationCards) {

        report.push("");
        report.push("------------------------------------------------------------");
        report.push(`CARD : ${card.card}`);
        report.push("------------------------------------------------------------");
        report.push("");

        for (const field of card.fields) {

            report.push(`FIELD : ${field.name}`);
            report.push("");

            report.push(
                JSON.stringify(
                    field.extracted,
                    null,
                    2
                )
            );

            report.push("");

        }

    }

    const filePath = path.join(
        process.cwd(),
        "GatekeeperValidationReport.txt"
    );

    fs.writeFileSync(
        filePath,
        report.join("\n"),
        "utf8"
    );

    console.log("");
    console.log("============================================================");
    console.log("CAREVR GATEKEEPER");
    console.log("============================================================");
    console.log(`Report written to : ${filePath}`);
    console.log("============================================================");
    console.log("");

    return NextResponse.json({
        success: true,
    });

}