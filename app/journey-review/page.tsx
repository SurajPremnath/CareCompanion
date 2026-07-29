import { JourneyDashboard } from "./JourneyDashboard";

import {
    buildPatient,
    navigation,
} from "./data";


export const dynamic = "force-dynamic";


export default async function JourneyReviewPage() {


    const journey = {

        patient:
            buildPatient(),


        executiveSummary: {
            monitoringStart: "",
            monitoringEnd: "",

            totalDailyCareRecords: 0,
            totalSelfDailyCareRecords: 0,
            totalAssessments: 0,

clinicalTimeline: [],

            vitalSummary: {
                temperature: {
                    min: null,
                    max: null,
                    average: null,
                },

                pulse: {
                    min: null,
                    max: null,
                    average: null,
                },

                spo2: {
                    min: null,
                    max: null,
                    average: null,
                },

                systolic: {
                    min: null,
                    max: null,
                    average: null,
                },

                diastolic: {
                    min: null,
                    max: null,
                    average: null,
                },

                weight: {
                    min: null,
                    max: null,
                    average: null,
                },
            },

            recordedEvents: {
                bloodCoughCount: 0,
                symptomRecords: 0,
            },

            timeline: [],
        },


        timeline: [],


        clinicalTrends: [],


        report: {
    patient: buildPatient(),

    executiveSummary: {
        monitoringStart: "",
        monitoringEnd: "",

        totalDailyCareRecords: 0,
        totalSelfDailyCareRecords: 0,
        totalAssessments: 0,

clinicalTimeline: [],

        vitalSummary: {
            temperature: {
                min: null,
                max: null,
                average: null,
            },

            pulse: {
                min: null,
                max: null,
                average: null,
            },

            spo2: {
                min: null,
                max: null,
                average: null,
            },

            systolic: {
                min: null,
                max: null,
                average: null,
            },

            diastolic: {
                min: null,
                max: null,
                average: null,
            },

            weight: {
                min: null,
                max: null,
                average: null,
            },
        },

        recordedEvents: {
            bloodCoughCount: 0,
            symptomRecords: 0,
        },

        timeline: [],
    },

    timeline: [],

    trends: [],
},


        navigation,


        footer: {

            generatedAt:
                new Date()
                    .toLocaleString(),


            generatedBy:
                "Suraj Premnath",


            version:
                "1.0",
        },

    };


    return (

        <JourneyDashboard
            journey={journey}
        />

    );

}