export interface AssessmentReport {

  id: string;

  assessmentId: string;

  report: Record<string, unknown>;

  createdAt: string;
}