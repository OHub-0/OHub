'use client'
import { HeroSection } from "@/components/herosection";
import { checkMe } from "@/lib/queries/checkme";


export default function Home() {
  const { data, status } = checkMe();
  const isLoggedIn = !!data?.user && status !== 'error';
  return <main className="">
    {!isLoggedIn &&
      <HeroSection />
    }

  </main>;
}