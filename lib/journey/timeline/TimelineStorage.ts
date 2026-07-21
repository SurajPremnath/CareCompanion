import { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

import { TimelineEvent } from "./timelineTypes";

const TABLE_NAME = "timeline";

export class TimelineStorage {

    constructor(
        private readonly client: SupabaseClient = supabase
    ) {}

    async save(event: TimelineEvent): Promise<void> {

        const { error } = await this.client
            .from(TABLE_NAME)
            .upsert(event);

        if (error) {
            throw error;
        }
    }

    async saveMany(events: TimelineEvent[]): Promise<void> {

        if (events.length === 0) {
            return;
        }

        const { error } = await this.client
            .from(TABLE_NAME)
            .upsert(events);

        if (error) {
            throw error;
        }
    }

    async getById(id: string): Promise<TimelineEvent | null> {

        const { data, error } = await this.client
            .from(TABLE_NAME)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            throw error;
        }

        return data as TimelineEvent;
    }

    async getByPatient(patientId: string): Promise<TimelineEvent[]> {

        const { data, error } = await this.client
            .from(TABLE_NAME)
            .select("*")
            .eq("patientId", patientId)
            .order("occurredAt", { ascending: false });

        if (error) {
            throw error;
        }

        return (data ?? []) as TimelineEvent[];
    }

    async getByConsultation(
        consultationId: string
    ): Promise<TimelineEvent[]> {

        const { data, error } = await this.client
            .from(TABLE_NAME)
            .select("*")
            .eq("consultationId", consultationId)
            .order("occurredAt", { ascending: false });

        if (error) {
            throw error;
        }

        return (data ?? []) as TimelineEvent[];
    }

    async getAll(): Promise<TimelineEvent[]> {

        const { data, error } = await this.client
            .from(TABLE_NAME)
            .select("*")
            .order("occurredAt", { ascending: false });

        if (error) {
            throw error;
        }

        return (data ?? []) as TimelineEvent[];
    }

    async delete(id: string): Promise<void> {

        const { error } = await this.client
            .from(TABLE_NAME)
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }
    }

    async deleteByPatient(patientId: string): Promise<void> {

        const { error } = await this.client
            .from(TABLE_NAME)
            .delete()
            .eq("patientId", patientId);

        if (error) {
            throw error;
        }
    }
}