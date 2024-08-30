import { useRef } from 'react';
import gsap from 'gsap';
// import p1i1 from '../../public/assets/img 1.png';
// import p1i2 from '../../public/assets/img 2.png';
// import p2i1 from '../../public/assets/img 3.png';
// import p2i2 from '../../public/assets/img 4.png';
// import p3i1 from '../../public/assets/img 5.png';
// import p3i2 from '../../public/assets/img 6.png';
// import p3i3 from '../../public/assets/img 7.png';
// import p3i4 from '../../public/assets/img 8.png';
import {Link} from 'react-router-dom';

const Gallery = () => {
  const imageRefs = useRef([]);
  const textRefs = useRef([]);

  const setImageRef = (el, index) => {
    imageRefs.current[index] = el;
  };

  const setTextRef = (el, index) => {
    textRefs.current[index] = el;
  };

  const handleEnter = (index) => {
    gsap.to(imageRefs.current[index], { scale: 1.1, duration: 0.5 });
    gsap.to(textRefs.current[index], { y: "0%", duration: 0.5, ease: 'power1.out' });
  };

  const handleLeave = (index) => {
    gsap.to(imageRefs.current[index], { scale: 1, duration: 0.5 });
    gsap.to(textRefs.current[index], { y: "100%", duration: 0.5, ease: 'power1.out' });
  };

  const createRef = (index) => ({
    imageRef: (el) => setImageRef(el, index),
    textRef: (el) => setTextRef(el, index),
  });

  return (
    <>
      {/*<LineRight component="GALLERY"/>*/}
      <div className="gallery__items w-[100%] h-[100vh] mt-[2vw] flex items-center justify-between ">
        {/* Part 1 */}
        <div className="part1 p-[2vw]  w-[25%] h-[100%] flex gap-[2vw] flex-col">
          <div
            className="p1i1 relative w-[100%] h-[18vw] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
            onMouseEnter={() => handleEnter(0)}
            onMouseLeave={() => handleLeave(0)}
          > 
            <Link to="https://www.youtube.com">
              <img
                ref={createRef(0).imageRef}
                src="https://images.pexels.com/photos/13384500/pexels-photo-13384500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="p1i1"
                className="w-[100%] h-[100%] object-cover absolute z-[0]"
                />
            </Link>
            <div
              ref={createRef(0).textRef}
              className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
            >
              <h2 className="italic text-white">Whale skeleton</h2>
              <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
            </div>
          </div>

          <div
            className="p1i2 relative w-[100%] h-[33vw] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
            onMouseEnter={() => handleEnter(1)}
            onMouseLeave={() => handleLeave(1)}
          >
            <Link to="">
              <img
                ref={createRef(1).imageRef}
                src="https://images.pexels.com/photos/4365100/pexels-photo-4365100.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="p1i2"
                className="w-[100%] h-[100%] object-cover absolute z-[0]"
              />
            </Link>
            <div
              ref={createRef(1).textRef}
              className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
            >
              <h2 className="italic text-white">Whale skeleton</h2>
              <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
            </div>
          </div>
        </div>

        {/* Part 2 */}
        <div className="part2 p-[2vw] w-[25%]  h-[100%] flex gap-[2vw] flex-col">
          <div
            className="p2i1 relative w-[100%] h-[37vw] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
            onMouseEnter={() => handleEnter(2)}
            onMouseLeave={() => handleLeave(2)}
          >
            <Link to="">
              <img
                ref={createRef(2).imageRef}
                src="https://images.pexels.com/photos/2661943/pexels-photo-2661943.png?auto=compress&cs=tinysrgb&w=800"
                alt="p2i1"
                className="w-[100%] h-[100%] object-cover absolute z-[0]"
              />
            </Link>
            <div
              ref={createRef(2).textRef}
              className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
            >
              <h2 className="italic text-white">Whale skeleton</h2>
              <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
            </div>
          </div>

          <div
            className="p2i2 relative w-[100%] h-[14vw] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
            onMouseEnter={() => handleEnter(3)}
            onMouseLeave={() => handleLeave(3)}
          >
            <Link to="">
              <img
                ref={createRef(3).imageRef}
                src="https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="p2i2"
                className="w-[100%] h-[100%] object-cover absolute z-[0]"
              />
            </Link>
            <div
              ref={createRef(3).textRef}
              className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
            >
              <h2 className="italic text-white">Whale skeleton</h2>
              <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
            </div>
          </div>
        </div>

        {/* Part 3 */}
        <div className="part3 p-[2vw]  w-[50%] h-[100%] flex gap-[1vw] flex-col">
          <div className="top w-[100%] h-[19.5vw]">
            <div
              className="p3i1 relative w-[100%] h-[15.7vw] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
              onMouseEnter={() => handleEnter(4)}
              onMouseLeave={() => handleLeave(4)}
            >
              <Link to="">
                <img
                  ref={createRef(4).imageRef}
                  src="https://images.pexels.com/photos/26872531/pexels-photo-26872531/free-photo-of-low-angle-view-of-a-ceiling-in-a-cathedral.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="p3i1"
                  className="w-[100%] h-[100%] object-cover "
                />
              </Link>
              <div
                ref={createRef(4).textRef}
                className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
              >
                <h2 className="italic text-white">Whale skeleton</h2>
                <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
              </div>
            </div>
          </div>

          <div className="bottom flex items-center w-[100%] h-[60%] gap-[1vw]  justify-between">
            <div className="left h-[100%]  w-[52%] flex gap-[2vw] flex-col">
              <div
                className="p3bi1 relative w-[100%] h-[50%] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
                onMouseEnter={() => handleEnter(5)}
                onMouseLeave={() => handleLeave(5)}
              >
                <Link to="">
                  <img
                    ref={createRef(5).imageRef}
                    src="https://images.pexels.com/photos/14806048/pexels-photo-14806048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="p3bi1"
                    className="w-[100%] h-[100%] object-cover absolute z-[0]"
                  />
                </Link>
                <div
                  ref={createRef(5).textRef}
                  className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
                >
                  <h2 className="italic text-white">Whale skeleton</h2>
                  <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
                </div>
              </div>

              <div
                className="p3bi2 relative w-[100%] h-[50%] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
                onMouseEnter={() => handleEnter(6)}
                onMouseLeave={() => handleLeave(6)}
              >
                <Link to="">
                  <img
                    ref={createRef(6).imageRef}
                    src="https://images.pexels.com/photos/5286712/pexels-photo-5286712.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="p3bi2"
                    className="w-[100%] h-[100%] object-cover absolute z-[0]"
                  />
                </Link>
                <div
                  ref={createRef(6).textRef}
                  className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
                >
                  <h2 className="italic text-white">Whale skeleton</h2>
                  <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
                </div>
              </div>
            </div>

            <div className="right  h-[100%] w-[43%] flex items-center justify-center">
              <div
                className="p3bi3 relative w-[95%] h-[100%] z-[2] rounded-[1vw] bg-red-300 overflow-hidden"
                onMouseEnter={() => handleEnter(7)}
                onMouseLeave={() => handleLeave(7)}
              >
                <Link to="">
                  <img
                    ref={createRef(7).imageRef}
                    src="https://images.pexels.com/photos/5273636/pexels-photo-5273636.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="p3bi3"
                    className="w-[100%] h-[100%] object-cover absolute z-[0]"
                  />
                </Link>
                <div
                  ref={createRef(7).textRef}
                  className="text absolute bottom-[0%] w-[100%] min-h-[4vw] rounded-b-[1vw] z-[1] translate-y-[100%] p-[0.5vw]"
                >
                  <h2 className="italic text-white">Whale skeleton</h2>
                  <h3 className="font-[200] text-[0.8vw] text-white">Lorem ipsum dolor sit</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;