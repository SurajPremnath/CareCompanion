import {
  JourneyQuestion,
  JourneyQuestionOption,
} from "../journeyAnalysisModels";

import {
  QuestionOptionView,
  QuestionView,
} from "../view-models";

/**
 * Maps an engine question option to a UI view model.
 */
function mapQuestionOption(
  option: JourneyQuestionOption,
): QuestionOptionView {
  return {
    id: option.id,
    label: option.label,
    value: option.value,
    disabled: false,
  };
}

/**
 * Maps an engine JourneyQuestion into the UI QuestionView.
 */
export function mapQuestion(
  question: JourneyQuestion,
): QuestionView {
  return {
    id: question.id,

    question: question.title,

    helpText: question.description,

    type: question.type,

    required: question.required,

    options:
      question.options?.map(
        mapQuestionOption,
      ) ?? [],

    placeholder: undefined,

    answer: undefined,

    visible: true,

    displayOrder: undefined,
  };
}

/**
 * Maps all questions for the Journey Review UI.
 */
export function mapQuestions(
  questions: JourneyQuestion[],
): QuestionView[] {
  return questions.map(mapQuestion);
}