"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface Props{

saving:boolean;

validation:{

valid:boolean;

errors:string[];

warnings:string[];

};

onConfirm:()=>void;

onReupload:()=>void;

}

export default function ReviewActions({

saving,

validation,

onConfirm,

onReupload,

}:Props){

const {
    t,
} = useLanguage();


return(


<>

{

validation.errors.length>0&&(

<div className="errorBox">

<strong>

Please correct the following before saving

</strong>

<ul>

{

validation.errors.map(

(item,index)=>

<li key={index}>

{item}

</li>

)

}

</ul>

</div>

)

}

{

validation.warnings.length>0&&(

<div className="warningBox">

<strong>

{t("medication.warningTitle")}

</strong>

<ul>

{

validation.warnings.map(

(item,index)=>

<li key={index}>

{item}

</li>

)

}

</ul>

<p
    style={{
        marginTop: 12,
        marginBottom: 0,
        lineHeight: 1.6,
    }}
>
    {t("medication.warningContinue")}
</p>

</div>

)

}

<div
    style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "12px",
        marginTop: "24px",
        paddingTop: "20px",
        borderTop: "1px solid #e2e8f0",
    }}
>

    <button
        type="button"
        onClick={onReupload}
        style={{
            padding: "12px 20px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#111827",
            fontWeight: 600,
            cursor: "pointer",
        }}
    >
        {t("medication.reupload")}
    </button>

    <button
        type="button"
        disabled={
            saving ||
            !validation.valid
        }
        onClick={onConfirm}
        style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
            cursor:
                saving || !validation.valid
                    ? "not-allowed"
                    : "pointer",
            opacity:
                saving || !validation.valid
                    ? 0.6
                    : 1,
        }}
    >
        {saving
            ? t("medication.savingPrescription")
            : t("medication.savePrescription")}
    </button>

</div>

</>

);

}