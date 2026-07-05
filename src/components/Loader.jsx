import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADER_BG_COLOR = '#4c28d9'; // Video's deep purple-blue

export default function Loader({ onFinish }) {
  const [phase, setPhase] = useState("rotating"); // rotating -> merging -> star -> flying

  useEffect(() => {
    // Rotation & merging
    const mergeTimer = setTimeout(() => {
      setPhase("merging");
    }, 1200);

    // Turn into star
    const starTimer = setTimeout(() => {
      setPhase("star");
    }, 1600);

    // Fly to top right (approximate position of the logo on the login card)
    const flyTimer = setTimeout(() => {
      setPhase("flying");
    }, 2000);

    // Give it 0.8s to fly, then unmount loader and show main page
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(mergeTimer);
      clearTimeout(starTimer);
      clearTimeout(flyTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"
      // The background fades out slightly before the star finishes flying
      animate={{ backgroundColor: phase === "flying" ? 'rgba(76, 40, 217, 0)' : LOADER_BG_COLOR }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
    >
      {/* SVG Gooey Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {(phase === "rotating" || phase === "merging") && (
          <motion.div
            key="dots"
            className="absolute flex items-center justify-center"
            style={{ filter: 'url(#goo)' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 720 }}
            transition={{ duration: 1.6, ease: "easeIn" }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            <motion.div 
              className="absolute w-[24px] h-[24px] bg-white rounded-full"
              animate={{ y: phase === "merging" ? 0 : -25, scale: phase === "merging" ? 1.5 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute w-[24px] h-[24px] bg-white rounded-full"
              animate={{ y: phase === "merging" ? 0 : 25, scale: phase === "merging" ? 1.5 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </motion.div>
        )}

        {/* Phase 2: Pop into a star/sparkle, then Phase 3: fly to target */}
        {(phase === "star" || phase === "flying") && (
          <motion.div
            key="star"
            className="absolute flex items-center justify-center"
            initial={{ scale: 0.2, rotate: -45, opacity: 0, x: 0, y: 0 }}
            animate={
              phase === "flying" 
              ? { 
                  // Target coordinates depends on screen size. We use a rough viewport estimation 
                  // to fly to the top-right quadrant (where LoginForm logo usually sits in md/lg screens)
                  // and turn black
                  x: typeof window !== 'undefined' && window.innerWidth > 768 ? window.innerWidth * 0.25 : 0, 
                  y: typeof window !== 'undefined' ? -window.innerHeight * 0.2 : -200, 
                  scale: 0.4, 
                  rotate: 90, 
                  opacity: 1 
                }
              : { scale: 1, rotate: 0, opacity: 1, x: 0, y: 0 }
            }
            transition={
              phase === "flying" 
              ? { type: "spring", stiffness: 60, damping: 15, mass: 1 } // parabolic flight arc behavior
              : { type: "spring", stiffness: 300, damping: 15 } // popping behavior
            }
          >
            {/* The star icon changes its fill color to black as it flies onto the white form */}
            <motion.svg 
              viewBox="0 0 100 100" 
              className="w-[84px] h-[84px]"
              animate={{ fill: phase === "flying" ? "#0f172a" : "#ffffff" }} 
              transition={{ duration: 0.4 }}
            >
              <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
