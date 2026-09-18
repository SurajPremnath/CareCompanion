import {
    CLINICAL_QUESTIONS
}
from "./questions";


import {
    generateClinicalAnswers
}
from "./answers";


import {
    getClinicalStoryContext
}
from "./storyContext";

import type {
    ClinicalAnswers
} from "./answers";

import type {
    DoctorsNote
} from "@/lib/types/doctorsNote";



export function buildClinicalStory(
    weeklyData: any[],
    doctorsNotes: DoctorsNote[] = [],
) {


    const context =
        getClinicalStoryContext();


    const clinicalStoryContext = {
        ...context,

        doctorsNotes,
    };


    const weeklyAnswers =
        weeklyData
            .filter(
                week =>
                    week.recordCount > 0
            )
            .map(week => {

                return {

                    weekLabel:
                        week.weekLabel,


                    answers:
                        generateClinicalAnswers(
                            week,
                            clinicalStoryContext
                        )

                };

            });



    return CLINICAL_QUESTIONS.map(
        question => {


            return {

                id:
                    question.id,

                icon:
                    question.icon,

                title:
                    question.title,

                question:
                    question.question,


                order:
                    question.order,


                periods:
                    weeklyAnswers.map(
                        week => ({

                            weekLabel:
                                week.weekLabel,


                            answer:
                                week.answers[
                                    question.id as keyof ClinicalAnswers
                                ] ?? ""

                        })
                    )

            };

        }
    );

}


function removeDuplicateWords(
    text: string
): string {

    if (!text) {
        return text;
    }

    const words = text.split(/(\s+|,)/);

    const seen = new Set<string>();

    return words.filter(word => {

        const key =
            word.trim().toLowerCase();

        if (
            key === "" ||
            key === ","
        ) {
            return true;
        }

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;

    }).join("");

}