// components/journey/JourneyContext.tsx

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";

import {
  ActiveTreatment,
  JourneyAnalysisResult,
  JourneyTimelineEvent,
  JourneyRecommendation,
} from "@/lib/journey";

import {
  QuestionView,
} from "@/lib/journey/view-models";

export enum JourneyStep {
  UPLOAD = "UPLOAD",
  ANALYSIS = "ANALYSIS",
  QUESTIONS = "QUESTIONS",
  REVIEW = "REVIEW",
  SAVING = "SAVING",
  COMPLETE = "COMPLETE",
}

export interface JourneyAnswer {
  questionId: string;
  value: string | string[];
}

export interface JourneyState {
  loading: boolean;
  saving: boolean;

  step: JourneyStep;

  consultationId?: string;
  patientId?: string;

  analysis?: JourneyAnalysisResult;

  questions: QuestionView[];
  answers: JourneyAnswer[];

  timeline: JourneyTimelineEvent[];

  treatment?: ActiveTreatment;

  decision?: JourneyRecommendation;

  error?: string;
}

const initialState: JourneyState = {
  loading: false,
  saving: false,

  step: JourneyStep.UPLOAD,

  questions: [],

  answers: [],

  timeline: [],
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_ERROR"; payload?: string }
  | { type: "SET_STEP"; payload: JourneyStep }
  | {
      type: "LOAD_ANALYSIS";
      payload: {
        consultationId: string;
        patientId: string;
        analysis?: JourneyAnalysisResult;
        questions: QuestionView[];
        timeline: JourneyTimelineEvent[];
        treatment?: ActiveTreatment;
        decision?: JourneyRecommendation;
      };
    }
  | {
      type: "ANSWER";
      payload: JourneyAnswer;
    }
  | {
      type: "RESET";
    };

function reducer(
  state: JourneyState,
  action: Action,
): JourneyState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_SAVING":
      return {
        ...state,
        saving: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_STEP":
      return {
        ...state,
        step: action.payload,
      };

    case "LOAD_ANALYSIS":
      return {
        ...state,

        consultationId:
          action.payload.consultationId,

        patientId:
          action.payload.patientId,

        analysis: action.payload.analysis,

        questions: action.payload.questions,

        timeline: action.payload.timeline,

        treatment: action.payload.treatment,

        decision: action.payload.decision,
      };

    case "ANSWER": {
      const existing =
        state.answers.findIndex(
          x =>
            x.questionId ===
            action.payload.questionId,
        );

      if (existing >= 0) {
        const answers = [...state.answers];

        answers[existing] =
          action.payload;

        return {
          ...state,
          answers,
        };
      }

      return {
        ...state,
        answers: [
          ...state.answers,
          action.payload,
        ],
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

interface JourneyContextValue {
  state: JourneyState;

  nextStep(): void;

  previousStep(): void;

  goToStep(step: JourneyStep): void;

  loadAnalysis(
    payload: Action extends infer T
      ? T extends {
          type: "LOAD_ANALYSIS";
          payload: infer P;
        }
        ? P
        : never
      : never,
  ): void;

  answerQuestion(
    questionId: string,
    value: string | string[],
  ): void;

  reset(): void;

  startSaving(): void;

  finishSaving(): void;

  setError(error?: string): void;
}

const JourneyContext =
  createContext<
    JourneyContextValue | undefined
  >(undefined);

export function JourneyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] =
    useReducer(reducer, initialState);

  const nextStep = useCallback(() => {
    switch (state.step) {
      case JourneyStep.UPLOAD:
        dispatch({
          type: "SET_STEP",
          payload:
            JourneyStep.ANALYSIS,
        });
        break;

      case JourneyStep.ANALYSIS:
        dispatch({
          type: "SET_STEP",
          payload:
            JourneyStep.QUESTIONS,
        });
        break;

      case JourneyStep.QUESTIONS:
        dispatch({
          type: "SET_STEP",
          payload:
            JourneyStep.REVIEW,
        });
        break;

      case JourneyStep.REVIEW:
        dispatch({
          type: "SET_STEP",
          payload:
            JourneyStep.SAVING,
        });
        break;

      case JourneyStep.SAVING:
        dispatch({
          type: "SET_STEP",
          payload:
            JourneyStep.COMPLETE,
        });
        break;
    }
  }, [state.step]);

  const previousStep =
    useCallback(() => {
      switch (state.step) {
        case JourneyStep.ANALYSIS:
          dispatch({
            type: "SET_STEP",
            payload:
              JourneyStep.UPLOAD,
          });
          break;

        case JourneyStep.QUESTIONS:
          dispatch({
            type: "SET_STEP",
            payload:
              JourneyStep.ANALYSIS,
          });
          break;

        case JourneyStep.REVIEW:
          dispatch({
            type: "SET_STEP",
            payload:
              JourneyStep.QUESTIONS,
          });
          break;
      }
    }, [state.step]);

  const value =
    useMemo<JourneyContextValue>(
      () => ({
        state,

        nextStep,

        previousStep,

        goToStep(step) {
          dispatch({
            type: "SET_STEP",
            payload: step,
          });
        },

        loadAnalysis(payload) {
          dispatch({
            type: "LOAD_ANALYSIS",
            payload,
          });
        },

        answerQuestion(
          questionId,
          value,
        ) {
          dispatch({
            type: "ANSWER",
            payload: {
              questionId,
              value,
            },
          });
        },

        reset() {
          dispatch({
            type: "RESET",
          });
        },

        startSaving() {
          dispatch({
            type: "SET_SAVING",
            payload: true,
          });
        },

        finishSaving() {
          dispatch({
            type: "SET_SAVING",
            payload: false,
          });

          dispatch({
            type: "SET_STEP",
            payload:
              JourneyStep.COMPLETE,
          });
        },

        setError(error) {
          dispatch({
            type: "SET_ERROR",
            payload: error,
          });
        },
      }),
      [
        state,
        nextStep,
        previousStep,
      ],
    );

  return (
    <JourneyContext.Provider
      value={value}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context =
    useContext(JourneyContext);

  if (!context) {
    throw new Error(
      "useJourney must be used inside JourneyProvider.",
    );
  }

  return context;
}