import React, { useEffect } from 'react'
import Nav from '../components/Home_Page_Components/Nav'
import Gallery from '../components/Home_Page_Components/Gallery'
import BlogsAndNews from '../components/Home_Page_Components/BlogsAndNews'
import HomeScreen from '../components/Home_Page_Components/HomeScreen'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import ChatBot_Screen from './ChatBot'
import PreLoader from '../components/Home_Page_Components/PreLoader'

const Home = () => {

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
    <div>
      <Nav/>
      {/* <PreLoader/> */}
      <HomeScreen/>
      <Gallery/>
      <BlogsAndNews/>
    </div>
  )
}

export default Home