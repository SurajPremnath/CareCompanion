//------------------------------------------------------------
// Trend Report PDF
//------------------------------------------------------------

import type { TrendResult } from "@/lib/trends/trendResult";

export class TrendReportPdf {

  //----------------------------------------------------------
  // Generate
  //----------------------------------------------------------

  async generate(
    trend: TrendResult
  ): Promise<void> {

    console.log(
      "Trend PDF generation",
      trend
    );

  }

}

export const trendReportPdf =
  new TrendReportPdf();