import { NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

    return NextResponse.json({
      text: data.text || "",
    });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF resume." },
      { status: 500 }
    );
  }
}