import React from 'react'
import HeroSection from './HeroSection'
import Footer from '../Footer'

function Home() {
  return (
    <div className='w-full p-3 '>
      <div className='w-full h-fit p-1'>
       <HeroSection />
      </div>
      <div className='w-full p-1'>
      <Footer/>
      </div>
    </div>
  )
}

export default Home