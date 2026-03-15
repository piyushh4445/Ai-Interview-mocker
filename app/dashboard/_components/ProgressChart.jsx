"use client"
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ProgressChart() {
    const { user } = useUser()
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        user && GetProgressData()
    }, [user])

    const GetProgressData = async () => {
        // 1. Get all user interviews
        const interviews = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.id))

        if (interviews.length === 0) return;

        // 2. We only want the most recent 5-10 for a clean chart, let's reverse them to be chronological for the chart (Left to right = Oldest to Newest)
        const recentInterviews = interviews.slice(0, 10).reverse()

        const finalData = [];

        // 3. For each interview, calculate average rating
        for (const interview of recentInterviews) {
            const answers = await db.select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, interview.mockId))

            if (answers.length > 0) {
                // Parse rating from Gemini (could be "7/10", "8", etc.)
                let totalRating = 0;
                answers.forEach(ans => {
                    const num = Number(String(ans.rating).match(/\d+/)?.[0]) || 0;
                    totalRating += num;
                })
                const avgRating = Math.round((totalRating / answers.length) * 10) / 10;
                
                // Format date manually safely
                let dateStr = "Unknown Date"
                if (interview.createdAt) {
                  dateStr = interview.createdAt;
                }

                finalData.push({
                    name: dateStr,
                    rating: avgRating,
                    position: interview.jobPosition
                })
            }
        }

        setChartData(finalData)
    }

    if (chartData.length < 2) {
        return (
            <div className='p-5 border rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-2 h-64 mt-5'>
                <h3 className='font-semibold text-gray-500'>Not enough data yet</h3>
                <p className='text-sm text-gray-400'>Complete at least 2 interviews to see your progress chart.</p>
            </div>
        )
    }

    return (
        <div className='p-5 border rounded-lg bg-white shadow-sm mt-5'>
            <h2 className='font-bold text-lg mb-4 text-purple-600'>Your Interview Progress Over Time</h2>
            <div className='h-72 w-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#4B5563', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#8B5CF6" 
                            strokeWidth={3}
                            activeDot={{ r: 8, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ProgressChart
