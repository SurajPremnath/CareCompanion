import { TimelineStorage } from "./TimelineStorage";
import { TimelineEvent } from "./timelineTypes";

export class TimelineRepository {

    constructor(
        private readonly storage: TimelineStorage = new TimelineStorage()
    ) {}

    async save(event: TimelineEvent): Promise<void> {
        await this.storage.save(event);
    }

    async saveMany(events: TimelineEvent[]): Promise<void> {
        await this.storage.saveMany(events);
    }

    async getById(id: string): Promise<TimelineEvent | null> {
        return this.storage.getById(id);
    }

    async getByPatient(patientId: string): Promise<TimelineEvent[]> {
        return this.storage.getByPatient(patientId);
    }

    async getByConsultation(
        consultationId: string
    ): Promise<TimelineEvent[]> {
        return this.storage.getByConsultation(consultationId);
    }

    async getAll(): Promise<TimelineEvent[]> {
        return this.storage.getAll();
    }

    async delete(id: string): Promise<void> {
        await this.storage.delete(id);
    }

    async deleteByPatient(patientId: string): Promise<void> {
        await this.storage.deleteByPatient(patientId);
    }
}