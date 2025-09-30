/** biome-ignore-all lint/a11y/noAriaHiddenOnFocusable: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Linkedin, Mail, Twitter, ExternalLink, Code, Palette, Zap, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function PortfolioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = stored === "dark" || (!stored && prefersDark)
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      pulse: number
      pulseSpeed: number
    }> = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const isDarkMode = document.documentElement.classList.contains("dark")
      const baseColor = isDarkMode ? "30, 64, 175" : "30, 58, 138"
      const accentColor = isDarkMode ? "59, 130, 246" : "37, 99, 235"

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.pulse += particle.pulseSpeed

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        const pulseAlpha = (Math.sin(particle.pulse) + 1) / 2
        const alpha = 0.3 + pulseAlpha * 0.4

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, `rgba(${accentColor}, ${alpha})`)
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()

        particles.forEach((particle2, j) => {
          if (i === j) return
          const dx = particle.x - particle2.x
          const dy = particle.y - particle2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 180) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particle2.x, particle2.y)
            const lineAlpha = 0.2 * (1 - distance / 180)
            ctx.strokeStyle = `rgba(${accentColor}, ${lineAlpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = gridCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gridSize = 50
    let offset = 0

    function drawGrid() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const isDarkMode = document.documentElement.classList.contains("dark")
      const gridColor = isDarkMode ? "rgba(30, 64, 175, 0.1)" : "rgba(30, 58, 138, 0.08)"
      const accentColor = isDarkMode ? "rgba(59, 130, 246, 0.15)" : "rgba(37, 99, 235, 0.12)"

      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1

      for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + offset, 0)
        ctx.lineTo(x + offset, canvas.height)
        ctx.stroke()
      }

      for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + offset)
        ctx.lineTo(canvas.width, y + offset)
        ctx.stroke()
      }

      const pulseLines = 5
      for (let i = 0; i < pulseLines; i++) {
        const progress = (offset + i * (canvas.width / pulseLines)) % canvas.width
        ctx.strokeStyle = accentColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(progress, 0)
        ctx.lineTo(progress, canvas.height)
        ctx.stroke()
      }

      offset += 0.3
      if (offset > gridSize) offset = 0

      requestAnimationFrame(drawGrid)
    }

    drawGrid()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const projects = [
    {
      title: "SaaS Dashboard Redesign",
      description:
        "Complete UI/UX overhaul for a B2B analytics platform, increasing user engagement by 45% and reducing support tickets.",
      tags: ["Next.js", "TypeScript", "Figma", "Tailwind"],
      link: "#",
    },
    {
      title: "E-Commerce Mobile App",
      description:
        "Built a cross-platform shopping app with real-time inventory, payment processing, and personalized recommendations.",
      tags: ["React Native", "Node.js", "Stripe", "MongoDB"],
      link: "#",
    },
    {
      title: "Marketing Website & CMS",
      description:
        "Custom headless CMS solution with dynamic content management, SEO optimization, and analytics integration.",
      tags: ["Next.js", "Sanity", "Vercel", "Analytics"],
      link: "#",
    },
    {
      title: "AI Chatbot Integration",
      description:
        "Intelligent customer support chatbot with natural language processing and seamless CRM integration.",
      tags: ["OpenAI", "Python", "React", "WebSocket"],
      link: "#",
    },
  ]

  const services = [
    {
      icon: Code,
      title: "Full-Stack Development",
      description:
        "End-to-end web application development using modern frameworks like Next.js, React, and Node.js. From concept to deployment.",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Beautiful, intuitive interfaces that prioritize user experience. Wireframing, prototyping, and pixel-perfect implementation.",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description:
        "Speed up your existing applications with code optimization, caching strategies, and modern best practices.",
    },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <canvas ref={gridCanvasRef} className="fixed inset-0 pointer-events-none opacity-30" aria-hidden="true" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
        <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="#" className="text-xl font-semibold text-foreground">
                LONG Vibol kh
              </Link>
              <div className="hidden md:flex items-center gap-8">
                <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </Link>
                <Link href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="inline-block mb-4 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium animate-pulse">
              Available for Freelance Projects
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              Freelance Developer from Cambodia
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 text-pretty">
              Based in the Kingdom of Wonder, I help businesses worldwide bring their digital ideas to life.
              Specializing in modern web applications, stunning UI/UX design, and scalable solutions that drive results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="shadow-lg shadow-accent/20">
                <Link href="#contact">Hire Me</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#projects">View Work</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-6 bg-secondary/30 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">About Me</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a freelance full-stack developer and designer based in Cambodia with 5+ years of experience helping
                clients worldwide transform their ideas into successful digital products. I work with startups,
                agencies, and established businesses across Asia and beyond to create exceptional web experiences.
              </p>
              <p>
                My approach is collaborative and results-driven. I don't just write code—I partner with you to
                understand your goals, solve problems, and deliver solutions that exceed expectations. Every project
                gets my full attention and expertise, combining modern technology with the creative spirit of Cambodia.
              </p>
              <p>
                I specialize in React, Next.js, TypeScript, and modern design tools. Whether you need a complete
                application, a redesign, or technical consultation, I'm here to help you succeed from the heart of
                Southeast Asia.
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">What I Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="p-6 bg-card hover:shadow-xl transition-all hover:-translate-y-1">
                  <service.icon className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 px-6 bg-secondary/30 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer bg-card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Let's Build Something Amazing</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Have a project in mind? I'm currently available for freelance work and would love to hear about your
              ideas. Let's discuss how I can help bring your vision to life.
            </p>
            <Button size="lg" asChild className="shadow-lg shadow-accent/20">
              <Link href="mailto:hello@example.com" className="inline-flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Start a Project
              </Link>
            </Button>
          </div>
        </section>

        <footer className="border-t border-border py-12 px-6 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-muted-foreground">© 2025 Your Name. Proudly based in Cambodia 🇰🇭</p>
              <div className="flex items-center gap-6">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="mailto:hello@example.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
