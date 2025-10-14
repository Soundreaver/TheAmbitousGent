import { NavigationAceternity } from '@/components/navigation-aceternity'
import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Testimonials } from '@/components/sections/testimonials'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <NavigationAceternity />
      <main id="main-content">
        <Hero />
        <Services />
        <Experience />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
