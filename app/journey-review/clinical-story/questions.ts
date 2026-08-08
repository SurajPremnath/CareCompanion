export interface ClinicalQuestion {

    id: string;

    order: number;

    question: string;
}


export const CLINICAL_QUESTIONS = [
    {
        id: "Q1",
        order: 1,
        icon: "🩺",
        title: "Health Events",
        question: "What happened during this period?"
    },

    {
        id: "Q2",
        order: 2,
        icon: "🔄",
        title: "Health Changes",
        question: "What changed during this period?"
    },

    {
        id: "Q3",
        order: 3,
        icon: "❤️",
        title: "Patient Status",
        question: "How is the patient doing now?"
    },

    {
        id: "Q4",
        order: 4,
        icon: "💊",
        title: "Current Medications & Treatment",
        question: "What treatment is the patient currently receiving?"
    },

    {
        id: "Q5",
        order: 5,
        icon: "📋",
        title: "Latest Clinical Plan",
        question: "What was the latest clinical plan?"
    }
];