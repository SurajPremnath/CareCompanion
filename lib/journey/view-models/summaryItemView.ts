export interface SummaryItemView {
  id?: string;

  title: string;

  previousValue?: string;

  currentValue?: string;

  reason?: string;

  highlighted?: boolean;

  metadata?: Record<string, unknown>;
}

export interface JourneySummaryView {
  title: string;

  subtitle?: string;

  items: SummaryItemView[];
}