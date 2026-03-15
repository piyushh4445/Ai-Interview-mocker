// import { index } from 'drizzle-orm/gel-core'
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeach=(text)=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('Sorry, Your browser does not support text to speech')
    }
  }


  return (
    <div className='flex flex-col gap-6 h-full'>
      {/* QUESTION BUTTONS */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
        {mockInterviewQuestion?.map((question, index) => (
          <h2
            key={index}
            className={`p-2 rounded-lg text-xs text-center cursor-pointer border transition-all
            ${
              activeQuestionIndex === index
                ? "bg-purple-700 text-white border-purple-800"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* ACTIVE QUESTION TEXT */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase font-bold text-gray-400 tracking-tight">Active Question</h2>
            <Volume2 
                size={20}
                className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors' 
                onClick={()=>textToSpeach(mockInterviewQuestion?.[activeQuestionIndex]?.Question)}
            />
        </div>
        {mockInterviewQuestion?.[activeQuestionIndex]?.Question && (
          <h2 className="text-lg font-medium text-gray-700 leading-snug">
            {mockInterviewQuestion?.[activeQuestionIndex]?.Question}
          </h2>
        )}
      </div>
    </div>
  )
}

export default QuestionSection