import React,{useEffect} from 'react'
import contactHeader from "../../public/assets/Home_Page_Assets/contactheader.png"
import {Link} from "react-router-dom";
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Nav from '../components/Home_Page_Components/Nav';
const ContactUs = () => {
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
      <div className='h-screen w-screen'>
        <div className='w-full h-[50%] bg-cover bg-center'
             style={{backgroundImage: `url(${contactHeader})`}}>
        </div>
        <div className='flex justify-center items-center flex-col  w-full h-[50%]'>
          <br/>
          <h1 className="text-5xl text-black">Contact Us</h1>
          <br/>
          <p className="text-xl font-bold">Email:<Link className="font-normal"
                                                       to="mailto:xyz@gmail.com">xyz@gmail.com</Link></p>
          <p className="text-xl font-bold">Contact No:<span className="font-normal">9999999999</span></p>
          <br/>
          <p className="text-xl ">**Note that we are available from 7:00AM to 7:00PM</p>
        </div>
      </div>
    </>
      
  )
}

export default ContactUs