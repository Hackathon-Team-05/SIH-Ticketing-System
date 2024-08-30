import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LineLeft from './LineLeft';

const data = [
  {
    img:"https://images.pexels.com/photos/12750189/pexels-photo-12750189.jpeg?auto=compress&cs=tinysrgb&w=800",
    name:"Whale Skeleton",
    description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link:"https://en.wikipedia.org/wiki/Whale_fall"
  },
  {
    img:"https://images.pexels.com/photos/14770179/pexels-photo-14770179.jpeg?auto=compress&cs=tinysrgb&w=800",
    name:"Crocodile Skeleton",
    description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link:"https://en.wikipedia.org/wiki/Sarcosuchus"
  },
  {
    img:"https://images.pexels.com/photos/14942923/pexels-photo-14942923.jpeg?auto=compress&cs=tinysrgb&w=800",
    name:"Hooman Skeleton",
    description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link:"https://en.wikipedia.org/wiki/Human_skeleton"
  }
]
const BlogsAndNews = () => {
  const settings = {
    arrows:true,
    dots: true,
    infinite: true,
    autoplay:true,
    autoplaySpeed:3000,
    easing:'linear',
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  return (

      <>
        <LineLeft component="BLOGS AND NEWS"/>
        <div className='w-[80vw] ml-[10vw] mb-[4vw]'>
          <div className='mt-[2vw]'>
            <Slider {...settings}>
            {
              data.map((d)=>{
                return(
                  <div className='bg-gray-200 h-[35vw] text-black rounded-[1vw] '> 
                      <div className='h-[80%] w-[100%] rounded-t-[1vw] bg-indigo-400 flex items-center justify-center'>
                        <img className="h-[100%] w-[100%] object-cover rounded-t-[1vw]" src={d.img} alt="heh" />
                      </div>
                
                      <div className='h-[20%] w-[100%] leading-[1.6vw] rounded-b-[1vw] bg-gray-300 flex flex-col gap-[0.4vw] pl-[0.9vw] pt-[0.6vw]'>
                        <h2 className='text-[2vw]'>{d.name}</h2>
                        <h4 className='text-[0.7vw] leading-[1vw]'>{d.description}</h4>
                        <a href={d.link}><h4 className='text-[0.9vw] font-[500]'>Read More</h4></a>
                      </div>
                    </div>
                  )
                })
              }
            </Slider>
          </div>
        </div>
    </>
  )
}

export default BlogsAndNews