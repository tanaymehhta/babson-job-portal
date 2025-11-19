'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function AnimatedSparkle() {
    const [animationStage, setAnimationStage] = useState<'roaming' | 'settling' | 'landed'>('roaming')

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStage('settling')
            setTimeout(() => setAnimationStage('landed'), 500)
        }, 3000) // Roam for 3 seconds

        return () => clearTimeout(timer)
    }, [])

    // Circular path around the text (comet trajectory)
    const cometPath = [
        { x: -200, y: -80 },   // Start top-left
        { x: -100, y: -120 },  // Arc top
        { x: 100, y: -120 },   // Continue arc
        { x: 200, y: -80 },    // Top-right
        { x: 220, y: 20 },     // Right side
        { x: 180, y: 100 },    // Bottom-right
        { x: 50, y: 130 },     // Bottom
        { x: -100, y: 110 },   // Bottom-left
        { x: -220, y: 40 },    // Left side
        { x: -200, y: -40 },   // Complete circle
        { x: 0, y: 0 }         // Settle at center
    ]

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Final Icon State */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={animationStage === 'landed' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-emerald-100 p-4 rounded-2xl shadow-sm"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600"
                >
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    <path d="M18 4L19 7L22 8L19 9L18 12L17 9L14 8L17 7L18 4Z" />
                    <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
                </svg>
            </motion.div>

            {/* Comet with Tail */}
            {animationStage !== 'landed' && (
                <>
                    {/* Tail trails (multiple particles fading behind) */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 bg-emerald-300 rounded-full"
                            style={{
                                filter: `blur(${2 + i}px)`,
                                opacity: 0.6 - i * 0.1,
                            }}
                            initial={{ x: cometPath[0].x, y: cometPath[0].y }}
                            animate={
                                animationStage === 'roaming'
                                    ? {
                                        x: cometPath.map(p => p.x),
                                        y: cometPath.map(p => p.y),
                                    }
                                    : { x: 0, y: 0, opacity: 0 }
                            }
                            transition={
                                animationStage === 'roaming'
                                    ? {
                                        duration: 3,
                                        ease: "linear",
                                        delay: i * 0.05, // Stagger the tail
                                    }
                                    : { duration: 0.5 }
                            }
                        />
                    ))}

                    {/* Main comet head */}
                    <motion.div
                        className="absolute w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,1)]"
                        style={{
                            filter: 'blur(1px)',
                        }}
                        initial={{ x: cometPath[0].x, y: cometPath[0].y }}
                        animate={
                            animationStage === 'roaming'
                                ? {
                                    x: cometPath.map(p => p.x),
                                    y: cometPath.map(p => p.y),
                                }
                                : { x: 0, y: 0, scale: 0 }
                        }
                        transition={
                            animationStage === 'roaming'
                                ? {
                                    duration: 3,
                                    ease: "linear",
                                }
                                : { duration: 0.5 }
                        }
                    />
                </>
            )}
        </div>
    )
}
