import {
    PatientViewModel,
} from "../components/types";


export function buildPatient(): PatientViewModel {

    return {

        id: "patient-001",

        name: "K V Premnath",

        age: 77,

        gender: "Male",

        diagnosis: "Lung Cancer",

        hospital: "HCG Bengaluru",

        doctor: "Dr Shekhar Patil",

        status: "Under Treatment",

        patientId: "patient-001",

    };

}