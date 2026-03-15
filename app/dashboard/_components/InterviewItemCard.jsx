import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
    const router=useRouter();
    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)

    }

    const onFeedbackPress=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+"/feedback")

    }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-700'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-400'>Created At: {new Date(interview.createdAt).toLocaleDateString("en-IN",{
              day:"numeric",
              month:"short",
              year:"numeric"
      })}</h2>
<div className='flex justify-between mt-2'>
    
    <Button size="sm" variant="outline"
    onClick={onFeedbackPress}>
        Feedback
    </Button>
 
    <Button size="sm"  className="bg-purple-900 " 
    onClick={onStart}>
        Start
    </Button>

</div>

    </div>
  )
}

export default InterviewItemCard
