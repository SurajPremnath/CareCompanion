"use client";

import type {
    PrescriptionMedicineRecord,
} from "@/lib/prescription/prescriptionTypes";

import MedicineSearch from "@/Components/dashboard/MedicationSearch";

interface PendingMedicationRowProps {

    medicine: PrescriptionMedicineRecord;

    userId: string;

    onChange: (
        medicine: PrescriptionMedicineRecord
    ) => void;

}

const timingOptions = [

    {
        value: "BEFORE_BREAKFAST",
        label: "Before Breakfast",
    },

    {
        value: "AFTER_BREAKFAST",
        label: "After Breakfast",
    },

    {
        value: "BEFORE_LUNCH",
        label: "Before Lunch",
    },

    {
        value: "AFTER_LUNCH",
        label: "After Lunch",
    },

    {
        value: "BEFORE_DINNER",
        label: "Before Dinner",
    },

    {
        value: "AFTER_DINNER",
        label: "After Dinner",
    },

    {
        value: "BEDTIME",
        label: "Bedtime",
    },

];

const doseOptions = [

    "",

    "125 mg",

    "250 mg",

    "500 mg",

    "650 mg",

    "750 mg",

    "1 g",

    "2.5 ml",

    "5 ml",

    "10 ml",

    "15 ml",

    "20 ml",

];

const frequencyOptions = [

    "",

    "Once Daily",

    "Twice Daily",

    "Three Times Daily",

    "Four Times Daily",

    "SOS",

];

export default function PendingMedicationRow({

    medicine,

    userId,

    onChange,

}: PendingMedicationRowProps) {

    function update(

        changes:
        Partial<PrescriptionMedicineRecord>

    ) {

        onChange({

            ...medicine,

            ...changes,

        });

    }

    return (

        <tr>

            <td
                style={cellStyle}
                data-label="Medicine"
            >

                <MedicineSearch

                    medicineName={
                        medicine.medicineName ?? ""
                    }

                    selectedDose={
                        medicine.strength ?? ""
                    }

                    onMedicineSelected={(
                        medicineName,
                        selectedDose
                    ) => {

                        update({

                            medicineName,

                            strength: selectedDose,

                            validationStatus:
                                "PENDING",

                            validatedAt: null,

                            validatedBy: null,

                        });

                    }}

                />

            </td>

            <td
                style={cellStyle}
                data-label="Dose"
            >

                <select
                    value={medicine.strength ?? ""}
                    onChange={(event) =>

                        update({

                            strength:
                                event.target.value,

                        })

                    }
                    style={selectStyle}
                >

                    {doseOptions.map(option => (

                        <option
                            key={option}
                            value={option}
                        >

                            {option || "--"}

                        </option>

                    ))}

                </select>

            </td>

            <td
                style={cellStyle}
                data-label="Frequency"
            >

                <select

                    value={medicine.frequency ?? ""}

                    onChange={(event) =>

                        update({

                            frequency:
                                event.target.value,

                        })

                    }

                    style={selectStyle}

                >

                    {frequencyOptions.map(option => (

                        <option

                            key={option}

                            value={option}

                        >

                            {option || "--"}

                        </option>

                    ))}

                </select>

            </td>

            <td
                style={cellStyle}
                data-label="Duration"
            >

                <input

                    type="text"

                    value={medicine.duration ?? ""}

                    onChange={(event) =>

                        update({

                            duration:
                                event.target.value,

                        })

                    }

                    style={{

                        ...inputStyle,

                        minWidth: "80px",

                    }}

                />

            </td>

            <td
                style={cellStyle}
                data-label="Timing"
            >

                <select

                    value={
                        medicine.timings[0] ?? ""
                    }

                    onChange={(event) =>

                        update({

                            timings:
                                event.target.value
                                    ? [
                                        event.target.value,
                                    ]
                                    : [],

                        })

                    }

                    style={selectStyle}

                >

                    <option value="">
                        --
                    </option>

                    {timingOptions.map(option => (

                        <option

                            key={option.value}

                            value={option.value}

                        >

                            {option.label}

                        </option>

                    ))}

                </select>

            </td>

            <td
                style={cellStyle}
                data-label="Status"
            >

                <select

                    value={
                        medicine.validationStatus
                    }

                    onChange={(event) => {

                        const status =
                            event.target.value as
                                | "PENDING"
                                | "VALIDATED"
                                | "EXCLUDE";

                        update({

                            validationStatus: status,

                            validatedAt:

                                status === "VALIDATED"

                                    ? new Date().toISOString()

                                    : null,

                            validatedBy:

                                status === "VALIDATED"

                                    ? userId

                                    : null,

                        });

                    }}

                    style={{

                        ...selectStyle,

                        minWidth: "100px",

                    }}

                >

                    <option value="PENDING">

                        Pending

                    </option>

                    <option value="VALIDATED">

                        Validated

                    </option>

                    <option value="EXCLUDE">

                        Exclude

                    </option>

                </select>

            </td>

        </tr>

    );

}

const cellStyle: React.CSSProperties = {

    padding: "12px",

    borderBottom: "1px solid #E5E7EB",

    verticalAlign: "middle",

};

const inputStyle: React.CSSProperties = {

    width: "100%",

    padding: "8px",

    border: "1px solid #D1D5DB",

    borderRadius: "6px",

    fontSize: "14px",

    boxSizing: "border-box",

};

const selectStyle: React.CSSProperties = {

    ...inputStyle,

    cursor: "pointer",

};