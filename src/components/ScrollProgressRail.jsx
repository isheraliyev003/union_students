import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * Document scroll depth as a thin vertical bar on the right (scrollbar side). Shown on all routes that mount it.
 */
export default function ScrollProgressRail() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
  })

  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 z-[55] w-[3px] origin-top rounded-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-cyan-500 opacity-90 dark:from-violet-400 dark:via-fuchsia-500 dark:to-teal-400"
      style={{ scaleY: scale }}
    />
  )
}
