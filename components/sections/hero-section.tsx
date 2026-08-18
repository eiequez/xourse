// app/components/HeroSection.tsx
"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { motion } from "motion/react"
import * as THREE from "three"

import Link from "next/link"

import { DotPattern } from "../ui/dot-pattern"
import { ShimmerButton } from "../ui/shimmer-button"
import { OrbitingCircles } from "../ui/orbiting-circles"
// ---------- 3D: graduation cap with toss-in + cursor parallax ----------
function GradCap() {
  const { scene } = useGLTF("/graduation_hat.glb")
  const groupRef = useRef<THREE.Group>(null)
  const [start] = useState(() => Date.now())

  useFrame((state) => {
    if (!groupRef.current) return
    const t = (Date.now() - start) / 1000
    const tossDuration = 1.3

    const targetX = (state.mouse.y * Math.PI) / 10
    const targetY = (state.mouse.x * Math.PI) / 6

    if (t < tossDuration) {
      // toss up, spin once, land with a slight overshoot settle
      const p = Math.min(t / tossDuration, 1)
      const arc = Math.sin(p * Math.PI) // rises then falls
      const eased = 1 - Math.pow(1 - p, 3)

      groupRef.current.position.y = arc * 0.6
      groupRef.current.rotation.x = eased * Math.PI * 2
      groupRef.current.rotation.z = Math.sin(p * Math.PI * 2) * 0.15 * (1 - p)
    } else {
      // idle: gentle bob + cursor parallax
      const idle = Math.sin(t * 0.8) * 0.04
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        idle,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.04
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY + t * 0.05, // slow continuous drift so it never looks static
        0.04
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <primitive object={scene} scale={0.9} />
    </group>
  )
}

function CapScene() {
  return (
    <Canvas camera={{ position: [0, 2, 4.2], fov: 40 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} color="#EDEAE2" />
      <directionalLight
        position={[-4, 2, -2]}
        intensity={0.5}
        color="#C9A227"
      />
      <Suspense fallback={null}>
        <GradCap />
      </Suspense>
    </Canvas>
  )
}

// ---------- Transcript chips: small rating cards that drift in ----------
const chips = [
  { code: "BUS3013", rating: "4.8", top: "18%", left: "6%", delay: 0.9 },
  { code: "CS2044", rating: "3.2", top: "68%", left: "10%", delay: 1.1 },
  { code: "PSY1120", rating: "4.5", top: "12%", left: "82%", delay: 1.0 },
  { code: "ECO2210", rating: "2.9", top: "72%", left: "80%", delay: 1.2 },
]

function TranscriptChips() {
  return (
    <OrbitingCircles
      radius={300}
      speed={1}
      path={false}
      delay={1.5}
      className="z-10"
    >
      {chips.map((c) => (
        <motion.div
          key={c.code}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: c.delay,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ top: c.top, left: c.left }}
          className="flex items-center gap-2 rounded-full border border-brass/30 bg-ink/70 px-3 py-1.5 backdrop-blur-sm"
        >
          <span className="font-mono text-[11px] tracking-wide text-parchment/70">
            {c.code}
          </span>
          <span className="font-mono text-[11px] font-bold text-brass">
            {c.rating}
          </span>
        </motion.div>
      ))}
    </OrbitingCircles>
  )
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-ink px-6 lg:px-24">
      {/* faint scantron-bubble grid, ties back to "grading" without literal icons */}
      <DotPattern
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] opacity-[0.15]"
        cr={1}
      />

      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 font-mono text-xs tracking-[0.2em] text-brass uppercase"
          >
            XMUM electives, reviewed by students who took them
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl leading-[1.05] text-parchment lg:text-6xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Know before
            <br />
            you <em className="text-brass not-italic">enroll</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-md text-base leading-relaxed text-parchment/60"
          >
            Real ratings on workload, grading, and whether the syllabus lied.
            Written by XMUM students, for XMUM students only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-9 flex items-center gap-4"
          >
            <Link href="/auth/signup">
              <ShimmerButton
                shimmerColor="#EDEAE2"
                background="#C9A227"
                className="text-sm font-medium text-white"
              >
                Browse electives
              </ShimmerButton>
            </Link>
            <p className="text-sm font-medium text-parchment/70 decoration-parchment/30 transition">
              Rate a course you took
            </p>
          </motion.div>
        </div>

        {/* Right: 3D cap + transcript chips */}
        <div className="relative flex h-[420px] w-full items-center justify-center lg:h-[560px]">
          <TranscriptChips />
          <CapScene />
        </div>
      </div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-parchment/30"
      >
        <span className="font-mono text-xs tracking-wide">scroll</span>
      </motion.div>
    </section>
  )
}

useGLTF.preload("/graduation-cap.glb")
