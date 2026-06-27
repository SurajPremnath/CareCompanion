import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";
import { Assessment } from "../types/assessment";

export class AssessmentRepository extends BaseRepository {

  /**
   * Saves a completed assessment.
   */
  async saveAssessment(
    assessment: Omit<
      Assessment,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ): Promise<Assessment> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        patient_id: assessment.patientId,
        assessment_type: assessment.assessmentType,
        responses_json: assessment.responses,
        score: assessment.score,
        risk_category: assessment.riskCategory,
        assessment_version: assessment.assessmentVersion,
        completed_at: assessment.completedAt
      })
      .select()
      .single();

    if (error) {
      this.handleError(error);
    }

    return this.mapAssessment(data);
  }

  /**
   * Returns an assessment by ID.
   */
  async getAssessmentById(id: string): Promise<Assessment | null> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {

      if (error.code === "PGRST116") {
        return null;
      }

      this.handleError(error);
    }

    return this.mapAssessment(data);
  }

  /**
   * Returns all assessments for the current user.
   */
  async getAssessmentHistory(): Promise<Assessment[]> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map((item) => this.mapAssessment(item));
  }

  /**
   * Returns assessment history for a patient.
   */
  async getPatientAssessmentHistory(
    patientId: string
  ): Promise<Assessment[]> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", userId)
      .eq("patient_id", patientId)
      .order("completed_at", { ascending: false });

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map((item) => this.mapAssessment(item));
  }

  /**
   * Returns the latest assessment for a patient.
   */
  async getLatestAssessment(
    patientId: string
  ): Promise<Assessment | null> {

    const history = await this.getPatientAssessmentHistory(patientId);

    return history.length > 0 ? history[0] : null;
  }

  /**
   * Deletes an assessment.
   *
   * Intended only for administrative or development use.
   */
  async deleteAssessment(id: string): Promise<void> {

    const userId = await this.getCurrentUserId();

    const { error } = await supabase
      .from("assessments")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      this.handleError(error);
    }
  }

  /**
   * Maps a database record to the Assessment domain model.
   */
  private mapAssessment(data: any): Assessment {

    return {
      id: data.id,
      userId: data.user_id,
      patientId: data.patient_id,
      assessmentType: data.assessment_type,
      responses: data.responses_json,
      score: data.score,
      riskCategory: data.risk_category,
      assessmentVersion: data.assessment_version,
      completedAt: data.completed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

}

export const assessmentRepository = new AssessmentRepository();