import fs from "fs";
import path from "path";

import { parse } from "csv-parse/sync";

interface CsvMedicine {
    id: string;
    medicine_code: string;
    brand_name: string;
    generic_name: string;
    strength: string;
    formulation: string;
    manufacturer: string;
    search_key: string;
    is_active: string;
    created_at: string;
    updated_at: string;
}

interface MedicineMaster {

    id: string;

    brandName: string;
    genericName: string;
    strength: string;
    formulation: string;
    manufacturer: string;

    route: string;

    schedule: string;

    therapeuticClass: string;

    atcCode: string;

    searchKeys: string[];

    aliases: string[];

    commonAdministration: string[];

    commonFrequency: string[];

    lasa: boolean;

    highRisk: boolean;

    controlledDrug: boolean;

    isActive: boolean;
}

const ROUTE: Record<string, string> = {

    tablet: "Oral",
    capsule: "Oral",
    syrup: "Oral",
    suspension: "Oral",
    drops: "Oral",

    injection: "IV/IM",

    inhaler: "Inhalation",
    nebules: "Inhalation",
    respules: "Inhalation",

    ointment: "Topical",
    cream: "Topical",
    gel: "Topical",

    "eye drops": "Ophthalmic",
    "ear drops": "Otic",
    "nasal spray": "Nasal"
};

const csvPath = path.resolve(
    process.cwd(),
    "lib/medication/data/medicine_master.csv"
);

const outputPath = path.resolve(
    process.cwd(),
    "lib/medication/data/medicineMaster.json"
);

const csv = fs.readFileSync(csvPath);

const rows = parse(csv, {

    columns: true,
    skip_empty_lines: true,
    trim: true
}) as CsvMedicine[];

const medicines: MedicineMaster[] = rows.map((row) => {

    const formulation = (row.formulation ?? "")
        .trim()
        .toLowerCase();

    return {

        id: row.medicine_code,

        brandName: row.brand_name,

        genericName: row.generic_name,

        strength: row.strength,

        formulation: row.formulation,

        manufacturer:
            row.manufacturer === "null"
                ? ""
                : row.manufacturer,

        route:
            ROUTE[formulation] ??
            "Oral",

        schedule: "",

        therapeuticClass: "",

        atcCode: "",

        searchKeys:
            (row.search_key ?? "")
                .split(/\s+/)
                .filter(Boolean),

        aliases: [],

        commonAdministration: [],

        commonFrequency: [],

        lasa: false,

        highRisk: false,

        controlledDrug: false,

        isActive:
            String(row.is_active).toLowerCase() === "true"
    };

});

medicines.sort((a, b) =>
    a.brandName.localeCompare(b.brandName)
);

fs.writeFileSync(
    outputPath,
    JSON.stringify(medicines, null, 2)
);

