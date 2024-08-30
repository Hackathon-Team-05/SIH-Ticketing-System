export const Hero =() => {
    return (
        <div className="relative">
           <div className="relative w-[100%] h-[40vw]">
                <video 
                className="w-[100%] h-[100%] mx-auto mb-8 object-cover" 
                src="/videos/museum3.mp4" 
                autoPlay 
                loop 
                muted
                />
           </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-white text-[6vw] font-[500] uppercase tracking-[1vw]"><span className="font-light">SANGRAHA</span>MITRA</h1>
            </div>
        </div>
    );
}