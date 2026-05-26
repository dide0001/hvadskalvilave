'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================

interface Option {
  id: string
  text: string
  emoji: string
  tags: string[]
}

interface Question {
  id: number
  question: string
  emoji: string
  subtitle: string
  options: Option[]
}

interface Activity {
  emoji: string
  text: string
}

interface DateResult {
  id: string
  title: string
  titleEmoji: string
  description: string
  activities: Activity[]
  bgGradient: string
  emoji: string
  tags: string[]
}

// ==================== QUIZ DATA ====================

const QUESTIONS: Question[] = [
  {
    id: 0,
    question: 'Hvad er dit humør i dag?',
    emoji: '💭',
    subtitle: 'Vær ærlig nu... 😄',
    options: [
      { id: 'a', text: 'På toppen af verden!', emoji: '🌟', tags: ['energetic', 'active', 'outdoor'] },
      { id: 'b', text: 'Hyggelig og afslappet', emoji: '🛋️', tags: ['relaxed', 'indoor', 'cozy'] },
      { id: 'c', text: 'Lidt træt...', emoji: '😴', tags: ['chill', 'easy', 'indoor'] },
      { id: 'd', text: 'Klar til eventyr!', emoji: '🚀', tags: ['adventure', 'outdoor', 'active'] },
    ],
  },
  {
    id: 1,
    question: 'Inde eller ude?',
    emoji: '🌍',
    subtitle: 'Hvad trækker mest?',
    options: [
      { id: 'a', text: 'Sofa og hygge hjemme', emoji: '🏠', tags: ['indoor', 'cozy', 'relaxed'] },
      { id: 'b', text: 'Ude i naturen', emoji: '🌿', tags: ['outdoor', 'nature', 'active'] },
      { id: 'c', text: 'En tur ind til byen', emoji: '🏙️', tags: ['city', 'social', 'outdoor'] },
      { id: 'd', text: 'Overrask mig!', emoji: '🎲', tags: ['adventure', 'surprise', 'fun'] },
    ],
  },
  {
    id: 2,
    question: 'Hvad skal vi spise?',
    emoji: '🍽️',
    subtitle: 'Det vigtigste spørgsmål 👀',
    options: [
      { id: 'a', text: 'Pizza og film', emoji: '🍕', tags: ['casual', 'indoor', 'cozy'] },
      { id: 'b', text: 'Noget fancy og lækkert', emoji: '🥂', tags: ['fancy', 'romantic', 'city'] },
      { id: 'c', text: 'Street food på farten', emoji: '🌮', tags: ['casual', 'outdoor', 'fun'] },
      { id: 'd', text: 'Vi laver mad selv!', emoji: '👨‍🍳', tags: ['cozy', 'indoor', 'creative'] },
    ],
  },
  {
    id: 3,
    question: 'Hvad har du mest lyst til?',
    emoji: '✨',
    subtitle: 'Følg dit hjerte!',
    options: [
      { id: 'a', text: 'Noget aktivt og sjovt', emoji: '🎯', tags: ['active', 'fun', 'adventure'] },
      { id: 'b', text: 'Film eller serier', emoji: '🎬', tags: ['relaxed', 'indoor', 'cozy'] },
      { id: 'c', text: 'Noget kreativt', emoji: '🎨', tags: ['creative', 'indoor', 'fun'] },
      { id: 'd', text: 'Romantisk hygge', emoji: '💕', tags: ['romantic', 'cozy', 'relaxed'] },
    ],
  },
  {
    id: 4,
    question: 'Hvordan slutter den perfekte dag?',
    emoji: '🌙',
    subtitle: 'Det bedste er det sidste!',
    options: [
      { id: 'a', text: 'Is eller dessert', emoji: '🍦', tags: ['sweet', 'fun', 'casual'] },
      { id: 'b', text: 'Knus og film hjemme', emoji: '💕', tags: ['romantic', 'cozy', 'indoor'] },
      { id: 'c', text: 'Drinks og god musik', emoji: '🎵', tags: ['social', 'fun', 'city'] },
      { id: 'd', text: 'En romantisk aftentur', emoji: '🌃', tags: ['romantic', 'outdoor', 'active'] },
    ],
  },
]

const DATE_RESULTS: DateResult[] = [
  {
    id: 'cozy_night',
    title: 'Hygge-aften derhjemme!',
    titleEmoji: '🕯️',
    description:
      'I dag er det en ægte hygge-aften for jer to! Byg en fort af puder og tæpper, lav hjemmelavet mad (eller bestil takeaway 😄), og læg jer ind og se jeres yndlingsfilm med masser af knus.',
    activities: [
      { emoji: '🎬', text: 'Vælg en film I begge vil se' },
      { emoji: '🍿', text: 'Lav kæmpe portion popcorn' },
      { emoji: '🕯️', text: 'Tænd stearinlys overalt' },
      { emoji: '🛋️', text: 'Byg den ultimative sofa-fort' },
      { emoji: '☕', text: 'Varm kakao eller te til aftenen' },
    ],
    bgGradient: 'from-violet-950 via-purple-950 to-indigo-950',
    emoji: '🏠',
    tags: ['indoor', 'cozy', 'relaxed'],
  },
  {
    id: 'nature_adventure',
    title: 'Natur-eventyr i det fri!',
    titleEmoji: '🌿',
    description:
      'Frisk luft og grønne omgivelser kalder på jer! Tag på en tur i skoven eller en park, pak en picnic-kurv og nyd et måltid under åben himmel. Den perfekte dag til at genoplade batterierne.',
    activities: [
      { emoji: '🎒', text: 'Pack en lækker picnic-kurv' },
      { emoji: '🌲', text: 'Find en hyggelig skovtur eller park' },
      { emoji: '📸', text: 'Tag masser af fotos af hinanden' },
      { emoji: '☀️', text: 'Find det smukkeste solrige sted' },
      { emoji: '🍓', text: 'Medbring lækkerier og snacks' },
    ],
    bgGradient: 'from-emerald-950 via-green-950 to-teal-950',
    emoji: '🌲',
    tags: ['outdoor', 'nature', 'active'],
  },
  {
    id: 'city_exploration',
    title: 'By-eventyr og udforskning!',
    titleEmoji: '🏙️',
    description:
      'Udforsk byen som turister! Besøg en café I aldrig har prøvet, kig i sjove butikker, find et museum, og afslut med en god middag på en restaurant I er nysgerrige på.',
    activities: [
      { emoji: '☕', text: 'Prøv en ny og hyggelig café' },
      { emoji: '🛍️', text: 'Kig i sjove og unikke butikker' },
      { emoji: '🏛️', text: 'Find et museum, galeri eller udstilling' },
      { emoji: '🍜', text: 'Prøv en restaurant I aldrig har besøgt' },
      { emoji: '📸', text: 'Find byens smukkeste fotospots' },
    ],
    bgGradient: 'from-sky-950 via-blue-950 to-indigo-950',
    emoji: '🌆',
    tags: ['city', 'social', 'outdoor'],
  },
  {
    id: 'romantic_evening',
    title: 'Romantisk aften for to!',
    titleEmoji: '💕',
    description:
      'Det er tid til pure romance! Klæd jer flot på og book et bord på en fin restaurant. Nyd en aften med fantastisk mad, et glas vin og lange, dybe samtaler. Blomster og en lille overraskelse?',
    activities: [
      { emoji: '🌹', text: 'Køb blomster (psst, det er et hint!)' },
      { emoji: '🥂', text: 'Book en fin og hyggelig restaurant' },
      { emoji: '👗', text: 'Klæd jer ekstra flot og lækker på' },
      { emoji: '🌅', text: 'Find en smuk udsigt til solnedgangen' },
      { emoji: '💌', text: 'Skriv en lille kærlig note' },
    ],
    bgGradient: 'from-rose-950 via-pink-950 to-red-950',
    emoji: '💞',
    tags: ['romantic', 'fancy', 'outdoor'],
  },
  {
    id: 'creative_day',
    title: 'Kreativ og sjov dag!',
    titleEmoji: '🎨',
    description:
      'Slip kreativiteten løs! Prøv at male, lav DIY-projekter, bag en lækker kage, eller tag et keramik-kursus. Det handler om at have det sjovt og lave noget med hænderne!',
    activities: [
      { emoji: '🎨', text: 'Køb maling og lærreder og mal hinanden' },
      { emoji: '🍰', text: 'Bag og dekorer en kage fra bunden' },
      { emoji: '🏺', text: 'Book et sjovt keramik-kursus' },
      { emoji: '📸', text: 'Lav en kreativ foto-shoot session' },
      { emoji: '✂️', text: 'Lav et hyggeligt DIY-projekt sammen' },
    ],
    bgGradient: 'from-orange-950 via-amber-950 to-yellow-950',
    emoji: '🎨',
    tags: ['creative', 'indoor', 'fun'],
  },
  {
    id: 'adventure_day',
    title: 'Eventyr og action!',
    titleEmoji: '⚡',
    description:
      'I dag er det adrenalin og sjov! Prøv bowling, laser tag, gokart, klatring eller et escape room. Konkurrér imod hinanden og find ud af hvem der er bedst — kærlighed vinder altid!',
    activities: [
      { emoji: '🎳', text: 'Bowling og intens konkurrence' },
      { emoji: '🏎️', text: 'Gokart racing mod hinanden' },
      { emoji: '🎯', text: 'Laser tag eller paintball udfordring' },
      { emoji: '🧩', text: 'Escape room: 60 minutter til frihed!' },
      { emoji: '🎪', text: 'Tivoli eller forlystelsespark' },
    ],
    bgGradient: 'from-red-950 via-orange-950 to-amber-950',
    emoji: '⚡',
    tags: ['active', 'fun', 'adventure'],
  },
]

function calculateResult(answers: Option[]): DateResult {
  const tagCounts: Record<string, number> = {}
  answers.forEach((answer) => {
    answer.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  let best = DATE_RESULTS[0]
  let bestScore = -1
  DATE_RESULTS.forEach((result) => {
    const score = result.tags.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = result
    }
  })
  return best
}

// ==================== CONFETTI ====================

interface ConfettiParticle {
  id: number
  color: string
  left: string
  delay: string
  duration: string
  width: string
  height: string
}

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    if (active) {
      const colors = ['#ec4899', '#a855f7', '#f43f5e', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#c084fc']
      setParticles(
        Array.from({ length: 110 }, (_, i) => ({
          id: i,
          color: colors[i % colors.length],
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 1.2}s`,
          duration: `${2.5 + Math.random() * 2}s`,
          width: `${6 + Math.random() * 10}px`,
          height: `${8 + Math.random() * 14}px`,
        }))
      )
    } else {
      setParticles([])
    }
  }, [active])

  if (!active && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: p.left,
            top: '-20px',
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

// ==================== FLOATING PARTICLES ====================

function FloatingParticles() {
  const emojis = ['💕', '✨', '🌟', '💫', '❤️', '🦋', '🌸', '⭐', '💝', '🎀', '🌺', '💖']
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: `${5 + (i * 7) % 90}%`,
    duration: `${7 + (i * 1.1) % 8}s`,
    delay: `${(i * 0.9) % 7}s`,
    size: `${1.1 + (i * 0.18) % 1.3}rem`,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none"
          style={{
            left: p.left,
            bottom: '-10%',
            fontSize: p.size,
            opacity: 0,
            animation: `floatUp ${p.duration} ${p.delay} infinite linear`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

// ==================== WELCOME SCREEN ====================

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleClick = () => {
    const newSparkles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + i * 9,
      y: 10 + (i % 3) * 30,
    }))
    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 900)
    setTimeout(onStart, 260)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen text-center px-6 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-lg mx-auto">
        <div
          className="text-8xl mb-6 select-none"
          style={{ animation: 'heartbeat 1.6s ease-in-out infinite' }}
        >
          💕
        </div>

        <h1 className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent leading-tight">
          Hvad skal vi
          <br />
          lave i dag?
        </h1>

        <p className="text-white/70 text-xl mb-2">Tag quizzen og find ud af det! ✨</p>
        <p className="text-white/40 text-base mb-10">
          5 spørgsmål &nbsp;•&nbsp; Ingen forkerte svar &nbsp;•&nbsp; 100% sjov
        </p>

        <div className="relative inline-block">
          <button
            onClick={handleClick}
            className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:via-rose-400 hover:to-purple-500 text-white font-bold text-xl px-14 py-5 rounded-2xl shadow-2xl shadow-pink-500/40 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            style={{ animation: 'pulseGlow 2.2s ease-in-out infinite' }}
          >
            {sparkles.map((s) => (
              <span
                key={s.id}
                className="absolute pointer-events-none text-yellow-200 font-bold text-sm"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  animation: 'sparkleOut 0.9s ease-out forwards',
                }}
              >
                ✦
              </span>
            ))}
            Start Quiz! 🚀
          </button>
        </div>

        <p className="text-white/25 text-sm mt-8 italic">Lavet med ❤️ til dig</p>
      </div>
    </div>
  )
}

// ==================== PROGRESS BAR ====================

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100
  return (
    <div className="w-full max-w-lg mx-auto mb-8 px-4">
      <div className="flex justify-between text-white/40 text-xs mb-2">
        <span>Spørgsmål {current + 1} af {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < current
                ? 'bg-pink-400'
                : i === current
                ? 'bg-purple-400 scale-125'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== QUIZ SCREEN ====================

function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  selectedOption,
}: {
  question: Question
  questionIndex: number
  totalQuestions: number
  onAnswer: (option: Option) => void
  selectedOption: Option | null
}) {
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [questionIndex])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <ProgressBar current={questionIndex} total={totalQuestions} />

      <div
        key={animKey}
        className="w-full max-w-lg"
        style={{ animation: 'slideInRight 0.4s ease-out' }}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">
          <div className="text-center mb-6">
            <div
              className="text-5xl mb-3 select-none"
              style={{ animation: 'bounceIn 0.5s ease-out' }}
            >
              {question.emoji}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{question.question}</h2>
            <p className="text-white/45 text-sm">{question.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, i) => (
              <button
                key={option.id}
                onClick={() => onAnswer(option)}
                disabled={selectedOption !== null}
                className={`
                  relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-200 border-2
                  ${
                    selectedOption?.id === option.id
                      ? 'border-pink-400 bg-pink-500/20 scale-95 shadow-lg shadow-pink-500/30'
                      : selectedOption !== null
                      ? 'border-white/5 bg-white/5 opacity-30 cursor-not-allowed'
                      : 'border-white/10 bg-white/5 hover:border-pink-400/60 hover:bg-pink-500/10 hover:scale-105 active:scale-95 cursor-pointer'
                  }
                `}
                style={{
                  animationDelay: `${i * 0.08}s`,
                  animation: 'staggerIn 0.4s ease-out both',
                }}
              >
                {selectedOption?.id === option.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl" />
                )}
                <div className="text-3xl mb-2 select-none">{option.emoji}</div>
                <div className="text-white text-sm font-medium leading-snug">{option.text}</div>
                {selectedOption?.id === option.id && (
                  <div className="absolute top-2 right-3 text-pink-300 font-bold text-base">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== LOADING SCREEN ====================

function LoadingScreen() {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const phases = [
    'Analyserer dine svar...',
    'Beregner den perfekte date...',
    'Tilføjer lidt magi...',
    'Næsten klar! ✨',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((p) => Math.min(p + 1, phases.length - 1))
    }, 580)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="relative w-28 h-28 mb-8">
        <div
          className="text-6xl absolute inset-0 flex items-center justify-center select-none"
          style={{ animation: 'rotateSpin 3s linear infinite' }}
        >
          💫
        </div>
        <div className="text-3xl absolute inset-0 flex items-center justify-center select-none">
          ❤️
        </div>
      </div>

      <h2
        key={phaseIndex}
        className="text-2xl font-bold text-white mb-3"
        style={{ animation: 'fadeInUp 0.3s ease-out' }}
      >
        {phases[phaseIndex]}
      </h2>

      <p className="text-white/45 text-base">Finder den perfekte plan for jer to...</p>

      <div className="flex gap-3 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-pink-400 animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== RESULT SCREEN ====================

function ResultScreen({
  result,
  onRestart,
}: {
  result: DateResult
  onRestart: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [activitiesVisible, setActivitiesVisible] = useState<number[]>([])
  const [confettiActive, setConfettiActive] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => {
      setVisible(true)
      setConfettiActive(true)
    }, 150)
    const t2 = setTimeout(() => setConfettiActive(false), 4200)

    result.activities.forEach((_, i) => {
      setTimeout(() => {
        setActivitiesVisible((prev) => [...prev, i])
      }, 800 + i * 140)
    })

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [result])

  const handleCelebrate = () => {
    setConfettiActive(true)
    setCelebrating(true)
    setTimeout(() => setConfettiActive(false), 3200)
    setTimeout(() => setCelebrating(false), 500)
  }

  return (
    <>
      <Confetti active={confettiActive} />
      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 py-8 transition-all duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-lg">
          {/* Header */}
          <div
            className="text-center mb-7"
            style={{ animation: 'bounceIn 0.65s ease-out' }}
          >
            <div className="text-7xl mb-3 select-none">{result.emoji}</div>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest shadow-lg shadow-pink-500/30">
              Din perfekte dag! 🎉
            </div>
            <h2 className="text-3xl font-black text-white">
              {result.title} {result.titleEmoji}
            </h2>
          </div>

          {/* Description */}
          <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-4 shadow-2xl"
            style={{ animation: 'fadeInUp 0.5s 0.3s ease-out both' }}
          >
            <p className="text-white/80 leading-relaxed text-base">{result.description}</p>
          </div>

          {/* Activities */}
          <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl"
            style={{ animation: 'fadeInUp 0.5s 0.5s ease-out both' }}
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-base">
              <span>📋</span> Hvad I skal gøre:
            </h3>
            <div className="space-y-3">
              {result.activities.map((activity, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    activitiesVisible.includes(i)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-5'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0 select-none">{activity.emoji}</span>
                  <span className="text-white/80 text-sm">{activity.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div
            className="flex gap-3"
            style={{ animation: 'fadeInUp 0.5s 0.7s ease-out both' }}
          >
            <button
              onClick={onRestart}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-2xl border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              🔄 Prøv igen
            </button>
            <button
              onClick={handleCelebrate}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-500/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              style={celebrating ? { animation: 'wiggle 0.5s ease-in-out' } : {}}
            >
              💕 Vi gør det!
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ==================== MAIN APP ====================

type AppState = 'welcome' | 'quiz' | 'loading' | 'result'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [result, setResult] = useState<DateResult | null>(null)

  const handleStart = useCallback(() => {
    setAppState('quiz')
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedOption(null)
  }, [])

  const handleAnswer = useCallback(
    (option: Option) => {
      setSelectedOption(option)
      setTimeout(() => {
        const newAnswers = [...answers, option]
        setAnswers(newAnswers)
        setSelectedOption(null)
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion((q) => q + 1)
        } else {
          setAppState('loading')
          setTimeout(() => {
            setResult(calculateResult(newAnswers))
            setAppState('result')
          }, 2600)
        }
      }, 620)
    },
    [answers, currentQuestion]
  )

  const handleRestart = useCallback(() => {
    setAnswers([])
    setCurrentQuestion(0)
    setSelectedOption(null)
    setResult(null)
    setAppState('welcome')
  }, [])

  const bgClass =
    result && appState === 'result'
      ? `bg-gradient-to-br ${result.bgGradient}`
      : 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'

  return (
    <div className={`min-h-screen ${bgClass} transition-all duration-1000`}>
      <FloatingParticles />
      <div className="relative z-10">
        {appState === 'welcome' && <WelcomeScreen onStart={handleStart} />}
        {appState === 'quiz' && (
          <QuizScreen
            question={QUESTIONS[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={QUESTIONS.length}
            onAnswer={handleAnswer}
            selectedOption={selectedOption}
          />
        )}
        {appState === 'loading' && <LoadingScreen />}
        {appState === 'result' && result && (
          <ResultScreen result={result} onRestart={handleRestart} />
        )}
      </div>
    </div>
  )
}
