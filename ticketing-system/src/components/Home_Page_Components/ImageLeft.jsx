import React from 'react'
import { useRef } from 'react';
import {Link} from "react-router-dom"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ImageLeft = ({data}) => {
    const titleRef = useRef(null);
    const imageRef = useRef(null);
    const locRef = useRef(null);
    const buttonRef = useRef(null);
    useGSAP(()=>{
        gsap.to(titleRef.current,{
            y:"0",
            duration:0.6,
            delay:0.2
        },"a"),
        gsap.to(locRef.current,{
            y:"0",
            duration:0.6,
            delay:0.2
        },"a"),
        gsap.to(buttonRef.current,{
            opacity:1,
            duration:0.6,
            delay:0.2
        },"a"),
        gsap.to(imageRef.current,{
            x:"0",
            opacity:1,
            duration:0.7,
            delay:0.2
        },"a")
    },[])
  return (
    <div className="imgright flex mb-[1vw] items-center justify-between w-[100%] h-[25vw] ">
      <div ref={imageRef} className="relative translate-x-[-100%] left h-[100%] rounded-r-[1vw] w-[47%] ">
        {/* <Link to="">
            <img src="https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className='w-[100%] rounded-r-[1vw] h-[100%] object-cover'/>
        </Link> */}
      </div>
      <div className="right flex items-center justify-center flex-col relative h-[100%] w-[47%] ">
      <div className="test relative w-[20vw] h-[4vw] flex items-end justify-center  z-[5] overflow-hidden">
              <h2 ref={titleRef} className='text-[2.5vw] absolute z-[2] font-[600] translate-y-[100%]'>{data.name}</h2>
          </div>
          <div className="location w-[20vw] relative z-[5] h-[1.6vw] overflow-hidden ">
              <h4 ref={locRef} className='text-[1vw] font-[300] flex justify-center translate-y-[-100%]'>{data.location}</h4>
          </div>
          <div ref={buttonRef} className="buttons opacity-0 flex items-center justify-center gap-[1vw] w-[20vw] h-[2.5vw] ">
              <Link to="/">
                  <button className='h-[1.6vw] w-[6vw] bg-[#1b0202] rounded-[1vw] text-amber-600 text-[0.8vw]'>Get Tickets</button>
              </Link> 
              <Link to="/">
                  <button className='h-[1.6vw] w-[6vw] border-[#1b0202] border-[0.1vw] bg-transparent rounded-[1vw] text-[#1b0202] text-[0.8vw]'>See More</button>
              </Link>
          </div>
      </div>
      
    </div>
  )
}

export default ImageLeft