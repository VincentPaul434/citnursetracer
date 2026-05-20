"use client"

import { motion, type HTMLMotionProps, type Variants } from "framer-motion"
import { type ReactNode } from "react"

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

interface MotionPageProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
}

export function MotionPage({ children, delay = 0, className, ...props }: MotionPageProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={defaultVariants}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface MotionStaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  stagger?: number
}

const containerVariants: Variants = {
  hidden: {},
  visible: {},
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function MotionStagger({ children, delay = 0, stagger = 0.06, className, ...props }: MotionStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionItem({ children, className, ...props }: HTMLMotionProps<"div"> & { children: ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
