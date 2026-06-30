//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import { TrendRequest } from "@/lib/trends/trendRequest";

//------------------------------------------------------------
// Storage Key
//------------------------------------------------------------

const STORAGE_KEY =
  "carevr_trend_draft";

//------------------------------------------------------------
// Trend Draft Storage
//------------------------------------------------------------

export class TrendDraftStorage {

  //----------------------------------------------------------
  // Save Trend Request
  //----------------------------------------------------------

  save(
    request: TrendRequest
  ): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(request)
    );

  }

  //----------------------------------------------------------
  // Load Trend Request
  //----------------------------------------------------------

  load():
    TrendRequest | null {

    const value =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!value) {

      return null;

    }

    try {

      return JSON.parse(
        value
      ) as TrendRequest;

    }
    catch {

      return null;

    }

  }

  //----------------------------------------------------------
  // Clear Trend Request
  //----------------------------------------------------------

  clear(): void {

    localStorage.removeItem(
      STORAGE_KEY
    );

  }

}

//------------------------------------------------------------
// Singleton
//------------------------------------------------------------

export const trendDraftStorage =
  new TrendDraftStorage();