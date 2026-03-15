"use client"

import { db } from "@/utils/db"
import { UserAnswer } from "@/utils/schema"
import { eq } from "drizzle-orm"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"

function Feedback() {
  const params = useParams()
  const [feedbackList, setFeedbackList] = useState([])
  const router = useRouter()

  useEffect(() => {
    GetFeedback()
  }, [])

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.mockId))
      .orderBy(UserAnswer.id)

    const uniqueQuestionsMap = new Map()

    result.forEach((item) => {
      const key = `${item.question}-${item.userEmail}`
      if (!uniqueQuestionsMap.has(key)) {
        uniqueQuestionsMap.set(key, item)
      }
    })

    const uniqueFeedback = Array.from(uniqueQuestionsMap.values())

    setFeedbackList(uniqueFeedback)
  }

  const overallRating =
    feedbackList?.length > 0
      ? Math.round(
          (feedbackList.reduce((sum, item) => {
            const numericRating =
              Number(String(item.rating).match(/\d+/)?.[0]) || 0
            return sum + numericRating
          }, 0) /
            feedbackList.length) *
            10
        ) / 10
      : 0

  return (
    <div className="p-10 mx-auto max-w-5xl">
      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
          <h2 className="font-bold text-2xl">Here is your interview details.</h2>

          <h2 className="text-primary text-lg my-3 font-semibold">
            Your overall interview rating:{" "}
            <strong className="text-purple-600">{overallRating}/10</strong>
          </h2>

          <h2 className="text-gray-500 mb-6">
            Find below interview question with correct answer, your answer and
            feedback for improvement:
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={item.id || index}>
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between gap-5 my-2 w-full text-left font-medium text-gray-800">
                <span className="flex-1">{item.question}</span>
                <ChevronsUpDown className="h-5 w-5 mt-1 opacity-50" />
              </CollapsibleTrigger>

              <CollapsibleContent className="p-4 border rounded-lg bg-white shadow-sm mt-1">
                <div className="flex flex-col gap-3">
                  <h2 className="text-red-500 p-2 border rounded-lg bg-red-50">
                    <strong>Rating: </strong>
                    {item.rating}/10
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm">
                    <strong>Your Answer:</strong> {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm">
                    <strong>Correct Answer:</strong> {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm">
                    <strong>Feedback:</strong> {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <div className="flex justify-between items-center mt-6 print:hidden">
        <button
          className="bg-primary text-white border rounded-lg px-6 py-2 hover:bg-primary-dark cursor-pointer flex gap-2 items-center"
          onClick={() => window.print()}
        >
          Export as PDF (Save to PC)
        </button>

        <button
          className="bg-purple-950 text-white border rounded-lg px-6 py-2 hover:bg-purple-800 cursor-pointer"
          onClick={() => router.replace("/dashboard")}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default Feedback