"use client";

import Link from "next/link";

import { NavigationItem } from "./types";

interface Props {
    items: NavigationItem[];
}

export function NavigationMenu({
    items,
}: Props) {

    return (

        <nav className="space-y-2">

            {items.map((item) => {

 
                return (

                    <Link
                        key={item.id}
                        href={item.href}
                        className={`
                            flex
                            items-center
                            gap-4
                            rounded-2xl
                            px-4
                            py-3
                            transition-all
                            duration-200

                            ${
                                item.active
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }
                        `}
                    >

                        <div className="h-5 w-5 flex-shrink-0" />

                        <span className="font-medium">
                            {item.label}
                        </span>

                    </Link>

                );

            })}

        </nav>

    );

}