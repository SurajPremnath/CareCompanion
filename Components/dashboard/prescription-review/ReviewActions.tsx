"use client";

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

Warnings

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

Re-upload Prescription

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

"Saving..."

:

"Confirm & Save"

}

</button>

</div>

</>

);

}