//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import type {
  ParameterTrend,
} from "./trendResult";

//------------------------------------------------------------
// Clinical Analyzer
//------------------------------------------------------------

export class TrendClinicalAnalyzer {

  //----------------------------------------------------------
  // Analyze
  //----------------------------------------------------------

  analyze(
    trends: ParameterTrend[]
  ): string[] {

    const messages: string[] = [];

    return messages;

  }

}

export const trendClinicalAnalyzer =
  new TrendClinicalAnalyzer();