import {
  QuestionType,
} from "../journeyTypes";

/**
 * UI View Model for Journey Review questions.
 *
 * This model is intentionally independent of the engine's
 * JourneyQuestion model. The mapper is responsible for
 * converting engine models into this presentation model.
 */
export interface QuestionView {
  /**
   * Unique question identifier.
   */
  id: string;

  /**
   * Question displayed to the user.
   */
  question: string;

  /**
   * Optional supporting text displayed below the question.
   */
  helpText?: string;

  /**
   * Determines how the question is rendered.
   */
  type: QuestionType;

  /**
   * Indicates whether an answer is mandatory.
   */
  required: boolean;

  /**
   * Available options for choice-based questions.
   */
  options: QuestionOptionView[];

  /**
   * Placeholder for free-text inputs.
   */
  placeholder?: string;

  /**
   * Default or previously captured answer.
   * This allows the UI to preload answers when applicable.
   */
  answer?: string | string[];

  /**
   * Indicates whether the question should be visible.
   * Reserved for future conditional-question support.
   */
  visible: boolean;

  /**
   * Optional display order.
   */
  displayOrder?: number;
}

/**
 * Presentation model for selectable question options.
 */
export interface QuestionOptionView {
  id: string;

  label: string;

  value: string;

  disabled?: boolean;
}