import { NavigationAceternity } from '@/components/navigation-aceternity'
import { Footer } from '@/components/footer'
import { Services } from '@/components/sections/services'

export const metadata = {
  title: 'Services | The Ambitious Gent',
  description: 'Personalized image consulting services to help you refine your wardrobe, grooming, and presence with confidence.',
}

export default function ServicesPage() {
  return (
    <>
      <NavigationAceternity />
      <main className="min-h-screen bg-black pt-32">
        <Services />
      </main>
      <Footer />
    </>
  )
}
