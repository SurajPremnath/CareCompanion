"use client";

import Image from "next/image";
import { useState } from "react";


const journey = [
  {
    title: "Why CareVR?",
    subtitle: "From confusion to clarity",
    image: "/images/whyCareVR.png",
  },
  {
    title: "Mission & Vision",
    subtitle: "Building the future of healthcare",
    image: "/images/MissionVision.png",
  },
  {
    title: "The 5 Pillars",
    subtitle: "Record • Understand • Manage • Share • Secure",
    image: "/images/5Pillars.png",
  },
  {
    title: "AI Powered Care",
    subtitle: "Smarter insights. Better outcomes.",
    image: "/images/AIPoweredInsights.png",
  },
 
  {
    title: "Family Connected",
    subtitle: "Everyone connected when care matters",
    image: "/images/FamilyConnected.png",
  },
/* 
 {
    title: "Health Journey",
    subtitle: "Every moment becomes meaningful",
    image: "/images/HealthJourney.png",
  },
*/
  {
    title: "One Health Timeline",
    subtitle: "One connected health story",
    image: "/images/Timeline.png",
  },
/*
  {
    title: "Life Journey",
    subtitle: "Care across every stage of life",
    image: "/images/LifeJourney.png",
  },
*/
];


export default function CareVRJourneyPage() {


  const [active,setActive] = useState(0);


  const current = journey[active];


  return (

<main
  className="
  min-h-screen
  bg-gradient-to-b
  from-blue-50
  via-white
  to-blue-50
  px-3
  pt-2
  pb-5
  "
>


{/* HERO BANNER */}

<section
  className="
  mx-auto
  max-w-[1250px]
  overflow-hidden
  "
>

<div
  className="
  relative
  aspect-[3/1]
  w-full
  "
>

<Image
  src="/images/CareVRJourney.png"
  fill
  sizes="(max-width: 768px) 100vw, 900px"
  loading="eager"
  priority
  className="object-contain rounded-2xl"
  alt="CareVR Journey"
/>

</div>


</section>



      {/* MAIN STORY AREA */}


      <section
        className="
        mx-auto
        mt-8
        grid
        max-w-6xl
        gap-8
        lg:grid-cols-[280px_1fr]
        "
      >



        {/* LEFT JOURNEY */}

        <aside
          className="
          rounded-[28px]
          bg-white
          p-5
          shadow-xl
          "
        >


          <h2
            className="
            mb-5
            text-xl
            font-semibold
            text-blue-950
            "
          >
            Our Journey
          </h2>



          <div
            className="
            space-y-3
            "
          >

          {
            journey.map((item,index)=>(

              <button

                key={item.title}

                onClick={()=>setActive(index)}

                className={`
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                p-3
                text-left
                transition-all

                ${
                  active===index
                  ?
                  "bg-blue-100 shadow-md"
                  :
                  "hover:bg-blue-50"
                }

                `}

              >


                <div
                  className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-indigo-600
                  text-sm
                  font-bold
                  text-white
                  "
                >

                  {index+1}

                </div>



                <div>

                  <div
                    className="
                    text-sm
                    font-semibold
                    text-blue-950
                    "
                  >
                    {item.title}
                  </div>


                  <div
                    className="
                    text-xs
                    text-slate-500
                    "
                  >
                    {item.subtitle}
                  </div>


                </div>


              </button>

            ))

          }

          </div>


        </aside>





        {/* STORY DISPLAY */}


        <section
          className="
          rounded-[32px]
          bg-white
          p-5
          shadow-xl
          "
        >


          <div
            className="
            mb-4
            text-center
            "
          >



          </div>




          <div
            className="
            relative
            flex
            h-[520px]
            items-center
            justify-center
            overflow-hidden
            rounded-[24px]
            bg-blue-50
            "
          >


<Image

  key={current.image}

  src={current.image}

  alt={current.title}

  fill

  sizes="(max-width: 768px) 100vw, 900px"

  priority={active === 0}

  className="
  object-contain
  p-3
  transition-all
  duration-700
  "

/>

          </div>



        </section>


      </section>


    </main>

  );

}