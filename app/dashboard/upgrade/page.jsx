"use client";
import React from 'react';
import planData from '@/utils/planData';

function Upgrade() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl text-center">Upgrade</h2>
      <h2 className="text-center text-gray-500 mt-2">
        Upgrade to monthly plan to access unlimited mock interview
      </h2>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8 mt-8">
          {planData.map((plan, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12 text-center"
            >
              <h2 className="text-lg font-medium text-gray-900">
                {plan.name}
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {plan.cost}$
                </strong>
                <span className="text-sm font-medium text-gray-700"> /month</span>
              </p>

              <ul className="mt-6 flex flex-col gap-2 items-start justify-center text-gray-700 ml-4 max-w-fit mx-auto">
                {plan.offering.map((item, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.paymentLink ? plan.paymentLink + '?prefilled_email=' : '/dashboard'}
                className="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Upgrade;
