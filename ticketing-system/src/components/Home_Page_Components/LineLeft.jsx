import React from 'react'

const LineLeft = (props) => {
  return (
    <div className="w-[100%] h-[7vw] mt-[2vw] p-[1vw] flex items-center justify-between">
        <div className='h-[100%] mr-[2vw] ml-[1vw]  w-[13vw] flex items-center justify-center'>
          <h1 className='text-[2vw] font-[400]'>{props.component}</h1>
        </div>
        <div className="line h-[0.1vw] mr-[2vw] ml-[2vw] w-[100%] bg-black"></div>
    </div>
  )
}

export default LineLeft