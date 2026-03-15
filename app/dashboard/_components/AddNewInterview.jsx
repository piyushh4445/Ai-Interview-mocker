"use client"

import React, { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { generateInterview } from "@/utils/GeminiAiModel"
import { LoaderCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

function AddNewInterview() {
  const router = useRouter()
  const { user } = useUser()

  const [openDialog, setOpenDialog] = useState(false)

  const [jobPosition, setJobPosition] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [jobExperience, setJobExperience] = useState("")

  const [loading, setLoading] = useState(false)
  const [isParsingPdf, setIsParsingPdf] = useState(false)

  const [file, setFile] = useState(null)
  const [resumeText, setResumeText] = useState("")
  const [pdfError, setPdfError] = useState("")

  const hasManualForm = useMemo(() => {
    return (
      jobPosition.trim() !== "" &&
      jobDescription.trim() !== "" &&
      jobExperience.trim() !== ""
    )
  }, [jobPosition, jobDescription, jobExperience])

  const canSubmit = useMemo(() => {
    return !loading && !isParsingPdf && (resumeText.trim() !== "" || hasManualForm)
  }, [loading, isParsingPdf, resumeText, hasManualForm])

  const resetForm = () => {
    setJobPosition("")
    setJobDescription("")
    setJobExperience("")
    setFile(null)
    setResumeText("")
    setPdfError("")
    setLoading(false)
    setIsParsingPdf(false)
  }

  const handleDialogChange = (open) => {
    setOpenDialog(open)
    if (!open) resetForm()
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0] || null

    setFile(selectedFile)
    setResumeText("")
    setPdfError("")

    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf") {
      setPdfError("Please upload a valid PDF file.")
      toast.error("Only PDF files are allowed.")
      return
    }

    try {
      setIsParsingPdf(true)

      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      })

      const contentType = response.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const rawText = await response.text()
        console.error("Non-JSON response from /api/parse-pdf:", rawText)
        throw new Error("Server returned an invalid response while parsing PDF.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to parse PDF.")
      }

      if (!data?.text || !data.text.trim()) {
        throw new Error("No readable text found in the PDF.")
      }

      setResumeText(data.text)
      toast.success("Resume parsed successfully.")
    } catch (error) {
      console.error("Error parsing PDF:", error)
      setPdfError(error?.message || "Failed to parse PDF.")
      setResumeText("")
      toast.error(error?.message || "Failed to parse PDF.")
    } finally {
      setIsParsingPdf(false)
    }
  }

  const removeSelectedFile = () => {
    setFile(null)
    setResumeText("")
    setPdfError("")
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (loading || isParsingPdf) return

    if (!resumeText.trim() && !hasManualForm) {
      toast.error("Please fill all fields or upload a valid resume PDF.")
      return
    }

    setLoading(true)

    const inputPrompt = resumeText.trim()
      ? `You are an expert technical interviewer.
Based on the following parsed resume text, generate EXACTLY 5 interview questions that assess the candidate's past experiences, projects, technical skills, and computer science fundamentals.
Make sure the questions are directly relevant to what is claimed on the resume.

Resume Text:
${resumeText}

Return ONLY valid JSON array matching this format exactly:
[
  { "Question":"string","Answer":"string" }
]`
      : `You are an expert technical interviewer.

Job Position: ${jobPosition}
Job Description: ${jobDescription}
Years of Experience: ${jobExperience}

Generate EXACTLY 5 interview questions.

Return ONLY valid JSON array.
[
  { "Question":"string","Answer":"string" }
]`

    try {
      const text = await generateInterview(inputPrompt)

      const match = text?.match(/\[[\s\S]*\]/)

      if (!match) {
        toast.error("AI did not return valid interview questions.")
        return
      }

      const questions = JSON.parse(match[0])

      if (!Array.isArray(questions) || questions.length === 0) {
        toast.error("No interview questions generated.")
        return
      }

      const resp = await fetch("/api/save-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          jobPosition: resumeText ? "Resume Based Profile" : jobPosition,
          jobDescription: resumeText ? "Resume Analysis" : jobDescription,
          jobExperience: resumeText ? "N/A" : jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown",
        }),
      })

      const contentType = resp.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const rawText = await resp.text()
        console.error("Non-JSON response from /api/save-interview:", rawText)
        toast.error("Server returned an invalid response.")
        return
      }

      const data = await resp.json()

      if (!resp.ok || !data?.mockId) {
        toast.error(data?.error || "Failed to save interview.")
        return
      }

      toast.success("Interview created successfully.")
      setOpenDialog(false)
      router.push(`/dashboard/interview/${data.mockId}`)
    } catch (err) {
      console.error("Interview generation error:", err)

      if (err?.isQuotaError) {
        toast.error("Google AI quota exceeded.", {
          description: err?.retryAfter
            ? `Please wait about ${err.retryAfter} seconds and try again.`
            : "Please wait a bit and try again.",
        })
      } else {
        toast.error("Failed to generate interview questions.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Help us personalize your AI interview experience
            </DialogTitle>

            <DialogDescription>
              Share your role, experience, and tech stack.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit}>
            <div className="mt-6 space-y-4">
              <div className="my-3">
                <label>Job Role/Position</label>
                <Input
                  placeholder="Eg. Full Stack Developer"
                  disabled={!!file}
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div className="my-3">
                <label>Tech Stack</label>
                <Textarea
                  placeholder="Eg. React, Next.js, Node.js, MySQL"
                  disabled={!!file}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="my-3">
                <label>Years of Experience</label>
                <Input
                  type="number"
                  placeholder="Eg. 3"
                  disabled={!!file}
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 my-6">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500 font-medium">OR</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              <div className="my-3">
                <label className="font-semibold text-purple-600 block mb-2">
                  Upload Resume (PDF)
                </label>

                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer file:cursor-pointer file:bg-purple-100 file:text-purple-700 file:border-0 hover:file:bg-purple-200"
                />

                {isParsingPdf && (
                  <p className="text-sm text-purple-600 mt-2 font-medium flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={16} />
                    Parsing PDF...
                  </p>
                )}

                {!!file && !isParsingPdf && !resumeText && !pdfError && (
                  <p className="text-sm text-gray-600 mt-2">
                    File selected: {file.name}
                  </p>
                )}

                {!!resumeText && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Resume parsed successfully
                    </p>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                )}

                {!!pdfError && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm text-red-500 font-medium">
                      {pdfError}
                    </p>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-5 justify-end mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                disabled={loading || isParsingPdf}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={!canSubmit}>
                {isParsingPdf ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} />
                    Uploading PDF...
                  </div>
                ) : loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} />
                    Generating from AI...
                  </div>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview