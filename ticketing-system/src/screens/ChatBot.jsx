import React, { useRef } from 'react'
import PreLoader from '../components/Home_Page_Components/PreLoader'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import Nav from '../components/Home_Page_Components/Nav';
import  Chatbot  from '../components/ChatBot/ChatBot.jsx'

const ChatBot_Screen = ({onClose}) => {
  const textRef = useRef(null)
  const modalRef = useRef()
  useGSAP(()=>{
    gsap.to(textRef.current,{
      opacity:1,
      scale:1,
      duration:1,
      delay:0.5,
      ease:"power1.out"
    })
  })
  const closeModal=(e)=>{
    if(modalRef.current === e.target){
      onClose();
    }
  }
  return (
    <>
      {/* <PreLoader/> */}
      <div ref={modalRef} onClick={closeModal} className="cont w-full h-screen bg-transparent z-[98] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center items-center">
       <Chatbot/>
      </div>
    </>
  )
}

export default ChatBot_Screen