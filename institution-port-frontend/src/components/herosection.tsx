import Link from "next/link";

export function HeroSection() {
  return <section className="md:relative md:overflow-hidden w-full pb-12 pt-12 md:mt-10 group">
    {/* Background Image */}
    <div className=" md:block hidden absolute right-3 left-3 rounded-3xl inset-0 z-0 bg-[url('/hero3.jpg')] lg:bg-[url('/hero1.jpg')] bg-cover bg-bottom transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-50"></div>

    {/* Foreground Content */}
    <div className="md:relative z-10 container space-y-10 xl:space-y-16">
      <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Your Universal Gateway to Education & Work
          </h1>
        </div>
        <div className="flex flex-col items-start space-y-4">
          <p className="mx-auto max-w-[700px] text-gray-900 md:text-xl dark:text-gray-300">
            Discover universities, companies, and institutions. Apply to forms, get scholarships, and join internal portals — all with a single account.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Get Started For Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
}