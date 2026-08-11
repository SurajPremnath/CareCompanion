"use client";

import type { Patient } from "@/lib/types/patient";

function getFirstName(
    fullName: string
): string {
    return (
        fullName
            .trim()
            .split(/\s+/)[0] ??
        fullName
    );
}

function calculateAge(
    dateOfBirth: string | null
): number | null {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate =
        new Date(dateOfBirth);

    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {
        return null;
    }

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
                birthDate.getDate()
        )
    ) {
        age--;
    }

    return age >= 0
        ? age
        : null;
}

function getInitials(
    fullName: string
): string {
    const parts =
        fullName
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 0) {
        return "";
    }

    if (parts.length === 1) {
        return parts[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}

interface PatientPanelProps {
    userName: string;
    patients: Patient[];
    selectedPatientId: string | null;
    onPatientSelect: (patient: Patient) => void;
    careMode: "FAMILY" | "SELF";
}

export default function PatientPanel({
    userName,
    patients,
    selectedPatientId,
    onPatientSelect,
    careMode,
}: PatientPanelProps) {

    if (careMode === "SELF") {
        return null;
    }

    return (
        <section className="carevr-patient-panel">

            <div className="carevr-patient-panel-heading">

                <span className="carevr-patient-greeting">
    Good morning{" "}
    {userName
        .trim()
        .split(/\s+/)[0]}
    .
</span>

                <h2>
                    People you care for:
                </h2>

            </div>


            {patients.length === 0 ? (

                <div className="carevr-patient-panel-empty">
                    No people available.
                </div>

            ) : (

                <div
                    className="carevr-patient-panel-list"
                    role="list"
                    aria-label="People you care for"
                >

                    {patients.map((patient) => {

                        const isSelected =
                            patient.id ===
                            selectedPatientId;

                        const age =
                            calculateAge(
                                patient.dateOfBirth
                            );

                        return (
                            <button
                                key={patient.id}
                                type="button"
                                role="listitem"
                                className={
                                    isSelected
                                        ? "carevr-patient-card carevr-patient-card-selected"
                                        : "carevr-patient-card"
                                }
                                aria-pressed={
                                    isSelected
                                }
                                onClick={() =>
                                    onPatientSelect(
                                        patient
                                    )
                                }
                            >

                                <div className="carevr-patient-card-top">

                                    <span className="carevr-patient-avatar">
                                        {
                                            getInitials(
                                                patient.fullName
                                            )
                                        }
                                    </span>

                                    {isSelected && (
                                        <span
                                            className="carevr-patient-selected"
                                            aria-label="Selected"
                                        >
                                            ✓
                                        </span>
                                    )}

                                </div>


                                <div className="carevr-patient-card-details">

                                    <strong>
                                        {
                                            patient.fullName
                                        }
                                    </strong>

                                    <span>
                                        {age !== null
                                            ? `${age} • `
                                            : ""}
                                        {patient.gender ?? ""}
                                    </span>

                                </div>

                            </button>
                        );
                    })}

                </div>
            )}


            <style jsx>{`

                .carevr-patient-panel {
                    width: 100%;
                    box-sizing: border-box;
                }

                .carevr-patient-panel-heading {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 8px;
                    white-space: nowrap;
                }

                .carevr-patient-greeting {
                    color: #101d45;
                    font-size: 14px;
                    line-height: 1.25;
                    font-weight: 700;
                }

                .carevr-patient-panel-heading h2 {
                    margin: 0;
                    color: #4f20d8;
                    font-size: 14px;
                    line-height: 1.25;
                    font-weight: 700;
                }

                .carevr-patient-panel-icon {
                    color: #4f20d8;
                    font-size: 17px;
                    line-height: 1;
                }

                .carevr-patient-panel-list {
                    width: 100%;
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding: 1px 1px 4px;
                    box-sizing: border-box;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                }

                .carevr-patient-card {
                    position: relative;
                    flex: 0 0 136px;
                    height: 108px;
                    padding: 9px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 7px;
                    border: 1px solid #e3e0eb;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.92);
                    color: #101d45;
                    font-family: inherit;
                    text-align: left;
                    cursor: pointer;
                    box-sizing: border-box;
                    transition:
                        border-color 0.15s ease,
                        background 0.15s ease,
                        box-shadow 0.15s ease;
                }

                .carevr-patient-card-selected {
                    border: 2px solid #5630e8;
                    background: #faf8ff;
                    box-shadow:
                        0 2px 8px rgba(79, 32, 216, 0.07);
                }

                .carevr-patient-avatar {
                    width: 38px;
                    height: 38px;
                    flex: 0 0 auto;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0eaff;
                    color: #4f20d8;
                    font-size: 15px;
                    font-weight: 800;
                }

                .carevr-patient-selected {
                    width: 23px;
                    height: 23px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: #4f20d8;
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 800;
                }

                .carevr-patient-card-details {
                    min-width: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .carevr-patient-card-details strong {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #101d45;
                    font-size: 13px;
                    line-height: 1.3;
                    font-weight: 800;
                }

                .carevr-patient-card-details span {
                    color: #59657f;
                    font-size: 10px;
                    line-height: 1.3;
                }

                .carevr-patient-panel-empty {
                    min-height: 72px;
                    padding: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px dashed #d1d5db;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.8);
                    color: #6b7280;
                    font-size: 14px;
                    box-sizing: border-box;
                }

                @media (min-width: 600px) {

                    .carevr-patient-panel-list {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(136px, 1fr)
                            );
                        gap: 8px;
                        overflow-x: visible;
                    }

                    .carevr-patient-card {
                        width: 100%;
                        height: 108px;
                        flex-basis: auto;
                    }

                }

            `}</style>

        </section>
    );
}