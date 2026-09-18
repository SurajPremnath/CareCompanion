import "server-only";

import {
    createProtectedDoctorsNote,
    getProtectedDoctorsNotes,
} from "@/lib/security/dataProtection/doctorsNotesPersistenceService";

import {
    DoctorsNote,
    CreateDoctorsNoteRequest,
} from "@/lib/types/doctorsNote";


export class DoctorsNotesRepository {

    async create(
        request: CreateDoctorsNoteRequest
    ): Promise<DoctorsNote> {

        return createProtectedDoctorsNote(
            request
        );
    }


    async getForPeriod(
        patientId: string,
        startDate: string,
        endDate: string,
    ): Promise<DoctorsNote[]> {

        return getProtectedDoctorsNotes(
            patientId,
            startDate,
            endDate,
        );
    }

}


export const doctorsNotesRepository =
    new DoctorsNotesRepository();