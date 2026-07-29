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

import type { ClinicalAnswers } from "./answers";



export function buildClinicalStory(
    weeklyData: any[]
) {


    const context =
        getClinicalStoryContext();



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
                            context
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
    ]

                        })
                    )

            };

        }
    );

}