import type { ClinicalEventRow } from "@/lib/database";

import {
  ClinicalEvent,
  ClinicalEventType,
  CreateClinicalEventRequest,
} from "@/lib/types/clinicalEvent";

export class ClinicalEventMapper {

  //------------------------------------------------------------
  // Database Row -> Domain Model
  //------------------------------------------------------------

static toDomain(
  row: ClinicalEventRow
): ClinicalEvent {

  return {

    id: row.id,

    userId: row.user_id,

    patientId: row.patient_id,

    eventType:
      row.event_type as ClinicalEventType,

    sourceTable: row.source_table,

    sourceId: row.source_id,

    eventDate: row.event_date,

    title: row.title,

    summary: row.summary,

    createdAt: row.created_at

  };

}

//------------------------------------------------------------
// Domain Model -> Database Insert
//------------------------------------------------------------

static toInsert(
  event: CreateClinicalEventRequest
) {

  return {

    user_id: event.userId,

    patient_id: event.patientId,

    event_type: event.eventType,

    source_table: event.sourceTable,

    source_id: event.sourceId,

    event_date: event.eventDate,

    title: event.title,

    summary: event.summary

  };

}

}