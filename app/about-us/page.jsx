"use client"

import { Award, Users, Briefcase } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function AboutUs() {
  return (
    <div>

      {/* Heading */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold">About InterviewX</h1>
        <p className="text-gray-600 mt-4">
          Empowering professionals to ace interviews through intelligent AI coaching
        </p>
      </div>

      {/* Mission Story Approach */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8 mb-16">

        <h3 className="text-xl font-semibold text-purple-700 mb-2">Mission</h3>
        <p className="text-gray-600 mb-6">
          At InterviewX, we're redefining interview preparation with smart, personalized coaching powered by advanced AI. Our mission is to empower you with tailored guidance and intelligent practice—helping you confidently pursue your unique career goals and stand out in every interview.
</p>
<p className="text-gray-600 mb-6">With InterviewX, the goal is to bridge the gap between preparation and success, empowering users to unlock their full potential.</p>
        

        <h3 className="text-xl font-semibold text-purple-700 mb-2">Story</h3>
        <p className="text-gray-600 mb-6">
        InterviewX  was inspired by real-life struggles with interview preparation. Our Team set out to build a platform that makes interview prep simple, effective, and confidence-boosting for everyone. Our goal is to help you overcome the stress and uncertainty of interviews—so you can focus on showcasing your true potential.
        </p>

<p className="text-gray-600 mb-6">This journey has been a testament to the power of passion and innovation, leading to the creation of an impactful tool for career growth.</p>
        

        <h3 className="text-xl font-semibold text-purple-700 mb-2">Approach</h3>
        <p className="text-gray-600 mb-4">
  InterviewX leverages advanced AI algorithms to generate dynamic, contextually relevant interview questions based on your professional background and goals.
</p>

<p className="text-gray-600">
  Through real-time analysis and feedback, the platform provides actionable insights, enabling users to improve with every mock interview attempt.
</p>

      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto px-6 mb-16">

        <h2 className="text-3xl font-bold text-center mb-10">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
            <Award className="mx-auto text-purple-600 mb-3" size={40}/>
            <h3 className="font-semibold">Continuous Learning</h3>
            <p className="text-gray-600 text-sm mt-2">
              Always improving and building better tools for interview practice.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
            <Users className="mx-auto text-purple-600 mb-3" size={40}/>
            <h3 className="font-semibold">Empowerment</h3>
            <p className="text-gray-600 text-sm mt-2">
              Helping people build confidence and succeed in interviews.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
            <Briefcase className="mx-auto text-purple-600 mb-3" size={40}/>
            <h3 className="font-semibold">Excellence</h3>
            <p className="text-gray-600 text-sm mt-2">
              Delivering high quality tools for interview preparation.
            </p>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white flex justify-between items-center px-10 py-6">

        <p className="text-sm">
          © 2026 InterviewX. All Rights Reserved.
        </p>

        <div className="flex gap-4 text-xl">

          <a href="https://github.com/piyushh4445" target="_blank">
            <FaGithub/>
          </a>

          <a href="https://www.linkedin.com/in/piyush-garg-57a659248/" target="_blank">
            <FaLinkedin/>
          </a>

        </div>

      </footer>

    </div>
  )
}