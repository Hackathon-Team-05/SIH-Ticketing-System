import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {Link} from "react-router-dom"

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)
const Nav = () => {
  const navRef = useRef();

  useGSAP(()=>{
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger:navRef.current,
        start: "bottom top",
        // markers:true,
        scrub:2,
        ease: 'power1.inOut'
      },
    });
    tl.to(navRef.current, {
      backgroundColor:"#1b0202"
    })
  },{scope:navRef})
  return (
    <div ref={navRef} className='bg-transparent w-full h-[4.5vw] flex items-center justify-between fixed top-[0%] z-[999]'>
      <div className='headings h-[100%] w-[28vw]  flex items-center justify-center'>
        <h1 className='text-[1.5vw] italic text-white'>National Council of Museums</h1>
      </div>
      <div className='tags h-[100%] w-[30vw]  flex items-center justify-center gap-[3vw] '>
        <Link to="/home" className='text-[0.8vw] font-hairline text-white underline'>Home</Link>
        <Link to="/about" className='text-[0.8vw] font-hairline text-white underline'>About Us</Link>
        <Link to="/museums" className='text-[0.8vw] font-hairline text-white underline'>Museums</Link>
        <Link to="/contact" className='text-[0.8vw] font-hairline text-white underline'>Contact</Link>
      </div>
    </div>
  )
}

export default Nav