"use client";

import {
    ArrowLeft,
    HeartPulse,
    Clock3,
    ChartLine,
    FileText,
    CircleHelp,
    CalendarDays,
    UserRound,
} from "lucide-react";

import {
    NavigationItem,
    FooterViewModel,
} from "./types";


interface Props {
    items: NavigationItem[];
    footer: FooterViewModel;
    selectedMenu: string;
    onSelect: (id:string)=>void;
    onBack: ()=>void;
}


export function Sidebar({
    items,
    footer,
    selectedMenu,
    onSelect,
    onBack,
}: Props) {


    const iconMap = {
        "Executive Summary": HeartPulse,
        "Timeline": Clock3,
        "Clinical Trends": ChartLine,
        "Detailed Report": FileText,
        "Help & Support": CircleHelp,
    };


    return (

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">


<div
    onClick={onBack}
    className="mb-8 flex cursor-pointer items-center gap-3 text-lg font-semibold text-blue-600"
>
    <ArrowLeft size={22} />
    Back to Dashboard
</div>


            <nav className="space-y-4">

                {items.map((item) => {

                    const Icon =
                        iconMap[item.label as keyof typeof iconMap];


                    return (

                        <div
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={
                                selectedMenu === item.id
                                    ? "relative flex items-center gap-4 rounded-2xl bg-blue-50 px-5 py-4 text-blue-700"
                                    : "flex items-center gap-4 rounded-2xl px-5 py-4 text-slate-700 hover:bg-slate-50"
                            }
                        >

                            {item.active && (
                                <span className="absolute left-0 top-3 h-10 w-1 rounded-r-full bg-blue-600" />
                            )}


                            <div
className={`
    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-2xl
    bg-gradient-to-br
    shadow-lg
    ring-1
    ring-white/70

    ${
        item.label === "Executive Summary"
            ? "from-cyan-300 via-cyan-200 to-blue-300 text-blue-700"
        : item.label === "Timeline"
            ? "from-blue-300 via-indigo-200 to-purple-300 text-indigo-700"
        : item.label === "Clinical Trends"
            ? "from-emerald-300 via-green-200 to-teal-300 text-green-700"
        : item.label === "Detailed Report"
            ? "from-purple-300 via-violet-200 to-fuchsia-300 text-purple-700"
        : "from-slate-200 via-slate-100 to-white text-slate-600"
    }
`}
                            >

                                {Icon && (
                                    <Icon
                                        size={28}
                                        strokeWidth={2.2}
                                    />
                                )}

                            </div>


                            <span className="text-lg font-semibold">
                                {item.label}
                            </span>


                        </div>

                    );

                })}

            </nav>



            <div className="mt-12 border-t border-slate-200 pt-8">


                <div className="mb-8">

                    <div className="flex items-center gap-3 text-slate-500">
                        <CalendarDays size={20}/>
                        Generated On
                    </div>

                    <div className="mt-2 font-bold text-slate-900">
                        {footer.generatedAt}
                    </div>

                </div>



                <div>

                    <div className="flex items-center gap-3 text-slate-500">
                        <UserRound size={20}/>
                        Created By
                    </div>

                    <div className="mt-2 text-lg font-bold text-blue-700">
                        Suraj Premnath
                    </div>

                </div>


            </div>


        </aside>

    );
}