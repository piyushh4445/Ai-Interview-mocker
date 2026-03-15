"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function Home() {

  const [activeTab, setActiveTab] = useState("tech")

  return (
    <div>

      
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-6">

        <div className="border px-5 py-2 rounded-full text-gray-500 mb-6 text-sm">
          How to use this AI interview mocker.
          <Link href="/how-it-works" className="text-purple-600 ml-1 font-medium">
            Read more →
          </Link>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          Your Personal AI Interview Coach
        </h1>

        <p className="text-gray-500 text-lg mb-8 max-w-xl">
          Double your chances of landing that job offer with our AI-powered interview prep
        </p>

        <div className="flex gap-6 items-center">

          <SignedIn>
            <Link
              href="/dashboard"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-up"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>
          </SignedOut>

          {/* SCROLL BUTTON */}
          <a href="#resources" className="text-purple-600 font-medium">
            Learn more →
          </a>
        </div>

      </section>


      {/* RESOURCES */}
      <section id="resources" className="py-20 px-6 bg-gray-50">

        <h2 className="text-5xl font-bold text-center mb-4">
          B.Tech Interview & Preparation Resources
        </h2>

        <p className="text-center text-gray-500 mb-10">
          Power up your professional journey with expert resources and interview practice.
        </p>


        {/* TAB BUTTONS */}
        <div className="flex justify-center gap-4 mb-12">

          <button
            onClick={() => setActiveTab("tech")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "tech"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Tech Resources
          </button>

          <button
            onClick={() => setActiveTab("aptitude")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "aptitude"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Aptitude Resources
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "interview"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Interview Resources
          </button>

        </div>


        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* TECH TAB */}
          {activeTab === "tech" && (
            <>
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Coding Platforms
                </h3>

                <p className="text-gray-500 mb-4">
                  Practice coding and algorithmic problem-solving
                </p>

                <div className="flex flex-col gap-2 text-purple-600">

                  <a href="https://geeksforgeeks.org" target="_blank">GeeksforGeeks</a>
                  <a href="https://leetcode.com" target="_blank">LeetCode</a>
                  <a href="https://hackerrank.com" target="_blank">HackerRank</a>
                  <a href="https://codechef.com" target="_blank">CodeChef</a>

                </div>
              </div>


              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Technical Interview Preparation
                </h3>

                <p className="text-gray-500 mb-4">
                  Resources for system design and technical interviews
                </p>

                <div className="flex flex-col gap-2 text-purple-600">
                  <a href="https://www.interviewbit.com/" target="_blank" >InterviewBit</a>
                  <a href="https://algomaster.io/learn/lld" target="_blank">AlgoMaster LLD Sheet</a>
                  <a href="https://takeuforward.org/" target="_blank">Striver's Sheet</a>
                </div>

              </div>
            </>
          )}



          {/* APTITUDE TAB */}
          {activeTab === "aptitude" && (
            <>
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Aptitude & Reasoning
                </h3>

                <p className="text-gray-500 mb-4">
                  Practice quantitative and logical reasoning skills
                </p>

                <div className="flex flex-col gap-2 text-purple-600">
                  <a href="https://www.indiabix.com" target="_blank">IndiaBix</a>
                  <a href="https://freshersworld.com" target="_blank">Freshersworld Aptitude</a>
                  <a href="https://www.afternic.com/forsale/mathsguru.com?utm_source=TDFS_DASLNC&utm_medium=parkedpages&utm_campaign=x_corp_tdfs-daslnc_base&traffic_type=TDFS_DASLNC&traffic_id=daslnc&" target="_blank">
                  MathsGuru Reasoning</a>
                </div>
              </div>


              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Competitive Exam Prep
                </h3>

                <p className="text-gray-500 mb-4">
                  Resources for competitive and placement exams
                </p>

                <div className="flex flex-col gap-2 text-purple-600">
                  <a href="https://gateoverflow.in/" target="_blank">GATE Overflow</a>
                  <a href="https://www.careerpower.in/" target="_blank">Career Power</a>
                  <a href="https://brilliant.org/" target="_blank">Brilliant.org</a>
                </div>
              </div>
            </>
          )}



          {/* INTERVIEW TAB */}
          {activeTab === "interview" && (
            <>
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Interview Guides
                </h3>

                <p className="text-gray-500 mb-4">
                  Comprehensive interview preparation resources
                </p>

                <div className="flex flex-col gap-2 text-purple-600">
                  <a href="https://www.ambitionbox.com/" target="_blank">Insider Tips</a>
                  <a href="https://www.interviewstreet.com/" target="_blank">InterviewStreet</a>
                  <a href="https://learnyard.com/" target="_blank">LearnYard</a>
                </div>
              </div>


              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">
                  Global Learning Platforms
                </h3>

                <p className="text-gray-500 mb-4">
                  Online courses and learning resources
                </p>

                <div className="flex flex-col gap-2 text-purple-600">
                  <a href="https://www.coursera.org/" target="_blank">Coursera</a>
                  <a href="https://www.edx.org/" target="_blank">edX</a>
                  <a href="https://www.udemy.com/" target="_blank">Udemy</a>
                </div>
              </div>
            </>
          )}
          

        </div>

      </section>

{/* FOOTER ADD HERE */}
<footer className="bg-black text-white mt-16">
  <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

    {/* Left side text */}
    <p className="text-sm text-gray-300">
      © 2026 InterviewX. All Rights Reserved.
    </p>

    {/* Right side icons */}
    <div className="flex items-center gap-6">

      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition"
      >
        <Github size={22} />
      </a>

      <a
        href="https://linkedin.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition"
      >
        <Linkedin size={22} />
      </a>

    </div>

  </div>
</footer>

</div>
    
  )
}