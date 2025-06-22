'use client'
import { HeroSection } from "@/components/homepage/herosection";
import { checkMe } from "@/lib/queries/checkme";


export default function Home() {
  const { data, status } = checkMe();
  const isLoggedIn = !!data?.user && status !== 'error';
  //todo: add a loading state for hero section
  return <main className="">
    {!isLoggedIn &&
      <HeroSection />
    }

  </main>;
}