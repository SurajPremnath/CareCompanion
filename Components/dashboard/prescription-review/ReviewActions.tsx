"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";


import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface Props{

saving:boolean;

saved:boolean;

validation:{

valid:boolean;

errors:string[];

warnings:string[];

};

reviewMode:boolean;

reviewCompleted:boolean;

onConfirm:()=>void;

onReupload:()=>void;

onReviewMedicines:()=>void;

onReviewCompleted:()=>void;

}

export default function ReviewActions({

saving,

saved,

validation,

reviewMode,

reviewCompleted,

onConfirm,

onReupload,

onReviewMedicines,

onReviewCompleted,

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

{

reviewMode && (

<div
    style={{
        marginTop:"20px",
        marginBottom:"20px",
        padding:"14px 16px",
        borderRadius:"8px",
        border:"1px solid #bfdbfe",
        background:"#eff6ff",
        color:"#1e40af",
        fontWeight:600,
    }}
>

🔍 Review in Progress

<br/>

<span
    style={{
        fontWeight:400,
        fontSize:"14px",
    }}
>

Review the medicines carefully before clicking
<b> Review Complete</b>.

</span>

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
    onClick={
        reviewMode
            ? onReviewCompleted
            : onReviewMedicines
    }
    style={{
        padding: "12px 20px",
        border: "1px solid #2563eb",
        borderRadius: "8px",
        background: "#ffffff",
        color: "#2563eb",
        fontWeight: 700,
        cursor: "pointer",
    }}
>
    {
    reviewMode
        ? "Review Complete"
        : reviewCompleted
            ? "Review Again"
            : "Review Medicines"
}
</button>

<button
    type="button"
    onClick={onConfirm}
    disabled={!reviewCompleted || saving || saved}
    style={{
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        background:
            !reviewCompleted || saving || saved
                ? "#94a3b8"
                : "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor:
            !reviewCompleted || saving || saved
                ? "not-allowed"
                : "pointer",
        opacity:
            !reviewCompleted || saving || saved
                ? 0.7
                : 1,
    }}
>
    {
    saving
        ? "Saving..."
        : saved
            ? "Prescription Saved"
            : t("medication.savePrescription")
}
</button>

</div>

</>

);

}