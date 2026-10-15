import type {
  RecommendationPriority,
} from "../journeyTypes";

export interface RecommendationView {
  id: string;

  priority: RecommendationPriority;

  category: string;

  title: string;

  description: string;

  reason?: string;

  action?: string;

  confidence?: number;

  completed?: boolean;

  metadata?: Record<string, unknown>;
}