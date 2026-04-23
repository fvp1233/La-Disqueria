import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { songsData } from "@/global/data/songs";

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const swiperRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
    if (isPlaying) audioRef.current?.play();
  };

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
  }, [currentIndex]);

  return (
    <div className="relative w-full h-[650px] flex items-center justify-center bg-[#050505] overflow-hidden font-sans">
      
      {/* Texto de Fondo*/}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none z-0">
        <h2 className="text-[12vw] font-black italic uppercase tracking-[0.1em]"
            style={{ WebkitTextStroke: '1px white', color: 'transparent' }}>
          Para ti
        </h2>
      </div>

      {/* Fondo Ambient Blur */}
      <div
        className="absolute inset-0 opacity-20 transition-all duration-1000"
        style={{
          backgroundImage: `url(${songsData[currentIndex].cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(100px)',
        }}
      />

      <div className="z-10 w-full flex flex-col items-center">
        
        <div className="text-center mb-10 px-4">
          <h2 className="text-xs md:text-sm font-light text-white uppercase tracking-[0.8em] opacity-80 mb-2">
            Selección Exclusiva
          </h2>
          <div className="h-[1px] w-12 bg-indigo-500 mx-auto opacity-50"></div>
        </div>

        {/* Carrusel Swiper */}
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          initialSlide={3}
          speed={800}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[EffectCoverflow, Navigation]}
          className="w-full !py-4"
        >
          {songsData.map((song, index) => (
            <SwiperSlide key={index} 
              style={{ width: '180px', height: '180px' }} 
              className="relative transition-all duration-500"
            >
              {({ isActive }) => (
                <div className={`w-full h-full transition-all duration-700 ease-out ${isActive ? 'scale-125 z-50' : 'scale-75 opacity-20 grayscale'}`}>
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-full h-full object-cover rounded shadow-2xl border border-white/10"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                      <a href={song.youtube} target="_blank" rel="noreferrer">
                        <YoutubeIcon className="text-white w-10 h-10 hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* informarcion de la cancion */}
        <div className="w-full max-w-sm mt-12 text-white text-center px-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold uppercase tracking-[0.3em]">
              {songsData[currentIndex].title}
            </h1>
            <p className="text-white/40 text-[9px] tracking-[0.5em] uppercase mt-3">
              {songsData[currentIndex].name}
            </p>
          </div>

          <audio 
            ref={audioRef} 
            src={songsData[currentIndex].source} 
            onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)} 
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} 
            onEnded={() => swiperRef.current?.slideNext()} 
          />

          <div className="flex flex-col items-center gap-8">
            <div className="w-full px-4">
              <input
                type="range"
                value={progress}
                max={duration || 0}
                step="0.01"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  audioRef.current.currentTime = val;
                  setProgress(val);
                }}
                className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="flex items-center gap-14">
              <button onClick={() => swiperRef.current?.slidePrev()} className="text-white/30 hover:text-white transition-colors">
                <SkipBack size={20} strokeWidth={1.5} />
              </button>
              
              <button onClick={togglePlay} className="p-5 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/5">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>

              <button onClick={() => swiperRef.current?.slideNext()} className="text-white/30 hover:text-white transition-colors">
                <SkipForward size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};