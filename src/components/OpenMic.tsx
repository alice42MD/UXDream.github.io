import { useState, useRef, useEffect } from "react"
import Meyda from "meyda"
import { Button } from "antd"
import _ from "lodash"
import { StyledOpenMic } from "../styles/styleVolume"

type MeydaAnalyzer = ReturnType<typeof Meyda.createMeydaAnalyzer>

const OpenMic = ({
  onChange,
  children,
}: {
  onChange: (value: number) => void
  children: JSX.Element
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [SoundEnergyValue, setSoundEnergyValue] = useState<number>(0)
  const analyzerRef = useRef<MeydaAnalyzer | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const debouncedOnChangeRef = useRef(_.debounce(onChange, 30)) // Debouncing

  const startAnalysis = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Audio capture is not supported in this browser.")
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      audioContextRef.current = audioContext

      analyzerRef.current = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        bufferSize: 512,
        sampleRate: audioContext.sampleRate,
        featureExtractors: ["loudness"],
        callback: (features: {
          loudness: {
            specific: number
            total: number
          }
        }) => {
          setSoundEnergyValue(_.round(features.loudness.total))
        },
      })

      if (analyzerRef.current) {
        analyzerRef.current.start()
        setIsAnalyzing(true)
      }
    } catch (error) {
      console.error("Error initializing audio analyzer:", error)
      alert("Failed to start audio analysis. Check microphone permissions.")
    }
  }

  const stopAnalysis = () => {
    if (analyzerRef.current) {
      analyzerRef.current.stop()
      analyzerRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsAnalyzing(false)
  }

  const toggleAnalysis = () => {
    if (isAnalyzing) {
      stopAnalysis()
    } else {
      startAnalysis()
    }
  }

  useEffect(() => {
    return () => {
      stopAnalysis() // Cleanup on unmount
    }
  }, [])

  useEffect(() => {
    if (SoundEnergyValue && isAnalyzing) {
      debouncedOnChangeRef.current(SoundEnergyValue)
    }
  }, [SoundEnergyValue, isAnalyzing])

  return (
    <StyledOpenMic className="audio-analyzer">
      <div>
        <Button onClick={toggleAnalysis}>
          {isAnalyzing ? "Stop" : "Start"}
        </Button>
      </div>
      {children}
    </StyledOpenMic>
  )
}

export default OpenMic
