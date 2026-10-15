import {
  JourneySummary,
  JourneySummaryItem,
} from "../journeyAnalysisModels";

import {
  JourneySummaryView,
  SummaryItemView,
} from "../view-models";

function mapSummaryItem(
  item: JourneySummaryItem,
): SummaryItemView {
  return {
    id: item.id,
    title: item.title,
    previousValue: item.previousValue,
    currentValue: item.currentValue,
    reason: item.reason,
    highlighted: item.highlighted,
    metadata: item.metadata,
  };
}

export function mapJourneySummary(
  summary: JourneySummary,
): JourneySummaryView {
  return {
    title: summary.title ?? "Clinical Summary",
    subtitle: summary.subtitle,
    items: summary.items.map(mapSummaryItem),
  };
}