import { db } from "@/utils/db"
import { UserAnswer } from "@/utils/schema"
import { NextResponse } from "next/server"
import moment from "moment"
import { and, eq } from "drizzle-orm"

export async function POST(req) {
  try {
    const body = await req.json()

    if (!body?.mockIdRef || !body?.question || !body?.userEmail) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      )
    }

    const existingAnswer = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, body.mockIdRef),
          eq(UserAnswer.question, body.question),
          eq(UserAnswer.userEmail, body.userEmail)
        )
      )

    if (existingAnswer.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Answer already saved for this question.",
      })
    }

    await db.insert(UserAnswer).values({
      mockIdRef: body.mockIdRef,
      question: body.question,
      correctAns: body.correctAns,
      userAns: body.userAns,
      feedback: body.feedback,
      rating: body.rating,
      userEmail: body.userEmail,
      createdAt: moment().format("DD-MM-YYYY"),
    })

    return NextResponse.json({
      success: true,
      message: "Answer saved successfully.",
    })
  } catch (error) {
    console.error("SAVE ANSWER ERROR:", error)

    return NextResponse.json(
      { error: "Failed to save answer." },
      { status: 500 }
    )
  }
}