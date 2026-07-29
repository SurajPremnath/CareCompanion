import { LucideIcon } from "lucide-react";
import type { ClinicalTrendSummary } from "../data/clinicalTrends";

export interface PatientViewModel {
    id: string;
    name: string;
    age: number | null;
    gender: string;
    diagnosis?: string;
    hospital?: string;
    doctor?: string;
    status?: string;
    patientId?: string;
}

export interface ClinicalTimelineEvent {

    date: string;

    symptoms: string[];

 vitals: {
        temperature?: number | null;
        pulse?: number | null;
        spo2?: number | null;
        systolic?: number | null;
        diastolic?: number | null;
        weight?: number | null;
    };

}

export interface VitalStats {

    min: number | null;

    max: number | null;

    average: number | null;

}

export interface ExecutiveSummaryViewModel {

    monitoringStart: string;

    monitoringEnd: string;


    totalDailyCareRecords: number;

clinicalTimeline: ClinicalTimelineEvent[];

    totalSelfDailyCareRecords: number;

    totalAssessments: number;



    vitalSummary: {

        temperature: VitalStats;

        pulse: VitalStats;

        spo2: VitalStats;

        systolic: VitalStats;

        diastolic: VitalStats;

        weight: VitalStats;

    };



    recordedEvents: {

        bloodCoughCount: number;

        symptomRecords: number;

    };



    timeline: {

        date: string;

        title: string;

        description: string;

    }[];

}

export interface TimelineEvent {
    id: string;

    type: string;

    title: string;

    description?: string;

    date: string;

    icon: string;

    color: string;

    payload?: unknown;
}

export interface ClinicalTrend {
    id: string;
    name: string;
    latestValue: string;
    previousValue?: string;
    trend: "up" | "down" | "stable";
}

export interface ReportData {
    patient: PatientViewModel;
    executiveSummary: ExecutiveSummaryViewModel;
    timeline: TimelineEvent[];
    trends: ClinicalTrend[];
}

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    active: boolean;
}

export interface FooterViewModel {
    generatedAt: string;
    version: string;
    generatedBy: string;
}



export interface JourneyViewModel {
    patient: PatientViewModel;

    executiveSummary: ExecutiveSummaryViewModel;

    timeline: TimelineEvent[];

clinicalTrends: ClinicalTrendSummary[];

    report: ReportData;

    navigation: NavigationItem[];

    footer: FooterViewModel;
}

