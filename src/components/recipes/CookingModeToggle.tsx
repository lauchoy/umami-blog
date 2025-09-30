'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { startCookingSession, updateCookingSession } from '@/lib/firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckIcon,
  ClockIcon,
  UsersIcon,
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ForwardIcon,
  BackwardIcon
} from '@heroicons/react/24/outline'

interface Recipe {
  _id: string
  title: string
  instructions: Instruction[]
  prepTime: number
  cookTime: number
}

interface Instruction {
  _key: string
  step: number
  description: string
  duration?: number
  temperature?: number
  image?: string
  video?: string
  tips?: string[]
}

interface CookingSession {
  id: string
  userId: string
  recipeId: string
  currentStep: number
  stepStartTime?: Date
  totalTime: number
  participants: string[]
  isActive: boolean
  isPaused: boolean
  startedAt: Date
  completedAt?: Date
}

interface CookingModeToggleProps {
  recipe: Recipe
}

export default function CookingModeToggle({ recipe }: CookingModeToggleProps) {
  const { user } = useAuth()
  const [session, setSession] = useState<CookingSession | null>(null)
  const [showCookingMode, setShowCookingMode] = useState(false)
  const [currentStepTime, setCurrentStepTime] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [totalElapsedTime, setTotalElapsedTime] = useState(0)
  const [sessionParticipants, setSessionParticipants] = useState<string[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for timer notifications
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/timer-notification.mp3')
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    }
  }, [])

  const startCooking = async () => {
    if (!user) return

    try {
      const sessionId = await startCookingSession(user.uid, recipe._id)
      const newSession: CookingSession = {
        id: sessionId,
        userId: user.uid,
        recipeId: recipe._id,
        currentStep: 0,
        stepStartTime: new Date(),
        totalTime: 0,
        participants: [user.uid],
        isActive: true,
        isPaused: false,
        startedAt: new Date()
      }

      setSession(newSession)
      setShowCookingMode(true)
      startTimers()
    } catch (error) {
      console.error('Error starting cooking session:', error)
    }
  }

  const startTimers = () => {
    // Total session timer
    timerRef.current = setInterval(() => {
      setTotalElapsedTime(prev => prev + 1)
    }, 1000)

    // Current step timer
    stepTimerRef.current = setInterval(() => {
      setCurrentStepTime(prev => prev + 1)
    }, 1000)
  }

  const pauseSession = async () => {
    if (!session) return

    const updatedSession = { ...session, isPaused: !session.isPaused }
    setSession(updatedSession)

    try {
      await updateCookingSession(session.id, { isPaused: updatedSession.isPaused })
    } catch (error) {
      console.error('Error updating session:', error)
    }

    if (updatedSession.isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    } else {
      startTimers()
    }
  }

  const nextStep = async () => {
    if (!session || session.currentStep >= recipe.instructions.length - 1) return

    const newStepIndex = session.currentStep + 1
    const updatedSession = {
      ...session,
      currentStep: newStepIndex,
      stepStartTime: new Date()
    }

    setSession(updatedSession)
    setCurrentStepTime(0)

    // Play sound notification
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    try {
      await updateCookingSession(session.id, {
        currentStep: newStepIndex,
        stepStartTime: new Date()
      })
    } catch (error) {
      console.error('Error updating step:', error)
    }
  }

  const previousStep = async () => {
    if (!session || session.currentStep <= 0) return

    const newStepIndex = session.currentStep - 1
    const updatedSession = {
      ...session,
      currentStep: newStepIndex,
      stepStartTime: new Date()
    }

    setSession(updatedSession)
    setCurrentStepTime(0)

    try {
      await updateCookingSession(session.id, {
        currentStep: newStepIndex,
        stepStartTime: new Date()
      })
    } catch (error) {
      console.error('Error updating step:', error)
    }
  }

  const completeCooking = async () => {
    if (!session) return

    const updatedSession = {
      ...session,
      isActive: false,
      completedAt: new Date(),
      totalTime: totalElapsedTime
    }

    setSession(updatedSession)
    setShowCookingMode(false)

    if (timerRef.current) clearInterval(timerRef.current)
    if (stepTimerRef.current) clearInterval(stepTimerRef.current)

    try {
      await updateCookingSession(session.id, {
        isActive: false,
        completedAt: new Date(),
        totalTime: totalElapsedTime
      })
    } catch (error) {
      console.error('Error completing session:', error)
    }
  }

  const shareSession = async () => {
    if (!session) return

    try {
      const shareData = {
        title: `Cooking ${recipe.title}`,
        text: `Join me cooking ${recipe.title}! Follow along with the real-time cooking session.`,
        url: `${window.location.origin}/cooking-session/${session.id}`
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
      }
    } catch (error) {
      console.error('Error sharing session:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const currentInstruction = session && recipe.instructions[session.currentStep]
  const progress = session ? ((session.currentStep + 1) / recipe.instructions.length) * 100 : 0
  const estimatedTotalTime = recipe.prepTime + recipe.cookTime

  return (
    <>
      {/* Cooking Mode Toggle */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Ready to Cook?</h2>
            <p className="text-orange-100 mb-4">
              Start cooking mode for step-by-step guidance with timers and real-time sharing
            </p>
            {session && session.isActive && (
              <div className="flex items-center space-x-4 text-orange-100">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Session: {formatTime(totalElapsedTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{sessionParticipants.length} cooking</span>
                </div>
                <Badge className="bg-green-500 text-white">
                  Step {session.currentStep + 1} of {recipe.instructions.length}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {session && session.isActive ? (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowCookingMode(true)}
                  className="bg-white text-orange-600 hover:bg-orange-50"
                >
                  Continue Cooking
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={completeCooking}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <StopIcon className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={startCooking}
                disabled={!user}
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Cooking
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cooking Mode Dialog */}
      <Dialog open={showCookingMode} onOpenChange={setShowCookingMode}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Cooking {recipe.title}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  Step {session?.currentStep ? session.currentStep + 1 : 1} of {recipe.instructions.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <SpeakerWaveIcon className="h-4 w-4" />
                  ) : (
                    <SpeakerXMarkIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              Follow along with step-by-step instructions and timers
            </DialogDescription>
          </DialogHeader>

          {session && currentInstruction && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Timers */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-umami-sage">
                      {formatTime(totalElapsedTime)}
                    </div>
                    <div className="text-sm text-gray-600">Total Time</div>
                    <div className="text-xs text-gray-400">
                      Est. {formatTime(estimatedTotalTime * 60)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(currentStepTime)}
                    </div>
                    <div className="text-sm text-gray-600">Current Step</div>
                    {currentInstruction.duration && (
                      <div className="text-xs text-gray-400">
                        Target: {currentInstruction.duration}min
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {sessionParticipants.length}
                    </div>
                    <div className="text-sm text-gray-600">Cooking Together</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareSession}
                      className="text-xs mt-1"
                    >
                      <ShareIcon className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Current Step */}
              <Card className="border-2 border-umami-sage">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Step {session.currentStep + 1}</span>
                    {currentInstruction.temperature && (
                      <Badge variant="secondary">
                        {currentInstruction.temperature}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4">{currentInstruction.description}</p>

                  {currentInstruction.tips && currentInstruction.tips.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {currentInstruction.tips.map((tip, index) => (
                          <li key={index} className="text-blue-800">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={session.currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <BackwardIcon className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={pauseSession}
                    className="flex items-center space-x-2"
                  >
                    {session.isPaused ? (
                      <>
                        <PlayIcon className="h-4 w-4" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <PauseIcon className="h-4 w-4" />
                        <span>Pause</span>
                      </>
                    )}
                  </Button>

                  {session.currentStep === recipe.instructions.length - 1 ? (
                    <Button
                      onClick={completeCooking}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Complete</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="flex items-center space-x-2"
                    >
                      <span>Next Step</span>
                      <ForwardIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Button
                  variant="destructive"
                  onClick={completeCooking}
                  className="flex items-center space-x-2"
                >
                  <StopIcon className="h-4 w-4" />
                  <span>Stop Cooking</span>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCookingMode(false)}>
              Minimize
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}