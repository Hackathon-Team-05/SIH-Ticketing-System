import React from 'react'

const LineRight = (props) => {
  return (
    <div className="w-[100%] min-h-[2vw] mt-[2vw] p-[1vw] flex items-center justify-between">
        <div className="line h-[0.1vw] mr-[2vw] ml-[2vw] w-[100%] bg-black"></div>
        <h1 className='text-[2vw] pl-[1.8vw] h-[100%] mr-[2vw] max-w-[13vw] font-[400]'>{props.component}</h1>
    </div>
  )
}

export default LineRight