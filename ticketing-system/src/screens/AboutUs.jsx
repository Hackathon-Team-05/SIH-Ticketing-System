import React,{useEffect} from 'react'
import { Hero } from '../components/Home_Page_Components/Hero';
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Nav from '../components/Home_Page_Components/Nav';
const AboutUs=() => {
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
    <Hero/>
    <section className="bg-white py-16">
    <div className="container mx-auto px-8">
    <h2 className="text-[5vw] font-[700] mb-6 text-center">ABOUT US</h2>
    <div className="text-center max-w-3xl mx-auto">
    <p className="text-[2vw] font-[600] ">
    Welcome to <span className=" text-[3vw] font-[800]">SANGRAHAMITRA</span>, a hub where history, art, and culture come to life. Our mission is to provide an accessible and immersive experience for all. Whether you are a history enthusiast, an art lover, or a curious explorer, our collections offer something for everyone. Our state-of-the-art facilities, interactive displays, and knowledgeable staff ensure that your visit is both enjoyable and enlightening.
    </p>
    <p className="text-[2vw] font-[600] leading-relaxed">
    Through this platform, you can easily browse our exhibits, purchase tickets, and plan your visit. We are committed to making art and history accessible to all, with a seamless booking experience and an inclusive environment that welcomes people from all walks of life.
    </p>
    </div>
    </div>
  </section>
  </>
  );
}

export default AboutUs