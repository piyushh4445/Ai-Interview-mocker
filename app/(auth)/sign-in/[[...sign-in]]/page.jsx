import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
      <section className="grid min-h-screen lg:grid-cols-2 bg-gray-900">
      
      {/* LEFT SIDE — IMAGE PANEL */}
      <div className="relative hidden lg:block">
        <img
  src="/bg.jpg"
  alt="Auth Background"
  className="absolute inset-0 h-full w-full object-cover"
/>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <div className="mb-4 text-3xl">🌊</div>

            <h1 className="text-4xl font-bold">
              Welcome to AI MOCK INTERVIEW 🦑
            </h1>

            <p className="mt-4 text-sm text-gray-200">
              Your AI coach for real-world interviews.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — SIGNIN */}
      <div className="flex items-center justify-center p-6">
        <SignIn
          appearance={{
            elements: {
              card:
                "shadow-xl rounded-xl border border-gray-200",
              headerTitle: "text-lg font-semibold",
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-white",
            },
          }}
        />
      </div>
    </section>

  );
}