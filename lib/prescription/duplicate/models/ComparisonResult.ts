export interface ComparisonParameter {

    parameter: string;

    currentValue: string;

    previousValue: string;

    matched: boolean;

    confidence: number;

}

export interface ComparisonResult {

    isDuplicate: boolean;

    overallConfidence: number;

    parameters: ComparisonParameter[];

}