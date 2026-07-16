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

display:"flex",

justifyContent:"flex-end",

gap:12,

marginTop:24,

}}

>

<button

type="button"

onClick={onReupload}

>

{t("medication.reupload")}

</button>

<button

type="button"

disabled={

saving||

!validation.valid

}

onClick={onConfirm}

>

{

saving

?

t("medication.savingPrescription")

:

t("medication.savePrescription")

}

</button>

</div>

</>

);

}