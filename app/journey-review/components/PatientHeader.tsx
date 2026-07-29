"use client";

import {
    Building2,
    Stethoscope,
    UserCircle,
} from "lucide-react";

import { PatientViewModel } from "./types";


interface Props {
    patient: PatientViewModel;
}


export function PatientHeader({
    patient,
}: Props) {

    return (

        <div className="flex items-center gap-6">


            {/* Avatar */}

            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 shadow-inner">

                <UserCircle
                    size={82}
                    strokeWidth={1.5}
                    className="text-blue-600"
                />

            </div>



            {/* Patient Identity */}

            <div className="space-y-3">


                <h1 className="text-4xl font-bold tracking-tight text-slate-900">

                    {patient.name}

                </h1>



                <div className="text-xl font-medium text-slate-600">

                    {patient.age ?? "--"} Years
                    <span className="mx-3 text-slate-400">
                        •
                    </span>
                    {patient.gender ?? "--"}

                </div>



                <div className="flex gap-4 pt-2">


                    <div className="flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-blue-700 shadow-sm">

                        <Building2 size={20} />

                        <span className="font-medium">

                            {patient.hospital ?? "Hospital"}

                        </span>

                    </div>




                    <div className="flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-blue-700 shadow-sm">

                        <Stethoscope size={20} />

                        <span className="font-medium">

                            {patient.doctor ?? "Doctor"}

                        </span>

                    </div>


                </div>


            </div>


        </div>

    );
}