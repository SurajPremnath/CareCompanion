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


  }

}

export const trendReportPdf =
  new TrendReportPdf();