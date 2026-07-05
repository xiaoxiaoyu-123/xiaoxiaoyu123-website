import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

export default function AnimatedCharacters({ 
  isPasswordFocused, 
  isEmailFocused,
  showPassword = false,
  isTyping = false,
  isNodding = false,
  loginState = 'idle'
}) {
  const containerRef = useRef(null);
  
  // Base mouse motion values (center initially)
  const baseMouseX = useMotionValue(500);
  const baseMouseY = useMotionValue(500);

  useEffect(() => {
    // We only attach this listener on the client
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e) => {
      // If focused on an input, stop tracking mouse so eyes lock on the field
      if (!isPasswordFocused && !isEmailFocused && loginState !== 'error') {
        baseMouseX.set(e.clientX);
        baseMouseY.set(e.clientY);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPasswordFocused, isEmailFocused, loginState, baseMouseX, baseMouseY]);

  // When focus changes or error, explicitly set the target coordinate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loginState === 'error') {
      baseMouseX.set(window.innerWidth * 0.5);
      baseMouseY.set(window.innerHeight * 0.8); // Look down in shame
    } else if (isPasswordFocused) {
      baseMouseX.set(window.innerWidth * 0.75);
      baseMouseY.set(window.innerHeight * 0.55);
    } else if (isEmailFocused) {
      baseMouseX.set(window.innerWidth * 0.75);
      baseMouseY.set(window.innerHeight * 0.45);
    }
  }, [isPasswordFocused, isEmailFocused, loginState, baseMouseX, baseMouseY]);

  // Create normalized values -1 (left/top) to +1 (right/bottom)
  // Use a safe fixed dimension fallback for SSR to prevent undefined crashes
  const safeWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const safeHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  
  const normX = useTransform(baseMouseX, [0, safeWidth], [-1, 1]);
  const normY = useTransform(baseMouseY, [0, safeHeight], [-1, 1]);

  // ================= THE 3-LEVEL SPRING SYSTEM ================= 
  // Level 1: Body (Slow, subtle, heavy, creates parallax shift of the jelly body)
  const bodyX = useSpring(normX, { stiffness: 40, damping: 25, mass: 2 });
  const bodyY = useSpring(normY, { stiffness: 40, damping: 25, mass: 2 });

  // Level 2: Face (Medium speed, the white parts and mouth moving across the body color)
  const faceX = useSpring(normX, { stiffness: 100, damping: 20, mass: 1 });
  const faceY = useSpring(normY, { stiffness: 100, damping: 20, mass: 1 });

  // Level 3: Pupils (Fast, snappy, rolling inside the white eye container)
  const pupilX = useSpring(normX, { stiffness: 250, damping: 15, mass: 0.5 });
  const pupilY = useSpring(normY, { stiffness: 250, damping: 15, mass: 0.5 });

  // ================= TOP-LEVEL TRANSFORM DEFINITIONS (Anti-Crash) =================
  // Purple
  const purpleBodyX = useTransform(bodyX, [-1, 1], [-10, 10]);
  const purpleFaceX = useTransform(faceX, [-1, 1], [-14, 14]);
  const purpleFaceY = useTransform(faceY, [-1, 1], [-8, 8]);
  const purplePupilX = useTransform(pupilX, [-1, 1], [-3.5, 3.5]);
  const purplePupilY = useTransform(pupilY, [-1, 1], [-3.5, 3.5]);

  // Black
  const blackBodyX = useTransform(bodyX, [-1, 1], [-8, 8]);
  const blackBodyRotate = useTransform(bodyX, [-1, 1], [-2, 2]);
  const blackFaceX = useTransform(faceX, [-1, 1], [-12, 12]);
  const blackFaceY = useTransform(faceY, [-1, 1], [-6, 6]);
  const blackPupilX = useTransform(pupilX, [-1, 1], [-3.5, 3.5]);
  const blackPupilY = useTransform(pupilY, [-1, 1], [-3.5, 3.5]);

  // Yellow
  const yellowBodyX = useTransform(bodyX, [-1, 1], [-4, 12]);
  const yellowFaceX = useTransform(faceX, [-1, 1], [-20, 20]);
  const yellowFaceY = useTransform(faceY, [-1, 1], [-5, 5]);
  const yellowPupilX = useTransform(pupilX, [-1, 1], [-1, 1]);
  const yellowPupilY = useTransform(pupilY, [-1, 1], [-1, 1]);

  // Orange
  const orangeBodyX = useTransform(bodyX, [-1, 1], [-12, 12]);
  const orangeFaceX = useTransform(faceX, [-1, 1], [-25, 25]);
  const orangeFaceY = useTransform(faceY, [-1, 1], [-10, 10]);
  const orangePupilX = useTransform(pupilX, [-1, 1], [-2, 2]);
  const orangePupilY = useTransform(pupilY, [-1, 1], [-3, 3]);

  // Drop transition for initial enter animation
  const dropTransition = (delay = 0) => ({
    type: "spring",
    stiffness: 100,
    damping: 10,
    mass: 1.2,
    delay: delay,
  });

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-end justify-center overflow-hidden bg-[#e5e7eb]" ref={containerRef}>
      <div className="relative w-[340px] h-[340px] bottom-0 origin-bottom scale-90 md:scale-100">
        
        {/* ================= 1. PURPLE TALL MONSTER (Z-10, BACK) ================= */}
        <motion.div 
          className="absolute left-[55px] bottom-0 w-[130px] h-[260px] origin-bottom shadow-sm z-10"
          initial={{ x: -400, y: 0, rotate: 0 }}
          animate={{ 
            x: 0, 
            y: isNodding ? 20 : (isEmailFocused ? -12 : 0), 
            rotateZ: isEmailFocused ? 5 : 0,
            scaleY: isTyping ? 0.95 : (isPasswordFocused ? 0.9 : 1),
            scaleX: isTyping ? 1.05 : 1
          }}
          style={{
            x: purpleBodyX,
          }}
          transition={{
            x: { duration: 0.8, ease: "easeOut" },
            rotate: { duration: 0.8, ease: "easeOut" },
            scaleY: { type: "spring", stiffness: 100 },
            scaleX: { type: "spring", stiffness: 100 }
          }}
        >
          {/* Fluid Rubber Morphing SVG */}
          <svg viewBox="0 0 130 340" style={{ overflow: 'visible', width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0 }}>
            <motion.path
              fill="#6a35ff"
              initial={{ d: "M 0 340 L 130 340 L 130 210 L 0 210 Z" }} // Start as square at bottom
              animate={{
                d: loginState === 'error'
                  ? "M 0 340 C -80 200, -120 150, -120 100 L -60 50 C 0 120, 100 200, 130 340 Z" 
                  : isPasswordFocused 
                    ? "M 0 340 C 0 200, -20 150, -100 80 L 10 30 C 70 100, 130 200, 130 340 Z" 
                    : "M 0 340 C 0 220, 0 110, 0 0 L 130 0 C 130 110, 130 220, 130 340 Z"
              }}
              transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 50 }}
            />
          </svg>

          {/* Face Container: Follows the morphed top edge mechanically */}
          <motion.div 
            className="absolute flex flex-col items-center w-full"
            animate={{
              x: loginState === 'error' ? -95 : isPasswordFocused ? -35 : 0,
              y: loginState === 'error' ? 50 : isPasswordFocused ? 35 : 10, 
              rotate: loginState === 'error' ? -40 : isPasswordFocused ? -20 : 0
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {/* Face Level: Physics Mouse tracking offsets */}
            <motion.div 
              className="flex flex-col items-center w-full"
              style={{
                x: purpleFaceX,
                y: purpleFaceY,
              }}
            >
              <div className="flex space-x-3">
                <motion.div 
                  className="w-3.5 bg-white rounded-full flex items-center justify-center relative overflow-hidden"
                  animate={{ height: isPasswordFocused ? 5 : 14 }}
                >
                  {/* Pupil Level: Look hard left if password shown */}
                  <motion.div 
                    className="w-1.5 h-1.5 bg-black rounded-full absolute"
                    animate={{ x: showPassword ? -10 : 0 }}
                    style={{ x: purplePupilX, y: purplePupilY }}
                  />
                </motion.div>
                <motion.div 
                  className="w-3.5 bg-white rounded-full flex items-center justify-center relative overflow-hidden"
                  animate={{ height: isPasswordFocused ? 5 : 14 }}
                >
                  {/* Pupil Level */}
                  <motion.div 
                    className="w-1.5 h-1.5 bg-black rounded-full absolute"
                    animate={{ x: showPassword ? -10 : 0 }}
                    style={{ x: purplePupilX, y: purplePupilY }}
                  />
                </motion.div>
              </div>
              {/* Mouth */}
              <motion.div 
                 className="mt-2 -ml-1 transition-all duration-300"
              >
                {showPassword || loginState === 'error' ? (
                   /* Sad or Annoyed/Inverted U mouth */
                   <svg width="16" height="8" viewBox="0 0 16 8" className="overflow-visible">
                      <path d="M 2 6 Q 8 0 14 6" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                   </svg>
                ) : (
                   /* Normal/Scared mouth */
                   <motion.div 
                     className="bg-black rounded-full"
                     animate={{ 
                       width: isPasswordFocused ? 8 : 12, 
                       height: isPasswordFocused ? 8 : 4,
                       borderRadius: isPasswordFocused ? "50%" : "2px"
                     }}
                   />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>


        {/* ================= 2. BLACK TALL MONSTER (Z-30, MIDDLE) ================= */}
        <motion.div 
          className="absolute left-[135px] bottom-0 w-[80px] h-[210px] bg-[#1c1d22] z-30 origin-bottom"
          initial={{ y: -1000, scaleY: 2 }}
          animate={{ 
            y: isNodding ? 20 : 0, 
            scaleY: isTyping ? 0.94 : 1,
            scaleX: isTyping ? 1.05 : 1,
            x: isPasswordFocused ? 15 : 0,
            rotate: 0, // Reset to vertical
            rotateZ: isEmailFocused ? 10 : (loginState === 'error' ? -8 : 0)
          }}
          style={{
            x: isPasswordFocused ? 15 : blackBodyX,
            rotateZ: blackBodyRotate, 
          }}
          transition={{
            y: { type: "spring", stiffness: 150, damping: 12, delay: 0.6 },
            scaleY: { type: "spring", stiffness: 100 },
            x: { type: "spring", stiffness: 100 }
          }}
        >
          {/* Fluid Rubber Morphing SVG */}
          <svg viewBox="0 0 80 280" style={{ overflow: 'visible', width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0 }}>
            <motion.path
              fill="#222222"
              initial={false}
              animate={{
                d: loginState === 'error'
                  ? "M 0 280 C -30 180, -40 140, -60 100 L 10 60 C 50 120, 80 180, 80 280 Z"
                  : isPasswordFocused 
                  ? "M 0 280 C 0 180, -10 140, -60 100 L 10 60 C 50 120, 80 180, 80 280 Z"
                  : "M 0 280 C 0 180, 0 90, 0 0 L 80 0 C 80 90, 80 180, 80 280 Z"
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </svg>

           {/* Face Container: Follows the morphed top edge mechanically */}
           <motion.div 
             className="absolute flex flex-col items-center w-full"
             animate={{
               x: isPasswordFocused ? -35 : 0,
               y: isPasswordFocused ? 80 : 20,
               rotate: isPasswordFocused ? -29 : 0
             }}
             transition={{ type: "spring", stiffness: 100, damping: 15 }}
           >
             {/* Face Level: Physics Mouse tracking offsets */}
             <motion.div 
               className="flex flex-col items-center w-full"
               style={{
                  x: blackFaceX,
                  y: blackFaceY,
               }}
             >
              <div className="flex space-x-2.5 pt-4 pl-3">
                <motion.div 
                  className="w-[14px] bg-white rounded-full flex items-center justify-center relative overflow-hidden"
                  animate={{ height: isPasswordFocused ? 4 : 14 }}
                >
                   {/* Pupil Level */}
                   <motion.div 
                    className="w-1.5 h-1.5 bg-black rounded-full absolute"
                    animate={{ x: showPassword ? -15 : 0 }}
                    style={{ x: blackPupilX, y: blackPupilY }}
                  />
                </motion.div>
                <motion.div 
                  className="w-[14px] bg-white rounded-full flex items-center justify-center relative overflow-hidden"
                  animate={{ height: isPasswordFocused ? 4 : 14 }}
                >
                    {/* Pupil Level */}
                    <motion.div 
                    className="w-1.5 h-1.5 bg-black rounded-full absolute"
                    animate={{ x: showPassword ? -15 : 0 }}
                    style={{ x: blackPupilX, y: blackPupilY }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>


        {/* ================= 3. YELLOW ROUND HEAD (Z-40, FRONT) ================= */}
        <motion.div 
          className="absolute left-[205px] bottom-0 w-[95px] bg-[#ecd842] rounded-t-[47.5px] z-40 origin-bottom overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            y: isNodding ? 20 : (isEmailFocused ? -12 : 0), 
            opacity: 1,
            height: loginState === 'error' ? "40%" : isPasswordFocused ? "45%" : "50%", 
            rotate: isEmailFocused ? 5 : (loginState === 'error' ? 12 : (isPasswordFocused ? -10 : 0)),
            scaleX: isTyping ? 1.05 : 1
          }}
          style={{
            x: yellowBodyX, 
          }}
          transition={{
            height: { type: "spring", stiffness: 70, damping: 15, delay: 0.8 },
            opacity: { duration: 0.4, delay: 0.8 },
            rotate: { type: "spring", stiffness: 100 }
          }}
        >
          {/* Face Container: Wrapping for Look Up to avoid Style/MotionValue crash */}
          <motion.div 
            className="flex flex-col pt-10 pl-6"
            animate={{ 
              y: isEmailFocused ? -25 : 0,
              rotate: isEmailFocused ? -5 : 0 
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.div
              style={{
                x: yellowFaceX,
                y: yellowFaceY,
              }}
            >
            {/* Eye (The yellow monster only has one eye looking from the side) */}
            <motion.div 
              className="w-2.5 bg-black rounded-full relative overflow-hidden ml-2"
              animate={{ height: isPasswordFocused ? 3 : 10 }}
            >
              {!isPasswordFocused && (
                 /* Pupil Level - subtle for this tiny eye */
                 <motion.div 
                  className="w-[7px] h-[7px] bg-black rounded-full absolute"
                  animate={{ x: showPassword ? -12 : 0 }}
                  style={{ x: yellowPupilX, y: yellowPupilY }}
                />
              )}
            </motion.div>
            {/* Mouth changes length */}
            <motion.div 
              className="w-14 h-[4px] bg-black mt-3 rounded-sm origin-left"
              animate={{
                rotate: loginState === 'error' ? 15 : (isPasswordFocused ? 0 : -8),
                width: loginState === 'error' ? 30 : (isPasswordFocused ? 20 : 85)
              }}
            />
            </motion.div>
          </motion.div>
        </motion.div>


        {/* ================= 4. ORANGE FAT MONSTER (Z-40, FRONT LEFT) ================= */}
        {/* Fat orange body uses a larger shift for "wobbly effect" */}
        <motion.div 
          className="absolute left-[-90px] bottom-0 w-[240px] bg-[#fb8b46] z-50 origin-bottom flex justify-center overflow-hidden"
          initial={{ x: -300, y: 0, scale: 0.2, borderRadius: "50%", height: "95px" }}
          animate={{ 
            x: 0,
            y: isNodding ? 20 : (isEmailFocused ? -6 : 0),
            scale: isPasswordFocused ? 1.05 : 1,
            scaleY: isTyping ? 0.95 : (isPasswordFocused ? 0.8 : 1), 
            scaleX: isTyping ? 1.08 : (isPasswordFocused ? 1.05 : 1),
            borderRadius: ["50%", "50%", "120px 120px 0 0"],
            height: loginState === 'error' ? "85px" : "95px" 
          }}
          style={{
            x: orangeBodyX, 
          }}
          transition={{
            x: { type: "keyframes", values: [-300, -200, -100, 0], times: [0, 0.3, 0.6, 1], duration: 1.2, ease: "easeOut" },
            y: { type: "keyframes", values: [0, -120, -60, 0], times: [0, 0.3, 0.6, 1], duration: 1.2, ease: "easeOut" },
            borderRadius: { delay: 0.9, duration: 0.3 },
            scale: { duration: 1.2 },
            height: { type: "spring", stiffness: 100 }
          }}
        >
           {/* Face Level */}
           <motion.div 
            className="flex flex-col items-center mt-[30px] ml-[60px]" // shifted right per reference
            style={{
              x: orangeFaceX, 
              y: orangeFaceY,
            }}
          >
            <div className="flex space-x-6 pr-4">
              <motion.div 
                className="w-3 bg-black rounded-full relative overflow-hidden"
                animate={{ height: isPasswordFocused ? 3 : 12 }}
              >
                {!isPasswordFocused && (
                  /* Pupil Level */
                  <motion.div 
                    className="w-full h-full bg-black rounded-full absolute"
                    animate={{ x: showPassword ? -15 : 0 }}
                    style={{ x: orangePupilX, y: orangePupilY }}
                  />
                )}
              </motion.div>
              <motion.div 
                className="w-3 bg-black rounded-full relative overflow-hidden"
                animate={{ height: isPasswordFocused ? 3 : 12 }}
              >
                {!isPasswordFocused && (
                   /* Pupil Level */
                   <motion.div 
                    className="w-full h-full bg-black rounded-full absolute"
                    animate={{ x: showPassword ? -15 : 0 }}
                    style={{ x: orangePupilX, y: orangePupilY }}
                  />
                )}
              </motion.div>
            </div>
            
            <div className="mt-1.5 mr-4 w-5 flex justify-center items-center">
              {showPassword || loginState === 'error' ? (
                 /* Annoyed/Sad mouth when password is shown or error */
                 <svg width="22" height="12" viewBox="0 0 20 12" className="mt-2 text-black">
                    <path d="M 2 8 Q 10 0 18 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                 </svg>
              ) : isPasswordFocused ? (
                /* Flat mouth when focused secretly */
                <div className="w-6 h-[5px] bg-black rounded-full shadow-sm"></div>
              ) : (
                /* Smile */
                <svg width="22" height="12" viewBox="0 0 20 12">
                   <path d="M 2 2 Q 10 12 18 2" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
