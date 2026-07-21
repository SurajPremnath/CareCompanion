// components/journey-review/QuestionCard.tsx

"use client";

import { useState } from "react";

import {
  HelpCircle,
  AlertCircle,
} from "lucide-react";

import {
  QuestionView,
} from "@/lib/journey/view-models";

import { QuestionRenderer } from "./QuestionRenderer";

interface QuestionCardProps {
  question: QuestionView;

  questionNumber: number;

  onChange?: (
    value: string | string[],
  ) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  onChange,
}: QuestionCardProps) {
  const [value, setValue] = useState<
  string | string[]
>(
  question.answer ?? "",
);

  const updateValue = (
    newValue: string | string[],
  ) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-start gap-3">

        <div className="rounded-full bg-sky-100 px-3 py-2 text-sm font-bold text-sky-700">
          {questionNumber}
        </div>

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <HelpCircle className="h-5 w-5 text-sky-600" />

            <h4 className="font-semibold text-slate-900">
              {question.question}
            </h4>

            {question.required && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                Required
              </span>
            )}

          </div>

{question.helpText && (
  <p className="mt-2 text-sm text-slate-600">
    {question.helpText}
  </p>
)}

<div className="mt-5">
  <QuestionRenderer
    question={question}
    value={value}
    onChange={updateValue}
  />
</div>

          {question.required &&
            ((Array.isArray(value) &&
              value.length === 0) ||
              (!Array.isArray(value) &&
                value === "")) && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">

                <AlertCircle className="h-4 w-4" />

                This question requires an answer.

              </div>
            )}

        </div>

      </div>

    </div>
  );
}


