import { NavigationAceternity } from '@/components/navigation-aceternity'
import { Footer } from '@/components/footer'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'

export const metadata = {
  title: 'About | The Ambitious Gent',
  description: 'Learn about our philosophy and approach to elevating the modern professional through timeless elegance and refined presence.',
}

export default function AboutPage() {
  return (
    <>
      <NavigationAceternity />
      <main className="min-h-screen bg-black pt-32">
        <About />
        <Experience />
      </main>
      <Footer />
    </>
  )
}
