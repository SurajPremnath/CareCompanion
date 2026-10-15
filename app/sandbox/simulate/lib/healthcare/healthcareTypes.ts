export interface HealthcareFacility {
    id: string;
    name: string;
    facilityType: string;
    area: string | null;
    city: string;
    state: string | null;
    country: string;
    isActive: boolean;
}