export interface TrendRequest {

    patientId: string;

    entryLimit:
        | 5
        | 10
        | 30
        | -1;

    parameters: {

        temperature: boolean;

        bloodPressure: boolean;

        pulse: boolean;

        spo2: boolean;

    };

}