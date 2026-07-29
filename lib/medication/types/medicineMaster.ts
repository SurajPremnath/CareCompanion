export interface MedicineMaster {

    id: string;

    brandName: string;

    genericName: string | null;

    strength: string | null;

    formulation: string;

    manufacturer: string | null;

    route: string;

    schedule?: string;

    therapeuticClass?: string;

    atcCode: string | null;

    searchKeys: string[];

    aliases: string[];

    commonAdministration: string[];

    commonFrequency: string[];

    lasa: boolean;

    highRisk: boolean;

    controlledDrug: boolean;

    isActive: boolean;

}