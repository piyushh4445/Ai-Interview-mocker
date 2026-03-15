import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import ProgressChart from './_components/ProgressChart'
import PerformanceAnalyzer from './_components/PerformanceAnalyzer'

function Dashboard() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'> Dashbboard</h2>
      <h2 className='text-gray-900'> Create and Start your AI MOCK INTERVIEW</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview/>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-8'>
        <ProgressChart />
        <PerformanceAnalyzer />
      </div>

      {/* Previous Interview List */}
      <InterviewList/>
       </div>
  )
}

export default Dashboard