import { useEffect } from 'react'
import Navbar       from '../components/Landing/Navbar'
import Hero         from '../components/Landing/Hero'
import Marquee      from '../components/Landing/Marquee'
import Features     from '../components/Landing/Features'
import SdkSection   from '../components/Landing/SdkSection'
import Numbers      from '../components/Landing/Numbers'
import Testimonials from '../components/Landing/Testimonials'
import Pricing      from '../components/Landing/Pricing'
import Cta          from '../components/Landing/Cta'
import Footer       from '../components/Landing/Footer'

export default function Landing() {

  // ── Custom cursor
  useEffect(() => {
    document.body.classList.add('has-custom-cursor')
    const cursor = document.getElementById('cursor')
    if (!cursor) return
    const move = e => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }
    document.addEventListener('mousemove', move)
    return () => {
      document.body.classList.remove('has-custom-cursor')
      document.removeEventListener('mousemove', move)
    }
  }, [])

  // ── Scroll reveal — watches all .sr / .sr-left / .sr-right elements
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.sr, .sr-left, .sr-right')
      .forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Custom cursor dot */}
      <div id="cursor" />

      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <SdkSection />
      <Numbers />
      <Testimonials />
      {/* <Pricing /> */}
      <Cta />
      <Footer />
    </>
  )
}