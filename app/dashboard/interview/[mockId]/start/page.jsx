"use client"

import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation"
import QuestionSection from './_components/QuestionSection'
import RecordAnsSection from './_components/RecordAnsSection'
import Link from 'next/link'
import { Lightbulb } from 'lucide-react'

function StartInterview() {

  const params = useParams()
  const mockId = params?.mockId

  const [interviewData,setInterviewData]=useState()
  const [mockInterviewQuestion,setMockInterviewQuestion]=useState()
  const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);

  useEffect(()=>{

    if(!mockId) return   

    GetInterviewDetails()

  },[mockId])

  const GetInterviewDetails = async () => {

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, mockId))

    if(!result || result.length===0){
      console.log("No interview found")
      return
    }

    const jsonMockResp = JSON.parse(result[0].jsonMockResp)

    console.log(jsonMockResp)   //  Ab Array(5) ayega

    setMockInterviewQuestion(jsonMockResp)
    setInterviewData(result[0])
  }

  const handleSaveSuccess = () => {
    if (activeQuestionIndex < (mockInterviewQuestion?.length - 1)) {
        setActiveQuestionIndex(prev => prev + 1);
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col overflow-hidden bg-gray-50/50">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pt-6 pb-4 min-h-0 overflow-hidden">
            {/* Left Column: Question & Note */}
            <div className="flex flex-col gap-6 overflow-y-auto">
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <QuestionSection 
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                    />
                </div>
                
                {/* Note section - Now outside the question box */}
                <div className='border rounded-lg p-4 bg-blue-50 border-blue-100'>
                    <h2 className='flex gap-2 items-center text-blue-700 text-sm font-bold mb-2'>
                        <Lightbulb size={18}/>
                        Important Note:
                    </h2>
                    <p className='text-xs text-blue-600 leading-relaxed'>
                        {process.env.NEXT_PUBLIC_QUESTION_NOTE}
                    </p>
                </div>
            </div>

            {/* Right Column: Video/Audio recording */}
            <div className="h-full border rounded-xl p-6 bg-white shadow-sm overflow-y-auto">
                <RecordAnsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                    onSaveSuccess={handleSaveSuccess}
                />
            </div>
        </div>

        {/* Bottom Footer - Buttons on the right, compact height */}
       <div className="flex justify-end items-center px-10 border-t py-1 bg-white shrink-0">
          <div className="flex gap-4">
            {activeQuestionIndex > 0 && (
                <button
                    className="bg-white border border-gray-300 cursor-pointer text-gray-700 px-8 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-sm"
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                >
                    Previous
                </button>
            )}

            {activeQuestionIndex != mockInterviewQuestion?.length - 1 ? (
                <button
                    className="bg-purple-600 border border-purple-700 cursor-pointer text-white px-8 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all shadow-md active:scale-95 text-sm"
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                >
                    Next Question
                </button>
            ) : (
                <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'}>
                    <button className="bg-red-500 border border-red-600 cursor-pointer text-white px-8 py-2 rounded-lg font-medium hover:bg-red-600 transition-all shadow-md active:scale-95 text-sm">
                        End Interview
                    </button>
                </Link>
            )}
          </div>
       </div>
    </div>
  )
}

export default StartInterview