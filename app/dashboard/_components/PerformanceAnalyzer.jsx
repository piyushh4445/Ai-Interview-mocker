"use client"
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useState } from 'react'
import { generateInterview } from '@/utils/GeminiAiModel'
import { LoaderCircle, Sparkles } from 'lucide-react'

function PerformanceAnalyzer() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState("")

    const generateReport = async () => {
        setLoading(true)
        setReport("")
        try {
            // 1. Get recent interviews
            const interviews = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.id))

            if(interviews.length === 0) {
                setReport("Please complete at least one interview before generating an AI Performance Report.")
                setLoading(false)
                return;
            }

            const recentInterviews = interviews.slice(0, 3) // Analyze up to last 3 for tokens
            
            let compiledData = "";
            for (const interview of recentInterviews) {
                const answers = await db.select()
                    .from(UserAnswer)
                    .where(eq(UserAnswer.mockIdRef, interview.mockId))
                
                compiledData += `\nInterview Role: ${interview.jobPosition}\n`
                answers.forEach(ans => {
                    compiledData += `Question: ${ans.question}\nUser Answer: ${ans.userAns}\nAI Feedback Received: ${ans.feedback}\nRating Given: ${ans.rating}\n\n`
                })
            }

            // 2. Prompt Gemini
            const prompt = `You are an expert technical recruiter and career coach. Review the following questions, user answers, and the feedback they previously received for their recent mock interviews.
            
            Based on this history, write a short, encouraging summary of their overall Strengths and their primary Weaknesses/Areas of Improvement across these interviews. Keep it directly actionable and use markdown points.
            
            Interview Data:
            ${compiledData}`

            const result = await generateInterview(prompt);
            
            // The generateInterview function returns the text output directly based on utils/GeminiAiModel.js
            setReport(result)

        } catch (error) {
            console.error("Error generating report", error)
            
            if (error?.message?.includes('429') || error?.message?.includes('Quota')) {
                setReport("Google AI Rate Limit Reached. Please wait a minute before generating another report.")
            } else {
                setReport("An error occurred while generating your report. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-6 border rounded-xl bg-purple-50 mt-5'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='font-bold text-lg text-purple-900 flex items-center gap-2'>
                    <Sparkles className="text-purple-600" size={20} />
                    AI Overall Feedback Analyzer
                </h2>
                {!report && (
                    <button 
                        onClick={generateReport}
                        disabled={loading}
                        className='bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2'
                    >
                        {loading && <LoaderCircle className='animate-spin' size={16} />}
                        {loading ? 'Analyzing...' : 'Generate Report'}
                    </button>
                )}
            </div>

            {report ? (
                <div className='text-gray-700 text-sm whitespace-pre-wrap leading-relaxed'>
                    {report}
                </div>
            ) : (
                <p className='text-sm text-gray-500'>
                    Click the button above to generate a personalized AI summary of your strengths and weaknesses based on your recent mock interviews.
                </p>
            )}
        </div>
    )
}

export default PerformanceAnalyzer
