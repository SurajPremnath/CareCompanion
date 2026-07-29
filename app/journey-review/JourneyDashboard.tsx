"use client";

import { useEffect, useState } from "react";
import ClinicalTrendSummary from "./components/ClinicalTrendSummary";

import Image from "next/image";

import { Sidebar } from "./components/Sidebar";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { PatientHeader } from "./components/PatientHeader";

import { JourneyViewModel } from "./components/types";

import { buildExecutiveSummary } from "./data";

interface Props {
    journey: JourneyViewModel;
}


export function JourneyDashboard({ journey }: Props) {

const [selectedMenu, setSelectedMenu] =
    useState("executive-summary");


const [executiveSummary, setExecutiveSummary] =
    useState(
        journey.executiveSummary
    );


useEffect(() => {

    async function loadExecutiveSummary(){

console.log(
    "CALLING BUILD EXECUTIVE SUMMARY"
);

        const summary =
            await buildExecutiveSummary();

console.log(
    "BUILD SUMMARY OUTPUT",
    summary
);



        setExecutiveSummary(summary);

    }


    loadExecutiveSummary();

}, []);

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">


            {/* HEADER */}

            <header className="mx-10 mt-8 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">


                <div className="flex items-start justify-between">


                    <div className="flex items-center gap-10">


                        <Image
                            src="/images/carevr-logo.png"
                            alt="CareVR"
                            width={240}
                            height={70}
                        />


                        <PatientHeader patient={journey.patient} />


                    </div>



                    <div className="flex flex-col items-center gap-4">


                        <Image
                            src="/images/carevr-logo-right.png"
                            alt="CareVR"
                            width={220}
                            height={70}
                        />


                        


                    </div>


                </div>


            </header>



            {/* CONTENT */}

            <div className="mx-10 mt-8 flex gap-8">


                <aside className="w-80">

<Sidebar
    items={journey.navigation}
    footer={journey.footer}
    selectedMenu={selectedMenu}
    onSelect={setSelectedMenu}
    onBack={() => window.location.href = "/dashboard"}
/>

                </aside>


<main className="flex-1">

    {
    selectedMenu === "executive-summary" && (
<ExecutiveSummary
    summary={executiveSummary}
        />
    )
}


{
    selectedMenu === "clinical-trends" && (
        <ClinicalTrendSummary />
    )
}

</main>


            </div>


        </div>

    );
}