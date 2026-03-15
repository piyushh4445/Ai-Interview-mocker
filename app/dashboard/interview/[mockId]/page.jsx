
"use client"

import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { useParams } from "next/navigation"   
import Link from 'next/link'

function Interview() {

  const params = useParams()                 
  const mockId = params?.mockId              

  const [interviewData,setInterviewData]=useState()
  const [webCamEnabled,setWebCamEnabled]=useState(false)

  useEffect(()=>{

    if(!mockId) return                       //  wait until param ready

    console.log("MockId:", mockId)
    GetInterviewDetails()

  },[mockId])

  const GetInterviewDetails = async () => {

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, mockId))   

    setInterviewData(result[0])
  }

return (
 <div className="
w-full
min-h-screen
bg-gradient-to-br from-slate-900 via-gray-900 to-black
flex flex-col items-center px-10 py-5
">

    {/* TITLE */}
    <h2 className="text-3xl font-bold text-white mb-3">
      Let's Get Started
    </h2>

    {/* MAIN GRID */}
    <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl">

      {/*  LEFT — GLASS WEBCAM CARD */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20
                      rounded-2xl p-8 shadow-xl flex flex-col items-center">

        {webCamEnabled ? (
          <Webcam
            mirrored
            style={{ height: 280, width: 280 }}
            className="rounded-xl"
          />
        ) : (
          <>
            <WebcamIcon className="h-55 w-full p-16 text-white/70"/>
            <Button variant='ghost'
              className="mt-4 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              onClick={() => setWebCamEnabled(true)}
            >
              Enable Web Cam and Microphone
            </Button>
          </>
        )}

      </div>
{interviewData && (
  <div className="flex flex-col gap-5 w-full">

    {/*  BOX 1 — INTERVIEW DETAILS (75%) */}
    <div className="
      backdrop-blur-xl bg-white/10 border border-white/20
      rounded-2xl p-8 shadow-xl text-white
      h-52
    ">
      <h2 className="text-xl font-bold mb-4">
        Interview Details
      </h2>

      <p><strong>Job Role:</strong> {interviewData?.jobPosition}</p>
      <p><strong>Tech Stack:</strong> {interviewData?.jobDesc}</p>
      <p><strong>Experience:</strong> {interviewData?.jobExperience} Years</p>
    </div>

    {/*  BOX 2 — LIGHTBULB INFO (25%) */}
    <div className="
      backdrop-blur-xl bg-yellow-200/10 border border-white/20
      rounded-2xl p-5 shadow-xl text-white
      h-24 flex items-center gap-6
    ">
      <h2 className='flex gap-2 items-center'><Lightbulb className="text-yellow-400" /></h2>

      <div>
        <h2 className="font-semibold">Information</h2>
        <p className="text-sm text-white/70">
          Enable Web Cam And Microphone to Start Your AI interview.
          Note:We Never record your video.
        </p>
      </div>
    </div>

  </div>
)}

    </div>

   <Link href={'/dashboard/interview/'+params.mockId+'/start'}>
   <Button  className="mt-8 px-10">
   Start Interview
</Button>
   </Link>
    

  </div>
)
}

export default Interview