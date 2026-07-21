// components/journey-review/JourneyQuestions.tsx

"use client";

import { QuestionView } from "@/lib/journey/view-models";
import { QuestionCard } from "./QuestionCard";

interface JourneyQuestionsProps {
  questions: QuestionView[];

  onAnswerChange?: (
    questionId: string,
    value: string | string[],
  ) => void;
}

export function JourneyQuestions({
  questions,
  onAnswerChange,
}: JourneyQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <h3 className="text-xl font-bold text-slate-900">
          Additional Information Required
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Please answer the following questions to complete the
          patient's clinical journey.
        </p>

      </div>

      <div className="space-y-6 p-6">

        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            onChange={value =>
              onAnswerChange?.(
                question.id,
                value,
              )
            }
          />
        ))}

      </div>

    </div>
  );
}