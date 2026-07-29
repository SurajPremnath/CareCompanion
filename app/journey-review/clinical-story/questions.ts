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
        title: "Symptoms",
        question:
            "How has the patient been feeling during this period?"
    },


    {
        id: "Q2",
        order: 2,
        icon: "❤️",
        title: "Vitals",
        question:
            "Were there any notable vital parameter observations?"
    },


    {
        id: "Q3",
        order: 3,
        icon: "📋",
        title: "Measurements",
        question:
            "What objective measurements were recorded?"
    },


    {
        id: "Q4",
        order: 4,
        icon: "⚠️",
        title: "Events",
        question:
            "What clinical events require attention?"
    }

];