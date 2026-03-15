import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { v4 as uuidv4 } from "uuid"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const body = await req.json()

    const {
      questions,
      jobPosition,
      jobDescription,
      jobExperience,
      createdBy,
    } = body

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid interview questions." },
        { status: 400 }
      )
    }

    const mockId = uuidv4()
    const createdAt = new Date().toISOString()

    await db.insert(MockInterview).values({
      mockId,
      jsonMockResp: JSON.stringify(questions),
      jobPosition,
      jobDesc: jobDescription,
      jobExperience,
      createdBy,
      createdAt,
    })

    return NextResponse.json({
      success: true,
      mockId,
      createdAt,
    })
  } catch (error) {
    console.log("SAVE INTERVIEW ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to save interview." },
      { status: 500 }
    )
  }
}