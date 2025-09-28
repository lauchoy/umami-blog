'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  LightBulbIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

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

interface RecipeInstructionsProps {
  instructions: Instruction[]
}

export default function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [currentStep, setCurrentStep] = useState(0)
  const [isCookingMode, setIsCookingMode] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const toggleStep = (key: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(key)) {
      newCompleted.delete(key)
    } else {
      newCompleted.add(key)
    }
    setCompletedSteps(newCompleted)
  }

  const startCookingMode = () => {
    setIsCookingMode(true)
    setCurrentStep(0)
  }

  const exitCookingMode = () => {
    setIsCookingMode(false)
    setIsTimerRunning(false)
    setTimer(null)
  }

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimer(null)
      setIsTimerRunning(false)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setTimer(null)
      setIsTimerRunning(false)
    }
  }

  const startTimer = (duration: number) => {
    setTimer(duration * 60) // Convert minutes to seconds
    setIsTimerRunning(true)
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCompletionPercentage = () => {
    if (instructions.length === 0) return 0
    return Math.round((completedSteps.size / instructions.length) * 100)
  }

  // Cooking Mode View
  if (isCookingMode) {
    const instruction = instructions[currentStep]

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Cooking Mode Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Cooking Mode</h2>
              <Badge variant="outline">
                Step {currentStep + 1} of {instructions.length}
              </Badge>
            </div>
            <Button variant="outline" onClick={exitCookingMode}>
              Exit Cooking Mode
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / instructions.length) * 100}%` }}
            />
          </div>

          {/* Current Step */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Step Image/Video */}
            {instruction.image && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={instruction.image}
                  alt={`Step ${instruction.step}`}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Step Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Step {instruction.step}
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {instruction.description}
                </p>
              </div>

              {/* Step Metadata */}
              <div className="flex flex-wrap gap-4">
                {instruction.duration && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {instruction.duration} minutes
                    </span>
                    {timer === null && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startTimer(instruction.duration!)}
                      >
                        Start Timer
                      </Button>
                    )}
                  </div>
                )}

                {instruction.temperature && (
                  <div className="flex items-center gap-2">
                    <FireIcon className="h-5 w-5 text-red-400" />
                    <span className="text-sm text-gray-600">
                      {instruction.temperature}°F
                    </span>
                  </div>
                )}
              </div>

              {/* Timer */}
              {timer !== null && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-orange-900">
                        {formatTime(timer)}
                      </p>
                      <p className="text-sm text-orange-700">
                        {isTimerRunning ? 'Timer running' : 'Timer paused'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={toggleTimer}
                      variant={isTimerRunning ? "outline" : "default"}
                    >
                      {isTimerRunning ? (
                        <>
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Resume
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tips */}
              {instruction.tips && instruction.tips.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <LightBulbIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
                      <ul className="space-y-1">
                        {instruction.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-blue-800">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              <BackwardIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={() => toggleStep(instruction._key)}
              variant={completedSteps.has(instruction._key) ? "default" : "outline"}
              className="px-8"
            >
              {completedSteps.has(instruction._key) ? (
                <>
                  <CheckCircleSolidIcon className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>

            <Button
              onClick={nextStep}
              disabled={currentStep === instructions.length - 1}
            >
              Next
              <ForwardIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Regular View
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Instructions
            <Badge variant="outline" className="text-xs">
              {getCompletionPercentage()}% complete
            </Badge>
          </CardTitle>
          <Button onClick={startCookingMode}>
            <PlayIcon className="h-4 w-4 mr-2" />
            Cooking Mode
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(instruction._key)

          return (
            <div
              key={instruction._key}
              className={`border rounded-lg p-6 transition-all ${
                isCompleted
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  id={instruction._key}
                  checked={isCompleted}
                  onCheckedChange={() => toggleStep(instruction._key)}
                  className="mt-1"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={isCompleted ? "default" : "outline"}
                      className="text-sm"
                    >
                      Step {instruction.step}
                    </Badge>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {instruction.duration && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {instruction.duration} min
                        </div>
                      )}
                      {instruction.temperature && (
                        <div className="flex items-center gap-1">
                          <FireIcon className="h-4 w-4 text-red-400" />
                          {instruction.temperature}°F
                        </div>
                      )}
                    </div>
                  </div>

                  <p className={`text-gray-900 leading-relaxed mb-4 ${
                    isCompleted ? 'line-through text-gray-500' : ''
                  }`}>
                    {instruction.description}
                  </p>

                  {/* Step Image */}
                  {instruction.image && (
                    <div className="mb-4">
                      <Image
                        src={instruction.image}
                        alt={`Step ${instruction.step}`}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Tips */}
                  {instruction.tips && instruction.tips.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <LightBulbIcon className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 text-sm mb-1">
                            Pro Tips
                          </h4>
                          <ul className="space-y-1">
                            {instruction.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-blue-800">
                                • {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}