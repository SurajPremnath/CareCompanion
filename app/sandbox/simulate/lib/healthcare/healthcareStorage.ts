import {
    healthcareRepository,
} from "./healthcareRepository";

import type {
    HealthcareFacility,
} from "./healthcareTypes";

export const healthcareStorage = {

    async getActiveFacilities(): Promise<
        HealthcareFacility[]
    > {
        return healthcareRepository
            .getActiveFacilities();
    },
};