// components/journey/questions/QuestionRenderer.tsx

"use client";

import {
  QuestionType,
} from "@/lib/journey";

import {
  QuestionOptionView,
  QuestionView,
} from "@/lib/journey/view-models";

interface QuestionRendererProps {
  question: QuestionView;

  value: string | string[];

  onChange: (
    value: string | string[],
  ) => void;

  disabled?: boolean;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
}: QuestionRendererProps) {
  switch (question.type) {
    case QuestionType.BOOLEAN:
      return (
        <YesNoQuestion
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case QuestionType.SINGLE_SELECT:
      return (
        <SingleSelectQuestion
          options={question.options ?? []}
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case QuestionType.MULTI_SELECT:
      return (
        <MultiSelectQuestion
          options={question.options ?? []}
          value={
            Array.isArray(value)
              ? value
              : []
          }
          disabled={disabled}
          onChange={onChange}
        />
      );

    case QuestionType.NUMBER:
      return (
        <NumberQuestion
          question={question}
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case QuestionType.DATE:
      return (
        <DateQuestion
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case QuestionType.TEXTAREA:
      return (
        <TextAreaQuestion
          question={question}
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case QuestionType.TEXT:
    default:
      return (
        <TextQuestion
          question={question}
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );
  }
}

function YesNoQuestion({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled: boolean;
  onChange(
    value: string,
  ): void;
}) {
  return (
    <div className="flex gap-4">

      <ChoiceButton
        label="Yes"
        selected={value === "YES"}
        disabled={disabled}
        onClick={() =>
          onChange("YES")
        }
      />

      <ChoiceButton
        label="No"
        selected={value === "NO"}
        disabled={disabled}
        onClick={() =>
          onChange("NO")
        }
      />

    </div>
  );
}

function SingleSelectQuestion({
  options,
  value,
  onChange,
  disabled,
}: {
  options: QuestionOptionView[];
  value: string;
  disabled: boolean;
  onChange(
    value: string,
  ): void;
}) {
  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value,
        )
      }
      className="w-full rounded-xl border border-slate-300 bg-white p-3 focus:border-sky-600 focus:outline-none"
    >

      <option value="">
        Select an option
      </option>

      {options.map((option) => (
        <option
          key={option.id}
          value={option.value}
        >
          {option.label}
        </option>
      ))}

    </select>
  );
}

function MultiSelectQuestion({
  options,
  value,
  onChange,
  disabled,
}: {
  options: QuestionOptionView[];
  value: string[];
  disabled: boolean;
  onChange(value: string[]): void;
}) {
  return (
    <div className="space-y-3">

      {options.map(
        (option) => {
          const checked =
            value.includes(
              option.value,
            );

          return (
            <label
              key={option.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >

              <input
                disabled={
                  disabled
                }
                type="checkbox"
                checked={
                  checked
                }
                onChange={(
                  e,
                ) => {
                  let next =
                    [
                      ...value,
                    ];

                  if (
                    e.target
                      .checked
                  ) {
                    next.push(
                      option.value,
                    );
                  } else {
                    next =
                      next.filter(
                        (
                          x,
                        ) =>
                          x !==
                          option.value,
                      );
                  }

                  onChange(
                    next,
                  );
                }}
              />

              {option.label}

            </label>
          );
        },
      )}

    </div>
  );
}

function TextQuestion({
  question,
  value,
  onChange,
  disabled,
}: {
  question: QuestionView;
  value: string;
  disabled: boolean;
  onChange(
    value: string,
  ): void;
}) {
  return (
    <input
      disabled={disabled}
      type="text"
      value={value}
      placeholder={
        question.placeholder
      }
      onChange={(e) =>
        onChange(
          e.target.value,
        )
      }
      className="w-full rounded-xl border border-slate-300 bg-white p-3 focus:border-sky-600 focus:outline-none"
    />
  );
}

function NumberQuestion({
  question,
  value,
  onChange,
  disabled,
}: {
  question: QuestionView;
  value: string;
  disabled: boolean;
  onChange(
    value: string,
  ): void;
}) {
  return (
    <input
      disabled={disabled}
      type="number"
      value={value}
      placeholder={
        question.placeholder
      }
      onChange={(e) =>
        onChange(
          e.target.value,
        )
      }
      className="w-full rounded-xl border border-slate-300 bg-white p-3 focus:border-sky-600 focus:outline-none"
    />
  );
}

function DateQuestion({
  value,
  onChange,
  disabled,
}: {
  value: string;
  disabled: boolean;
  onChange(
    value: string,
  ): void;
}) {
  return (
    <input
      disabled={disabled}
      type="date"
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value,
        )
      }
      className="w-full rounded-xl border border-slate-300 bg-white p-3 focus:border-sky-600 focus:outline-none"
    />
  );
}

function TextAreaQuestion({
  question,
  value,
  onChange,
  disabled,
}: {
  question: QuestionView;
  value: string;
  disabled: boolean;
  onChange(
    value: string,
  ): void;
}) {
  return (
    <textarea
      disabled={disabled}
      rows={5}
      value={value}
      placeholder={
        question.placeholder
      }
      onChange={(e) =>
        onChange(
          e.target.value,
        )
      }
      className="w-full rounded-xl border border-slate-300 bg-white p-3 focus:border-sky-600 focus:outline-none"
    />
  );
}

interface ChoiceButtonProps {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick(): void;
}

function ChoiceButton({
  label,
  selected,
  disabled,
  onClick,
}: ChoiceButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border px-6 py-3 font-semibold transition-all ${
        selected
          ? "border-sky-600 bg-sky-600 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-sky-400"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : ""
      }`}
    >
      {label}
    </button>
  );
}