// app/components/HeroSection.tsx
"use client"

import { Suspense, useEffect, useRef, useState, type RefObject } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { motion, useInView } from "motion/react"
import * as THREE from "three"

import Link from "next/link"

import { DotPattern } from "../ui/dot-pattern"
import { ShimmerButton } from "../ui/shimmer-button"
import { OrbitingCircles } from "../ui/orbiting-circles"
// ---------- 3D: graduation cap with toss-in + cursor parallax ----------
function GradCap() {
  const { scene } = useGLTF("/graduation_hat.glb")
  const groupRef = useRef<THREE.Group>(null)
  const elapsed = useRef(0)
  // Touch screens have no cursor to follow, so there the cap turns with the
  // page scroll instead
  const [touch] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    // Counts rendered time only. Rendering pauses while the hero is
    // off-screen, and wall-clock time would make the drift jump on return.
    elapsed.current += Math.min(delta, 0.1)
    const t = elapsed.current
    const tossDuration = 1.3

    let targetX: number
    let targetY: number
    if (touch) {
      const scrolled = Math.min(window.scrollY / window.innerHeight, 1)
      targetX = scrolled * 0.35
      targetY = scrolled * Math.PI
    } else {
      targetX = (state.pointer.y * Math.PI) / 10
      targetY = (state.pointer.x * Math.PI) / 6
    }

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

// Stops rendering while the hero is off-screen, so it doesn't keep the GPU
// busy (and drain phone batteries) further down the page
function CapScene({ active }: { active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 4.2], fov: 40 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} color="#F2F4F3" />
      <directionalLight
        position={[-4, 2, -2]}
        intensity={0.5}
        color="#A9927D"
      />
      <Suspense fallback={null}>
        <GradCap />
      </Suspense>
    </Canvas>
  )
}

// ---------- Transcript chips: small rating cards that drift in ----------
const chips = [
  { code: "G0234", top: "18%", left: "6%", delay: 0.9 },
  { code: "G0102", top: "68%", left: "10%", delay: 1.1 },
  { code: "G0156", top: "12%", left: "82%", delay: 1.0 },
  { code: "G0103", top: "72%", left: "80%", delay: 1.2 },
]

// The chips orbit 300px out on desktop. Below lg the cap sits above the copy
// in a smaller box, so the orbit shrinks to that box to keep them on screen.
function useOrbitRadius(ref: RefObject<HTMLDivElement | null>) {
  const [radius, setRadius] = useState(300)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const desktop = window.matchMedia("(min-width: 1024px)")
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setRadius(
        desktop.matches ? 300 : Math.round(Math.min(width / 2 - 40, height / 2))
      )
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return radius
}

function TranscriptChips({ radius }: { radius: number }) {
  return (
    <OrbitingCircles
      radius={radius}
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
          className="flex items-center gap-2 rounded-full border border-sand/30 bg-night/70 px-3 py-1.5 backdrop-blur-sm"
        >
          <span className="font-mono text-[11px] tracking-wide text-bone/70">
            {c.code}
          </span>
        </motion.div>
      ))}
    </OrbitingCircles>
  )
}

export default function HeroSection() {
  const visualRef = useRef<HTMLDivElement>(null)
  const inView = useInView(visualRef, { initial: true })
  const orbitRadius = useOrbitRadius(visualRef)

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-night px-6 py-12 lg:px-24 lg:py-0">
      {/* faint scantron-bubble grid, ties back to "grading" without literal icons */}
      <DotPattern
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] opacity-[0.15]"
        cr={1}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left: copy (centered under the cap below lg) */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 font-mono text-xs tracking-[0.2em] text-sand uppercase"
          >
            XMUM electives, reviewed by students who took them
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Know before
            <br />
            you <em className="text-sand not-italic">enroll</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-bone/60 lg:mx-0"
          >
            Course ratings on workload, grading, and whether the syllabus lied.
            Written by XMUM students, for XMUM students only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:justify-start"
          >
            <Link href="/auth/signup">
              <ShimmerButton
                shimmerColor="#A9927D"
                background="#49111C"
                className="text-sm font-medium text-white"
              >
                Browse electives
              </ShimmerButton>
            </Link>
            <p className="text-sm font-medium text-bone/70 decoration-bone/30 transition">
              Rate a course you took
            </p>
          </motion.div>
        </div>

        {/* Right on desktop, on top below lg: 3D cap + transcript chips */}
        <div
          ref={visualRef}
          className="relative order-first flex h-65 w-full items-center justify-center sm:h-85 lg:order-0 lg:h-140"
        >
          <TranscriptChips radius={orbitRadius} />
          <CapScene active={inView} />
        </div>
      </div>
      {/* Only on desktop: on phones it would sit on top of the buttons */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-bone/30 lg:block"
      >
        <span className="font-mono text-xs tracking-wide">scroll</span>
      </motion.div>
    </section>
  )
}

useGLTF.preload("/graduation_hat.glb")
