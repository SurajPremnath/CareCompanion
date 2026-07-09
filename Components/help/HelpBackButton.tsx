"use client";

import Link from "next/link";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";


export default function HelpBackButton() {

    const {
        t,
    } =
        useLanguage();


    return (

        <Link
            href="/help"
            style={{
                textDecoration:
                    "none",

                color:
                    "#2563eb",

                fontWeight:
                    500,

                display:
                    "inline-block",

                marginBottom:
                    "24px",
            }}
        >
            ← {t("dashboard.helpCentre")}
        </Link>

    );

}