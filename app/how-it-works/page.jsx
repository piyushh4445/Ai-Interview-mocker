"use client"

import { useRouter } from "next/navigation"


export default function HowItWorks() {

const router = useRouter()

return (
   


    
<div className="px-10 pt-6 pb-4 h-[calc(100vh-64px)] flex flex-col justify-between">
{/* Heading */}
<div className="text-center mb-4">
<h1 className="text-4xl font-bold">
InterviewX: Practice. Perfect. Perform.
</h1>

<p className="text-gray-500 mt-3 text-lg">
Master your interviews with AI-powered practice and personalized insights
</p>
</div>

{/* Steps Grid */}
<div className="grid md:grid-cols-3 gap-4">

{/* Step 1 */}
<div className="p-6 border rounded-xl shadow-sm">
<h2 className="font-semibold text-xl mb-2">
Step 1: Sign Up or Log In
</h2>

<p className="text-gray-500">
Create an account or log in using Clerk. Build a personalized profile that tracks your interview journey.
</p>
</div>

{/* Step 2 */}
<div className="p-6 border rounded-xl shadow-sm">
<h2 className="font-semibold text-xl mb-2">
Step 2: Choose Your Interview Type
</h2>

<p className="text-gray-500">
Select from technical, behavioral, or mixed interviews.
Customize difficulty and topics.
</p>
</div>

{/* Step 3 */}
<div className="p-6 border rounded-xl shadow-sm">
<h2 className="font-semibold text-xl mb-2">
Step 3: Start the Mock Interview
</h2>

<p className="text-gray-500">
Our AI generates contextually relevant questions powered by Gemini.
</p>
</div>

{/* Step 4 */}
<div className="p-6 border rounded-xl shadow-sm">
<h2 className="font-semibold text-xl mb-2">
Step 4: Submit Your Answers
</h2>

<p className="text-gray-500">
Respond via text or voice. Our interface tracks your responses.
</p>
</div>

{/* Step 5 */}
<div className="p-6 border rounded-xl shadow-sm">
<h2 className="font-semibold text-xl mb-2">
Step 5: Receive Real-Time Feedback
</h2>

<p className="text-gray-500">
Get instant AI-powered analysis of your responses with ratings.
</p>
</div>

{/* Step 6 */}
<div className="p-6 border rounded-xl shadow-sm">
<h2 className="font-semibold text-xl mb-2">
Step 6: Continue Practicing
</h2>

<p className="text-gray-500">
Access your interview history and keep improving your skills.
</p>
</div>

</div>

{/* Button */}
<div className="flex justify-center mt-2">

<button
onClick={()=>router.push("/dashboard")}
className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium"
>
Start Your Interview Journey
</button>

</div>

</div>

)
}