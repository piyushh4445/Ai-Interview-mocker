"use client"

import React, { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"
import { Mic, Webcam as WebcamIcon } from "lucide-react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { toast } from "sonner"
import { generateInterview } from "@/utils/GeminiAiModel"
import { useUser } from "@clerk/nextjs"

function RecordAnsSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  onSaveSuccess // Added prop for auto-navigator
}) {
  const [userAnswer, setUserAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [webCamEnabled, setWebCamEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [savedQuestionIndexes, setSavedQuestionIndexes] = useState(new Set())

  const isSavingRef = useRef(false)
  const lastGeminiCallRef = useRef(0)

  const { user } = useUser()

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only update if transcript changed and we are listening
    if (listening && transcript) {
        setUserAnswer(transcript)
    }
  }, [transcript, listening])

  useEffect(() => {
    resetTranscript()
    setUserAnswer("")
  }, [activeQuestionIndex, resetTranscript])

  const StartStopRecording = () => {
    if (loading) return

    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      resetTranscript()
      setUserAnswer("")
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      })
    }
  }

  const UpdateUserAnswer = async () => {
    const currentQuestion = mockInterviewQuestion?.[activeQuestionIndex]?.Question
    const currentCorrectAns = mockInterviewQuestion?.[activeQuestionIndex]?.Answer
    const currentMockId = interviewData?.mockId
    const currentUserEmail = user?.primaryEmailAddress?.emailAddress

    if (!currentQuestion) {
      toast.error("Question not found.")
      return
    }

    if (!userAnswer || userAnswer.trim().length < 10) {
      toast.error("Please provide a longer answer (at least 10 characters).")
      return
    }

    if (listening) {
      toast.error("Please stop recording before saving.")
      return
    }

    if (savedQuestionIndexes.has(activeQuestionIndex)) {
      toast.error("This question answer is already saved.")
      return
    }

    if (isSavingRef.current) return

    isSavingRef.current = true
    setLoading(true)

    try {
      const now = Date.now()
      const cooldownMs = 15000 // Slightly reduced cooldown for better UX

      if (now - lastGeminiCallRef.current < cooldownMs) {
        toast.error("Please wait a few seconds before saving.")
        setLoading(false)
        isSavingRef.current = false
        return
      }

      lastGeminiCallRef.current = now

      const feedbackPrompt = `
You are an interview evaluator.

Question: ${currentQuestion}
User Answer: ${userAnswer}

Return ONLY valid JSON in this exact format:
{
  "rating": "number out of 10",
  "feedback": "3 to 5 lines constructive feedback"
}
      `.trim()

      const result = await generateInterview(feedbackPrompt)

      const cleanText = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      let JsonFeedbackResp

      try {
        JsonFeedbackResp = JSON.parse(cleanText)
      } catch {
        JsonFeedbackResp = {
          rating: "5",
          feedback: "Could not generate detailed feedback. Please try again.",
        }
      }

      const resp = await fetch("/api/save-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mockIdRef: currentMockId,
          question: currentQuestion,
          correctAns: currentCorrectAns,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: currentUserEmail,
        }),
      })

     const contentType = resp.headers.get("content-type") || ""
let data = {}

if (contentType.includes("application/json")) {
  data = await resp.json().catch(() => ({}))
} else {
  const rawText = await resp.text()
  console.error("Non-JSON response from /api/save-answer:", rawText)
  toast.error("Server returned an invalid response while saving answer.")
  return
}

      if (!resp.ok) {
        toast.error(data?.error || "Failed to save answer.")
        return
      }

      setSavedQuestionIndexes((prev) => {
        const next = new Set(prev)
        next.add(activeQuestionIndex)
        return next
      })

      toast.success(data?.message || "User Answer Recorded Successfully")
      setUserAnswer("")
      resetTranscript()
      
      // Auto advance to next question if prop provided
      if (onSaveSuccess) {
        setTimeout(() => {
          onSaveSuccess()
        }, 1200)
      }

    } catch (error) {
      console.error("Gemini Error:", error)

      const msg = error?.message || ""

      if (
        msg.includes("429") ||
        msg.includes("Quota") ||
        msg.includes("RESOURCE_EXHAUSTED")
      ) {
        toast.error("Google AI rate limit reached.", {
          description: "Please wait 20 to 30 seconds, then try again.",
        })
      } else {
        toast.error("Error saving answer. Please try again.")
      }
    } finally {
      setLoading(false)
      isSavingRef.current = false
    }
  }

  if (!mounted) return null

  if (!browserSupportsSpeechRecognition) {
    return <div className="mt-5">Browser does not support speech recognition</div>
  }

  return (
    <div className="flex flex-col items-center justify-start h-full">
      <div className="relative bg-black rounded-lg flex justify-center items-center p-2 w-full max-w-[400px] aspect-video sm:h-64">
        {webCamEnabled ? (
          <Webcam
            mirrored
            className="rounded-lg h-full w-full object-cover"
          />
        ) : (
          <div
            onClick={() => setWebCamEnabled(true)}
            className="flex flex-col items-center justify-center cursor-pointer h-full"
          >
            <WebcamIcon size={80} className="text-white mb-2" />
            <button className="bg-white cursor-pointer text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-200">
              Enable Webcam
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4 w-full justify-center">
        <button
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm border transition-all ${
                listening 
                ? "bg-red-50 border-red-200 text-red-600 animate-pulse" 
                : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50"
            }`}
            onClick={StartStopRecording}
        >
            <Mic size={18} />
            {listening ? "Stop Recording" : "Record Answer"}
        </button>

        <button
            disabled={
                loading ||
                listening ||
                !userAnswer.trim() ||
                savedQuestionIndexes.has(activeQuestionIndex)
            }
            className="bg-purple-600 cursor-pointer text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-purple-700 disabled:opacity-50 transition-all shadow-sm"
            onClick={UpdateUserAnswer}
        >
            {loading
            ? "Saving..."
            : savedQuestionIndexes.has(activeQuestionIndex)
            ? "Saved"
            : "Save Answer"}
        </button>
      </div>

      <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-700">Your Answer (Type or record)</label>
            {listening && <span className="text-[10px] text-red-500 animate-pulse flex items-center gap-1">● Recording live...</span>}
        </div>
        <textarea 
            className="w-full flex-1 min-h-[140px] rounded-lg border-2 border-purple-100 p-4 bg-gray-50 text-sm focus:border-purple-300 focus:bg-white transition-all outline-none resize-none"
            placeholder="Type your answer here or click 'Record Answer' to use your microphone..."
            value={userAnswer}
            onChange={(e) => !listening && setUserAnswer(e.target.value)}
            disabled={loading}
        />
        <p className="text-[10px] text-gray-400 mt-1 italic">
            Tip: Your answer must be at least 10 characters long to generate feedback.
        </p>
      </div>
    </div>
  )
}

export default RecordAnsSection