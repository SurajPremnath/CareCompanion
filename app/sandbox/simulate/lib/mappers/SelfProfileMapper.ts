import { SelfProfile } from "../selfProfile";
import { SelfProfileRow } from "../database";

/**
 * SelfProfileMapper
 *
 * Responsible for converting between
 * PostgreSQL rows and SelfProfile domain models.
 */
export class SelfProfileMapper {

  /**
   * Converts a database row into a SelfProfile model.
   */
  static fromDatabase(
    row: SelfProfileRow
  ): SelfProfile {

    return {

      id: row.id,

      userId: row.user_id,

      dateOfBirth: row.date_of_birth,

isCompleted: row.is_completed,

      createdAt: row.created_at,

      updatedAt: row.updated_at

    };

  }

  /**
   * Converts a SelfProfile model into a database payload.
   */
  static toDatabase(
    profile: Partial<SelfProfile>
  ): Partial<SelfProfileRow> {

    return {

      date_of_birth: profile.dateOfBirth,

is_completed: profile.isCompleted

    };

  }

}