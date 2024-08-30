import React, { useEffect } from 'react'
import ImageRight from "../components/Home_Page_Components/ImageRight"
import ImageLeft from "../components/Home_Page_Components/ImageLeft"
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Nav from '../components/Home_Page_Components/Nav'
const FilterPage = () => {
  const data = [
   {
     name:"Indian Museum",
     location:"Kolkata, West Bengal",
     imgsrc:"https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800"
   },
   {
     name:"Mumbai Museum",
     location:"Mumbai",
     imgsrc:"https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800"
   }
  ]

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e) => {
      console.log(e);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <>
        <Nav/>
        <div className="filtering w-[100%] h-[5vw] bg-red-800">
          
        </div>
        <div className="imagelist w-[100vw] min-h-[100vw]">
            <ImageRight data={data[0]}/>
            <ImageLeft data={data[1]}/>
            <ImageRight data={data[0]}/>
            <ImageLeft data={data[1]}/>
        </div>
    </>
  )
}

export default FilterPage