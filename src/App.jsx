import { useState } from 'react'
import HeroSection from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      <HeroSection />
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
    </>
  )
}
